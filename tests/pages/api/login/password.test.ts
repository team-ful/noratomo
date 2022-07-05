import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../../../config';
import passwordLoginHandler from '../../../../pages/api/login/password';
import {findUserBySessionToken} from '../../../../src/services/user';
import TestBase from '../../../../src/tests/base';

describe('パスワードでログイン', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();

    await (await base.newUser()).loginFromPassword(base.db);
  });

  afterAll(async () => {
    await base.end();
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
          body: `user=${base.users[0].user?.mail}&password=${base.users[0].password}`,
        });

        expect(res.status).toBe(200);

        const session: string = res.cookies[0][config.sessionCookieName];

        const u = await findUserBySessionToken(base.db, session);

        expect(u?.id).toBe(base.users[0].user?.id);
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
          body: `user=${base.users[0].user?.user_name}&password=${base.users[0].password}`,
        });

        expect(res.status).toBe(200);

        const session: string = res.cookies[0][config.sessionCookieName];

        const u = await findUserBySessionToken(base.db, session);

        expect(u?.id).toBe(base.users[0].user?.id);
      },
    });
  });

  test('値が不正な場合は400', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: passwordLoginHandler,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: `user=${base.users[0].user?.user_name}`,
        });

        expect(res.status).toBe(400);
      },
    });
  });
});
