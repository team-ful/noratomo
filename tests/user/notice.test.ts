import {testApiHandler} from 'next-test-api-route-handler';
import TestBase from '../../src/tests/base';
import {get} from '../../src/user/notice';

describe('notice', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('get', async () => {
    const user = await base.newUser();
    await user.addSession(base.db);

    for (let i = 0; 3 > i; i++) {
      await user.notice(base.db, 'hogehoge');
    }

    await testApiHandler({
      handler: get,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({method: 'GET'});

        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.length).toBe(3);
      },
    });
  });
});
