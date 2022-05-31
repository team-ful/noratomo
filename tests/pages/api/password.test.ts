import mysql from 'mysql2/promise';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../../config';
import passwordLoginHandler from '../../../pages/api/login/password';
import User from '../../../src/models/user';
import {findUserBySessionToken} from '../../../src/services/user';
import {TestUser} from '../../../src/tests/user';

describe('パスワードでログイン', () => {
  let db: mysql.Connection;
  let user: User;
  let password: string;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();

    const u = new TestUser();
    await u.create(db);
    await u.loginFromPassword(db);

    password = u.password || '';
    if (typeof u.user !== 'undefined') {
      user = u.user;
    }
  });

  afterAll(async () => {
    await db.end();
  });

  test('メールアドレスとパスワードでログインができる', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: passwordLoginHandler,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: `user=${user.mail}&password=${password}`,
        });

        expect(res.status).toBe(200);

        const session: string = res.cookies[0][config.sessionCookieName];

        const u = await findUserBySessionToken(db, session);

        expect(u?.id).toBe(user.id);
      },
    });
  });

  test('ユーザ名とパスワードでログインができる', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: passwordLoginHandler,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: `user=${user.user_name}&password=${password}`,
        });

        expect(res.status).toBe(200);

        const session: string = res.cookies[0][config.sessionCookieName];

        const u = await findUserBySessionToken(db, session);

        expect(u?.id).toBe(user.id);
      },
    });
  });
});
