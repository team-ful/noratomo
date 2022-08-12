import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../../../config';
import createPasswordHandler from '../../../../pages/api/create/password';
import {findUserBySessionToken} from '../../../../src/services/user';
import TestBase from '../../../../src/tests/base';
import {createUserModel} from '../../../../src/tests/models';
import {randomText} from '../../../../src/utils/random';

describe('create', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('アカウントを作成する', async () => {
    expect.hasAssertions();

    const user = createUserModel({age: 20});
    const password = randomText(50);

    const body = {
      user_name: user.user_name,
      mail: user.mail,
      password: password,
      age: user.age ?? 0,
      gender: user.gender,

      token: '',
      answers: [],
    };

    await testApiHandler({
      handler: createPasswordHandler,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        expect(res.status).toBe(200);

        const session: string = res.cookies[0][config.sessionCookieName];

        const u = await findUserBySessionToken(base.db, session);

        expect(u?.user_name).toBe(user.user_name);
      },
    });
  });

  test('formが正しくないとエラー', async () => {
    expect.hasAssertions();

    const user = createUserModel({age: 20});
    const password = randomText(100);

    const body = {
      user_name: user.user_name,
      mail: user.mail,
      password: password,
      gender: user.gender,

      token: '',
      answers: [],
    };

    await testApiHandler({
      handler: createPasswordHandler,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        expect(res.status).toBe(400);
      },
    });
  });

  test('formの値が正しくないとエラー', async () => {
    expect.hasAssertions();

    const user = createUserModel({age: 20});
    const password = randomText(100);

    const body = {
      user_name: user.user_name,
      mail: user.mail,
      password: password,
      age: '100',
      gender: user.gender,

      token: '',
      answers: [],
    };

    await testApiHandler({
      handler: createPasswordHandler,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        expect(res.status).toBe(400);
      },
    });
  });
});
