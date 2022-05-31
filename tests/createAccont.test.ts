import {randomBytes} from 'crypto';
import mysql from 'mysql2/promise';
import config from '../config';
import {CreateAccountBySSO} from '../src/createAccount';
import {findUserByUserID} from '../src/services/user';
import {createUserModel} from '../src/tests/models';
import {TestUser} from '../src/tests/user';

describe('cateiruSSO', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('新規作成', async () => {
    const userModel = createUserModel();

    const data = {
      name: 'テスト',
      preferred_username: userModel.user_name,
      email: userModel.mail,
      role: '',
      picture: 'https://example.com',
      id: randomBytes(32).toString('hex'),
    };

    const ca = new CreateAccountBySSO(db, data);

    const user = await ca.login();

    const dbUser = await findUserByUserID(db, user.id);

    expect(dbUser).toEqual(user);
  });

  test('すでにログインしている場合はそのままユーザを返す', async () => {
    const user = new TestUser();
    await user.create(db);
    await user.loginFromCateiruSSO(db);

    const data = {
      name: 'テスト',
      preferred_username: 'testtest',
      email: user.user?.mail,
      role: '',
      picture: 'https://example.com',
      id: user.cateiruSSOId,
    };

    const ca = new CreateAccountBySSO(db, data);

    const loginUser = await ca.login();

    const dbUser = await findUserByUserID(db, user.user?.id || NaN);

    expect(dbUser).toEqual(loginUser);
  });
});
