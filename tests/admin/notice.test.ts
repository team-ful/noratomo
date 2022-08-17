import FormData from 'form-data';
import {testApiHandler} from 'next-test-api-route-handler';
import {noticeAllUserHandler} from '../../src/admin/notice';
import {authHandlerWrapper} from '../../src/base/handlerWrapper';
import {findNoticeByUserId} from '../../src/services/notice';
import TestBase from '../../src/tests/base';
import formDataHandler from '../../src/tests/handler';

describe('notice', () => {
  const base: TestBase = new TestBase();

  beforeAll(async () => {
    await base.connection();

    const admin = await base.newUser({is_admin: true});
    await admin.addSession(base.db);
  });

  afterAll(async () => {
    await base.end();
  });

  test('adminユーザ以外はアクセスできない', async () => {
    expect.hasAssertions();

    const u = await base.newUser();
    await u.addSession(base.db);

    await testApiHandler({
      handler: formDataHandler(authHandlerWrapper(noticeAllUserHandler, 'GET')),
      requestPatcher: async req => {
        req.headers = {
          cookie: u.cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(403);
      },
    });
  });

  test('通知を送信できる', async () => {
    expect.hasAssertions();

    const u = base.users[0];

    const form = new FormData();
    form.append('title', 'hogehoge');
    form.append('body', 'hugahuga');

    await testApiHandler({
      handler: formDataHandler(
        authHandlerWrapper(noticeAllUserHandler, 'POST')
      ),
      requestPatcher: async req => {
        req.headers = {
          ...req.headers,
          cookie: u.cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          body: form,
        });
        expect(res.status).toBe(200);

        const notice = await findNoticeByUserId(base.db, u.user?.id || NaN);

        expect(notice.length).toBe(1);
        expect(notice[0].title).toBe('hogehoge');
      },
    });
  });
});
