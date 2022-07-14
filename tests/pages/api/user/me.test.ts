import {testApiHandler} from 'next-test-api-route-handler';
import meHandler from '../../../../pages/api/user/me';
import TestBase from '../../../../src/tests/base';

describe('me', () => {
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

  test('me', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: meHandler,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);

        expect(await res.json()).toEqual({
          display_name: base.users[0].user?.display_name,
          mail: base.users[0].user?.mail,
          profile: base.users[0].user?.profile,
          user_name: base.users[0].user?.user_name,
          age: base.users[0].user?.age,
          gender: base.users[0].user?.gender,
          is_admin: base.users[0].user?.is_admin,
          avatar_url: base.users[0].user?.avatar_url,
          join_date: base.users[0].user?.join_date.toISOString(),
        });
      },
    });
  });
});
