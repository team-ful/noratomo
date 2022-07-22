import {testApiHandler} from 'next-test-api-route-handler';
import {get} from '../../src/admin/user';
import {UserModel} from '../../src/models/user';
import TestBase from '../../src/tests/base';

describe('noraQuestion', () => {
  const base: TestBase = new TestBase();

  beforeAll(async () => {
    await base.connection();

    const admin = await base.newUser({is_admin: true});
    await admin.addSession(base.db);
  });

  afterAll(async () => {
    await base.end();
  });

  test('全件取得できる', async () => {
    expect.hasAssertions();

    await base.multiUser(5);

    await testApiHandler({
      handler: get,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const d = await res.json();

        expect(Array.isArray(d)).toBeTruthy();
        expect((d as UserModel[]).length >= 5).toBeTruthy();
      },
    });
  });

  test('limitとoffset指定できる', async () => {
    expect.hasAssertions();

    await base.multiUser(6);

    await testApiHandler({
      handler: get,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].cookie,
        };
      },
      url: '/?limit=3&offset=3',
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const d = await res.json();

        expect(Array.isArray(d)).toBeTruthy();
        expect((d as UserModel[]).length).toBe(3);
      },
    });
  });

  test('idを指定して1件だけ取得できる', async () => {
    expect.hasAssertions();

    const u = await base.newUser();

    await testApiHandler({
      handler: get,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].cookie,
        };
      },
      url: `/?user_id=${u.user?.id}`,
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const d = await res.json();

        expect(Array.isArray(d)).toBeFalsy();
        expect((d as UserModel).user_name).toBe(u.user?.user_name);
      },
    });
  });

  test('getで管理者以外は403', async () => {
    expect.hasAssertions();

    const u = await base.newUser();
    await u.addSession(base.db);

    await testApiHandler({
      handler: get,
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
});
