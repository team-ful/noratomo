import {testApiHandler} from 'next-test-api-route-handler';
import login_historyHandler from '../../../../pages/api/user/login_history';
import {findLoginHistoriesByUserID} from '../../../../src/services/loginHistory';
import TestBase from '../../../../src/tests/base';

describe('login_history', () => {
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

  test('dbからデータを取得できている', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: login_historyHandler,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);
        if (res.status && base.users[0].user?.id) {
          const findedLoginHistory = await findLoginHistoriesByUserID(
            base.db,
            base.users[0].user?.id
          );
          const d = findedLoginHistory.map(x => x.json());
          const dJson = JSON.stringify(d);

          expect(await res.json()).toStrictEqual(JSON.parse(dJson));
        }
      },
    });
  });
});
