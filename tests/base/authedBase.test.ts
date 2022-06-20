import {randomBytes} from 'crypto';
import {serialize} from 'cookie';
import mysql from 'mysql2/promise';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../config';
import AuthedBase from '../../src/base/authedBase';
import {authHandlerWrapper} from '../../src/base/handlerWrapper';
import {TestUser} from '../../src/tests/user';

describe('login', () => {
  let db: mysql.Connection;
  let sessionToken: string;
  let userId: number;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();

    const user = new TestUser();
    await user.create(db);
    await user.addSession(db);

    sessionToken = user.session?.session_token || '';
    userId = user.user?.id || NaN;
  });

  afterAll(async () => {
    await db.end();
  });

  test('cookieが設定されている場合、認証される', async () => {
    expect.hasAssertions();

    const handler = async (base: AuthedBase<void>) => {
      const user = base.user;

      expect(user).not.toBeUndefined();
      expect(user?.id).toBe(userId);
    };

    const h = authHandlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: serialize(
            config.sessionCookieName,
            sessionToken,
            config.sessionCookieOptions()
          ),
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });

  test('cookieがない場合は認証できない', async () => {
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
          cookie: serialize(
            config.sessionCookieName,
            randomBytes(128).toString('hex'),
            config.sessionCookieOptions()
          ),
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(403);

        expect(res.cookies[0][config.sessionCookieName]).toBe('');
        expect(res.cookies[0]['max-age']).toBe('-1');
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
          cookie: serialize(
            config.sessionCookieName,
            sessionToken,
            config.sessionCookieOptions()
          ),
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
          cookie: user.sessionCookie,
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
          cookie: user.sessionCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(403);
      },
    });
  });
});
