import {testApiHandler} from 'next-test-api-route-handler';
import {authHandlerWrapper} from '../../../src/base/handlerWrapper';
import {Gender} from '../../../src/models/common';
import {findUserByUserID} from '../../../src/services/user';
import TestBase from '../../../src/tests/base';
import {createUserModel} from '../../../src/tests/models';
import {setConfigHandler} from '../../../src/user/config/configPut';
import {randomText} from '../../../src/utils/random';

describe('更新', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('すべて更新できる', async () => {
    const u = await base.newUser();
    await u.addSession(base.db);

    const newUser = createUserModel({
      display_name: randomText(10),
      profile: randomText(20),
      age: 100,
      gender: Gender.Female,
    });

    expect.hasAssertions();

    const h = authHandlerWrapper(setConfigHandler);

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: u.cookie,
          'content-type': 'application/x-www-form-urlencoded',
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'PUT',
          body: `display_name=${newUser.display_name}&profile=${newUser.profile}&user_name=${newUser.user_name}&age=${newUser.age}&gender=${newUser.gender}`,
        });

        expect(res.status).toBe(200);

        // チェックする
        const uu = await findUserByUserID(base.db, u.user?.id || NaN);

        expect(uu.id).toBe(u.user?.id);
        expect(uu.display_name).toBe(newUser.display_name);
        expect(uu.profile).toBe(newUser.profile);
        expect(uu.user_name).toBe(newUser.user_name);
        expect(uu.age).toBe(newUser.age);
        expect(uu.gender).toBe(newUser.gender);
      },
    });
  });

  test('1つ更新できる', async () => {
    const u = await base.newUser();
    await u.addSession(base.db);

    const newUser = createUserModel({
      profile: randomText(20),
    });

    expect.hasAssertions();

    const h = authHandlerWrapper(setConfigHandler);

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: u.cookie,
          'content-type': 'application/x-www-form-urlencoded',
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'PUT',
          body: `profile=${newUser.profile}`,
        });

        expect(res.status).toBe(200);

        // チェックする
        const uu = await findUserByUserID(base.db, u.user?.id || NaN);

        expect(uu.id).toBe(u.user?.id);
        expect(uu.display_name).toBe(u.user?.display_name);
        expect(uu.profile).toBe(newUser.profile);
        expect(uu.user_name).toBe(u.user?.user_name);
        expect(uu.age).toBe(u.user?.age);
        expect(uu.gender).toBe(u.user?.gender);
      },
    });
  });
});
