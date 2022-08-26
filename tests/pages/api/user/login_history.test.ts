import {send} from 'process';
import {testApiHandler} from 'next-test-api-route-handler';
import {BaseNextRequest} from 'next/dist/server/base-http';
import login_historyHandler from '../../../../pages/api/user/login_history';
import AuthedBase from '../../../../src/base/base';
import {findLoginHistoriesByUserID} from '../../../../src/services/loginHistory';
import TestBase from '../../../../src/tests/base';

/**
 *@param {AuthedBase<void>} bbase -bbase
 */

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

  test('login_history', async () => {
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

          expect(await res.json()).toEqual(d);
        }
      },
    });
  });
});
