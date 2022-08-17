import {serialize} from 'cookie';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../config';
import AuthedBase from '../../src/base/authedBase';
import {authHandlerWrapper} from '../../src/base/handlerWrapper';
import {findLoginHistoriesByUserID} from '../../src/services/loginHistory';
import {findUserByUserID} from '../../src/services/user';
import TestBase from '../../src/tests/base';
import {TestUser} from '../../src/tests/user';
import {randomText} from '../../src/utils/random';

describe('login', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
    await base.newUser();
  });

  beforeEach(async () => {
    await base.users[0].addSession(base.db);
  });

  afterAll(async () => {
    await base.end();
  });

  test('session-token, refresh-tokenどちらのcookieも設定されている場合、認証される', async () => {
    expect.hasAssertions();

    const beforeLoginHistory = await findLoginHistoriesByUserID(
      base.db,
      base.users[0].user?.id || NaN
    );

    const handler = async (base: AuthedBase<void>) => {
      const user = base.user;

      expect(user).not.toBeUndefined();
      expect(user?.id).toBe(user.id);
    };

    const h = authHandlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const loginHistory = await findLoginHistoriesByUserID(
          base.db,
          base.users[0].user?.id || NaN
        );

        expect(loginHistory).not.toBeNull();
        expect(loginHistory?.length).toBe(beforeLoginHistory?.length);
      },
    });
  });

  test('session-token cookieが設定されている場合、それを使用して認証される', async () => {
    expect.hasAssertions();

    const beforeLoginHistory = await findLoginHistoriesByUserID(
      base.db,
      base.users[0].user?.id || NaN
    );

    const handler = async (base: AuthedBase<void>) => {
      const user = base.user;

      expect(user).not.toBeUndefined();
      expect(user?.id).toBe(user.id);
    };

    const h = authHandlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
        };
      },

      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const loginHistory = await findLoginHistoriesByUserID(
          base.db,
          base.users[0].user?.id || NaN
        );

        expect(loginHistory).not.toBeNull();
        expect(loginHistory?.length).toBe(beforeLoginHistory?.length);
      },
    });
  });

  test('refresh-token cookieが設定されている場合、それを使用して認証される', async () => {
    expect.hasAssertions();

    const beforeLoginHistory = await findLoginHistoriesByUserID(
      base.db,
      base.users[0].user?.id || NaN
    );

    const handler = async (base: AuthedBase<void>) => {
      const user = base.user;

      expect(user).not.toBeUndefined();
      expect(user?.id).toBe(user.id);
    };

    const h = authHandlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].refreshCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        let sessionToken = '';
        let refreshToken = '';

        for (const c of res.cookies) {
          if (typeof c[config.sessionCookieName] === 'string') {
            sessionToken = c[config.sessionCookieName];
          } else if (typeof c[config.refreshCookieName] === 'string') {
            refreshToken = c[config.refreshCookieName];
          }
        }

        // Tokenは更新される
        expect(sessionToken).not.toBe('');
        expect(refreshToken).not.toBe('');

        expect(sessionToken).not.toBe(base.users[0].session?.session_token);
        expect(refreshToken).not.toBe(base.users[0].session?.refresh_token);

        const loginHistory = await findLoginHistoriesByUserID(
          base.db,
          base.users[0].user?.id || NaN
        );

        expect(loginHistory).not.toBeNull();
        expect(loginHistory?.length).not.toBe(beforeLoginHistory?.length);
      },
    });
  });

  test('session-token cookieが不正な場合はrefresh-tokenを使用してログインする', async () => {
    expect.hasAssertions();

    const beforeLoginHistory = await findLoginHistoriesByUserID(
      base.db,
      base.users[0].user?.id || NaN
    );

    const handler = async (base: AuthedBase<void>) => {
      const user = base.user;

      expect(user).not.toBeUndefined();
      expect(user?.id).toBe(user.id);
    };

    const h = authHandlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: `${base.users[0].refreshCookie}; ${serialize(
            config.sessionCookieName,
            randomText(128),
            config.sessionCookieOptions()
          )}`,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        let sessionToken = '';
        let refreshToken = '';

        for (const c of res.cookies) {
          if (typeof c[config.sessionCookieName] === 'string') {
            sessionToken = c[config.sessionCookieName];
          } else if (typeof c[config.refreshCookieName] === 'string') {
            refreshToken = c[config.refreshCookieName];
          }
        }

        // Tokenは更新される
        expect(sessionToken).not.toBe('');
        expect(refreshToken).not.toBe('');

        expect(sessionToken).not.toBe(base.users[0].session?.session_token);
        expect(refreshToken).not.toBe(base.users[0].session?.refresh_token);

        const loginHistory = await findLoginHistoriesByUserID(
          base.db,
          base.users[0].user?.id || NaN
        );

        expect(loginHistory).not.toBeNull();
        expect(loginHistory?.length).not.toBe(beforeLoginHistory?.length);
      },
    });
  });

  test('なにもcookieがない場合は認証できない', async () => {
    expect.hasAssertions();

    const handler = async () => {
      null;
    };

    const h = authHandlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(403);
      },
    });
  });

  test('cookieはあるが、値が不正な場合は認証できない', async () => {
    expect.hasAssertions();

    const handler = async () => {
      null;
    };

    const h = authHandlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: `${serialize(
            config.refreshCookieName,
            randomText(128),
            config.refreshCookieOptions()
          )}; ${serialize(
            config.sessionCookieName,
            randomText(128),
            config.sessionCookieOptions()
          )}`,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(403);

        const sessionCookie = res.cookies.find(
          v => typeof v[config.sessionCookieName] === 'string'
        );

        expect(sessionCookie).not.toBeUndefined();
        if (sessionCookie) {
          expect(sessionCookie[config.sessionCookieName]).toBe('');
          expect(sessionCookie['max-age']).toBe('-1');
        }
      },
    });
  });

  test('getPublicUserData', async () => {
    expect.hasAssertions();

    const handler = async (base: AuthedBase<void>) => {
      const u = await base.getPublicUserData();
      const ua = base.user;

      expect(u).toEqual({
        display_name: ua.display_name,
        mail: ua.mail,
        profile: ua.profile,
        user_name: ua.user_name,
        age: ua.age,
        gender: ua.gender,
        is_admin: ua.is_admin,
        avatar_url: ua.avatar_url,
        join_date: ua.join_date,
        notice: [],
      });
    };

    const h = authHandlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });

  test('adminOnly', async () => {
    expect.hasAssertions();

    const handler = async (base: AuthedBase<void>) => {
      base.adminOnly();
    };

    const h = authHandlerWrapper(handler, 'GET');

    const user = new TestUser({is_admin: true});
    await user.create(base.db);
    await user.addSession(base.db);

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });

  test('adminOnlyで通常ユーザ', async () => {
    expect.hasAssertions();

    const handler = async (base: AuthedBase<void>) => {
      base.adminOnly();
    };

    const h = authHandlerWrapper(handler, 'GET');

    const user = new TestUser();
    await user.create(base.db);
    await user.addSession(base.db);

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(403);
      },
    });
  });

  test('updateAvatar', async () => {
    expect.hasAssertions();

    const newAvatar = randomText(20);

    const handler = async (base: AuthedBase<void>) => {
      await base.updateAvatar(newAvatar);
    };

    const h = authHandlerWrapper(handler, 'GET');

    const user = new TestUser({avatar_url: randomText(20)});
    await user.create(base.db);
    await user.addSession(base.db);

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const newUser = await findUserByUserID(base.db, user.user?.id || NaN);

        expect(newUser.avatar_url).toBe(newAvatar);
        expect(newUser.avatar_url).not.toBe(user.user?.avatar_url);
      },
    });
  });
});
