import {randomBytes} from 'crypto';
import mysql from 'mysql2/promise';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../../config';
import {authHandlerWrapper} from '../../../src/base/handlerWrapper';
import {Gender} from '../../../src/models/common';
import {findUserByUserID} from '../../../src/services/user';
import {createUserModel} from '../../../src/tests/models';
import {TestUser} from '../../../src/tests/user';
import {setConfigHandler} from '../../../src/user/config/configPut';

describe('更新', () => {
  let db: mysql.Connection;
  let u: TestUser;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();

    const _u = new TestUser();
    await _u.create(db);
    await _u.addSession(db);

    u = _u;
  });

  afterAll(async () => {
    await db.end();
  });

  test('すべて更新できる', async () => {
    const newUser = createUserModel({
      display_name: randomBytes(10).toString('hex'),
      profile: randomBytes(20).toString('hex'),
      age: 100,
      gender: Gender.Female,
    });

    expect.hasAssertions();

    const h = authHandlerWrapper(setConfigHandler);

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: u.sessionCookie,
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
        const uu = await findUserByUserID(db, u.user?.id || NaN);

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
    const newUser = createUserModel({
      profile: randomBytes(20).toString('hex'),
    });

    expect.hasAssertions();

    const h = authHandlerWrapper(setConfigHandler);

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: u.sessionCookie,
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
        const uu = await findUserByUserID(db, u.user?.id || NaN);

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
