import {testApiHandler} from 'next-test-api-route-handler';
import logoutHandler from '../../../pages/api/logout';
import {findUserBySessionToken} from '../../../src/services/user';
import TestBase from '../../../src/tests/base';

describe('パスワードでログイン', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();

    const u = await base.newUser();
    await u.loginFromPassword(base.db);
    await u.addSession(base.db);
  });

  afterAll(async () => {
    await base.end();
  });

  test('ログアウトできる', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: logoutHandler,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);

        const u = await findUserBySessionToken(
          base.db,
          base.users[0].session?.session_token || ''
        );

        expect(u).toBeNull();

        expect(res.cookies[0]['max-age'] === '-1').toBeTruthy();
      },
    });
  });
});
