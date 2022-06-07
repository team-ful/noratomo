import {serialize} from 'cookie';
import mysql from 'mysql2/promise';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../../config';
import logoutHandler from '../../../pages/api/logout';
import {findUserBySessionToken} from '../../../src/services/user';
import {TestUser} from '../../../src/tests/user';

describe('パスワードでログイン', () => {
  let db: mysql.Connection;
  let sessionToken: string;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();

    const u = new TestUser();
    await u.create(db);
    await u.loginFromPassword(db);
    await u.addSession(db);

    sessionToken = u.session?.session_token || '';
  });

  afterAll(async () => {
    await db.end();
  });

  test('ログアウトできる', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: logoutHandler,
      requestPatcher: async req => {
        req.headers = {
          cookie: serialize(config.sessionCookieName, sessionToken),
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);

        const u = await findUserBySessionToken(db, sessionToken);

        expect(u).toBeNull();

        expect(res.cookies[0]['max-age'] === '-1').toBeTruthy();
      },
    });
  });
});
