import {serialize} from 'cookie';
import mysql from 'mysql2/promise';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../../../config';
import meHandler from '../../../../pages/api/user/me';
import {TestUser} from '../../../../src/tests/user';
import User from 'src/models/user';

describe('me', () => {
  let db: mysql.Connection;
  let sessionToken: string;
  let user: User;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();

    const u = new TestUser();
    await u.create(db);
    await u.loginFromPassword(db);
    await u.addSession(db);

    if (u.user) {
      user = u.user;
    }
    sessionToken = u.session?.session_token || '';
  });

  afterAll(async () => {
    await db.end();
  });

  test('me', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: meHandler,
      requestPatcher: async req => {
        req.headers = {
          cookie: serialize(config.sessionCookieName, sessionToken),
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);

        expect(await res.json()).toEqual({
          display_name: user.display_name,
          mail: user.mail,
          profile: user.profile,
          user_name: user.user_name,
          age: user.age,
          gender: user.gender,
          is_admin: user.is_admin,
          avatar_url: user.avatar_url,
          join_date: user.join_date.toISOString(),
        });
      },
    });
  });
});
