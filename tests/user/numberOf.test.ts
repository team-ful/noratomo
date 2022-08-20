import {testApiHandler} from 'next-test-api-route-handler';
import {insertNumberOf} from '../../src/services/numberOf';
import TestBase from '../../src/tests/base';
import numberOf from '../../src/user/numberOf';

describe('numberOf', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();

    const user = await base.newUser();
    await user.addSession(base.db);
  });

  afterAll(async () => {
    await base.end();
  });

  test('取得できる', async () => {
    await insertNumberOf(base.db, base.users[0].user?.id || NaN, 10, 2, 3);

    await testApiHandler({
      handler: numberOf,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({method: 'GET'});

        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.evaluations).toBe(10);
        expect(body.entry).toBe(2);
        expect(body.meet).toBe(3);
        expect(body.application).toBe(0);
      },
    });
  });

  test('DBに統計が無い場合はすべて0で返る', async () => {
    const user = await base.newUser();
    await user.addSession(base.db);

    await testApiHandler({
      handler: numberOf,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({method: 'GET'});

        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.evaluations).toBe(0);
        expect(body.entry).toBe(0);
        expect(body.meet).toBe(0);
        expect(body.application).toBe(0);
      },
    });
  });
});
