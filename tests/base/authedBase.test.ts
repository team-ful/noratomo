import {serialize} from 'cookie';
import mysql from 'mysql2/promise';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../config';
import AuthedBase from '../../src/base/authedBase';
import {authHandlerWrapper} from '../../src/base/handlerWrapper';
import {findLoginHistoriesByUserID} from '../../src/services/loginHistory';
import {TestUser} from '../../src/tests/user';
import {randomText} from '../../src/utils/random';

describe('login', () => {
  let db: mysql.Connection;
  const user = new TestUser();

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();

    await user.create(db);
  });

  beforeEach(async () => {
    await user.addSession(db);
  });

  afterAll(async () => {
    await db.end();
  });

  test('session-token, refresh-tokenどちらのcookieも設定されている場合、認証される', async () => {
    expect.hasAssertions();

    const beforeLoginHistory = await findLoginHistoriesByUserID(
      db,
      user.user?.id || NaN
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
          cookie: user.cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const loginHistory = await findLoginHistoriesByUserID(
          db,
          user.user?.id || NaN
        );

        expect(loginHistory).not.toBeNull();
        expect(loginHistory?.length).toBe(beforeLoginHistory?.length);
      },
    });
  });

  test('session-token cookieが設定されている場合、それを使用して認証される', async () => {
    expect.hasAssertions();

    const beforeLoginHistory = await findLoginHistoriesByUserID(
      db,
      user.user?.id || NaN
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
          cookie: user.sessionCookie,
        };
      },

      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const loginHistory = await findLoginHistoriesByUserID(
          db,
          user.user?.id || NaN
        );

        expect(loginHistory).not.toBeNull();
        expect(loginHistory?.length).toBe(beforeLoginHistory?.length);
      },
    });
  });

  test('refresh-token cookieが設定されている場合、それを使用して認証される', async () => {
    expect.hasAssertions();

    const beforeLoginHistory = await findLoginHistoriesByUserID(
      db,
      user.user?.id || NaN
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
          cookie: user.refreshCookie,
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

        expect(sessionToken).not.toBe(user.session?.session_token);
        expect(refreshToken).not.toBe(user.session?.refresh_token);

        const loginHistory = await findLoginHistoriesByUserID(
          db,
          user.user?.id || NaN
        );

        expect(loginHistory).not.toBeNull();
        expect(loginHistory?.length).not.toBe(beforeLoginHistory?.length);
      },
    });
  });

  test('session-token cookieが不正な場合はrefresh-tokenを使用してログインする', async () => {
    expect.hasAssertions();

    const beforeLoginHistory = await findLoginHistoriesByUserID(
      db,
      user.user?.id || NaN
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
          cookie: `${user.refreshCookie}; ${serialize(
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

        expect(sessionToken).not.toBe(user.session?.session_token);
        expect(refreshToken).not.toBe(user.session?.refresh_token);

        const loginHistory = await findLoginHistoriesByUserID(
          db,
          user.user?.id || NaN
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
      const u = base.getPublicUserData();
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
      });
    };

    const h = authHandlerWrapper(handler, 'GET');

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

  test('adminOnly', async () => {
    expect.hasAssertions();

    const handler = async (base: AuthedBase<void>) => {
      base.adminOnly();
    };

    const h = authHandlerWrapper(handler, 'GET');

    const user = new TestUser({is_admin: true});
    await user.create(db);
    await user.addSession(db);

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
    await user.create(db);
    await user.addSession(db);

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
});
