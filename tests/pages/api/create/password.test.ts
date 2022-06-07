import {randomBytes} from 'crypto';
import mysql from 'mysql2/promise';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../../../config';
import createPasswordHandler from '../../../../pages/api/create/password';
import {findUserBySessionToken} from '../../../../src/services/user';
import {createUserModel} from '../../../../src/tests/models';

describe('create', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('アカウントを作成する', async () => {
    expect.hasAssertions();

    const user = createUserModel({age: 20});
    const password = randomBytes(100).toString('hex');

    await testApiHandler({
      handler: createPasswordHandler,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: `user_name=${user.user_name}&mail=${
            user.mail
          }&password=${encodeURI(password)}&age=${user.age}&gender=${
            user.gender
          }`,
        });

        expect(res.status).toBe(200);

        const session: string = res.cookies[0][config.sessionCookieName];

        const u = await findUserBySessionToken(db, session);

        expect(u?.user_name).toBe(user.user_name);
      },
    });
  });

  test('formが正しくないとエラー', async () => {
    expect.hasAssertions();

    const user = createUserModel({age: 20});
    const password = randomBytes(100).toString('hex');

    await testApiHandler({
      handler: createPasswordHandler,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: `user_name=${user.user_name}&mail=${
            user.mail
          }&password=${encodeURI(password)}&gender=${user.gender}`,
        });

        expect(res.status).toBe(400);
      },
    });
  });

  test('formの値が正しくないとエラー', async () => {
    expect.hasAssertions();

    const user = createUserModel({age: 20});
    const password = randomBytes(100).toString('hex');

    await testApiHandler({
      handler: createPasswordHandler,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: `user_name=${user.user_name}&mail=${
            user.mail
          }&password=${encodeURI(password)}&age=100000000&gender=${
            user.gender
          }`,
        });

        expect(res.status).toBe(400);
      },
    });
  });
});
