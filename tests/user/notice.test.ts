import {testApiHandler} from 'next-test-api-route-handler';
import {findNoticeByUserId} from '../../src/services/notice';
import TestBase from '../../src/tests/base';
import {get, put} from '../../src/user/notice';

describe('notice', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();

    const user = await base.newUser();
    await user.addSession(base.db);
  });

  afterAll(async () => {
    await base.end();
  });

  test('get', async () => {
    const user = base.users[0];

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

  test('put', async () => {
    const user = base.users[0];
    const id = await user.notice(base.db, 'hogehoge');

    await testApiHandler({
      handler: put,
      requestPatcher: async req => {
        req.headers = {
          ...req.headers,
          cookie: user.cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'PUT',
          body: `id=${id}`,
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        });

        expect(res.status).toBe(200);

        const notices = await findNoticeByUserId(base.db, user.user?.id || NaN);
        const notice = notices.find(v => v.id === id);

        expect(notice).not.toBeUndefined();
        expect(notice?.is_read).toBeTruthy();
      },
    });
  });
});
