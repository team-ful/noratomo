import fs from 'fs';
import FormData from 'form-data';
import {PageConfig} from 'next';
import {testApiHandler} from 'next-test-api-route-handler';
import avatar, {config} from '../../../../pages/api/user/avatar';
import {findUserByUserID} from '../../../../src/services/user';
import TestBase from '../../../../src/tests/base';

describe('update avatar', () => {
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

  test('更新できる', async () => {
    expect.hasAssertions();

    const h: typeof avatar & {config?: PageConfig} = avatar;
    h.config = config;

    const buffer = fs.readFileSync('tests/base/sample.png');
    const form = new FormData();
    form.append('image', buffer, {
      filename: 'sample.png',
      contentType: 'image/png',
      knownLength: buffer.length,
    });

    const oldAvatar = base.users[0].user?.avatar_url;

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
          ...req.headers,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          body: form,
        });

        expect(res.status).toBe(200);

        const newAvatar = (
          await findUserByUserID(base.db, base.users[0].user?.id || NaN)
        ).avatar_url;

        expect(await res.text()).toBe(newAvatar);
        expect(newAvatar).not.toBe(oldAvatar);
      },
    });
  });
});
