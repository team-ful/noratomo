import {randomBytes} from 'crypto';
import mysql from 'mysql2/promise';
import config from '../config';
import {
  CreateAccountByPassword,
  CreateAccountBySSO,
} from '../src/createAccount';
import {findCertByUserID} from '../src/services/cert';
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

describe('CreateAccountByPassword', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('新規作成', async () => {
    const dummy = createUserModel();
    const password = randomBytes(64).toString('hex');

    const ca = new CreateAccountByPassword(
      dummy.user_name,
      dummy.mail,
      password,
      '20',
      '0'
    );

    await ca.check(db);

    const user = await ca.create(db);

    const dbUser = await findUserByUserID(db, user.id);

    expect(dbUser).toEqual(user);

    const cert = await findCertByUserID(db, user.id);

    expect(cert.equalPassword(password)).toBeTruthy();
  });

  test('すでにメールアドレスが存在している場合はチェックが失敗する', async () => {
    const user = new TestUser();
    await user.create(db);

    const mail = user.user?.mail || '';
    const dummy = createUserModel();
    const password = randomBytes(64).toString('hex');

    const ca = new CreateAccountByPassword(
      dummy.user_name,
      mail,
      password,
      '20',
      '0'
    );

    expect(ca.check(db)).rejects.toThrow('mail is already exist');
  });

  test('すでにユーザ名が存在する場合はチェックが失敗する', async () => {
    const user = new TestUser();
    await user.create(db);

    const userName = user.user?.user_name || '';
    const dummy = createUserModel();
    const password = randomBytes(64).toString('hex');

    const ca = new CreateAccountByPassword(
      userName,
      dummy.mail,
      password,
      '20',
      '0'
    );

    expect(ca.check(db)).rejects.toThrow('user name is already exist');
  });

  // TODO: 他のチェックも書く
});
