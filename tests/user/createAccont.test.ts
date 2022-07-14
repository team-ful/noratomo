import {findCertByUserID} from '../../src/services/cert';
import {findUserByUserID} from '../../src/services/user';
import TestBase from '../../src/tests/base';
import {createUserModel} from '../../src/tests/models';
import {
  CreateAccountByPassword,
  CreateAccountBySSO,
} from '../../src/user/createAccount';
import {randomText} from '../../src/utils/random';

describe('cateiruSSO', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('新規作成', async () => {
    const userModel = createUserModel();

    const data = {
      name: 'テスト',
      preferred_username: userModel.user_name,
      email: userModel.mail,
      role: '',
      picture: 'https://example.com',
      id: randomText(32),
    };

    const ca = new CreateAccountBySSO(base.db, data);

    const user = await ca.login();

    const dbUser = await findUserByUserID(base.db, user.id);

    expect(dbUser).toEqual(user);
  });

  test('すでにログインしている場合はそのままユーザを返す', async () => {
    const user = await base.newUser({
      avatar_url: randomText(10),
      display_name: randomText(10),
    });
    await user.loginFromCateiruSSO(base.db);

    const data = {
      name: user.user?.display_name,
      preferred_username: user.user?.user_name,
      email: user.user?.mail,
      role: '',
      picture: user.user?.avatar_url,
      id: user.cateiruSSOId,
    };

    const ca = new CreateAccountBySSO(base.db, data);

    const loginUser = await ca.login();

    const dbUser = await findUserByUserID(base.db, user.user?.id || NaN);

    expect(user.user).toEqual(dbUser);
    expect(dbUser).toEqual(loginUser);
  });

  test('更新するものがある場合は更新する', async () => {
    const user = await base.newUser({
      avatar_url: randomText(10),
      display_name: randomText(10),
      is_admin: false,
    });
    await user.loginFromCateiruSSO(base.db);

    const data = {
      name: user.user?.display_name,
      preferred_username: randomText(10), // 変更
      email: user.user?.mail,
      role: 'noratomo', // 追加
      picture: randomText(10),
      id: user.cateiruSSOId,
    };

    const ca = new CreateAccountBySSO(base.db, data);

    const loginUser = await ca.login();

    const dbUser = await findUserByUserID(base.db, user.user?.id || NaN);

    expect(user.user).not.toEqual(dbUser);
    expect(dbUser).toEqual(loginUser);

    expect(dbUser.is_admin).toBeTruthy();
  });
});

describe('CreateAccountByPassword', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('新規作成', async () => {
    const dummy = createUserModel();
    const password = randomText(32);

    const ca = new CreateAccountByPassword(
      dummy.user_name,
      dummy.mail,
      password,
      '20',
      '0'
    );

    await ca.check(base.db);

    const user = await ca.create(base.db);

    const dbUser = await findUserByUserID(base.db, user.id);

    expect(dbUser).toEqual(user);

    const cert = await findCertByUserID(base.db, user.id);

    expect(cert.equalPassword(password)).toBeTruthy();
  });

  test('すでにメールアドレスが存在している場合はチェックが失敗する', async () => {
    const user = await base.newUser();

    const mail = user.user?.mail || '';
    const dummy = createUserModel();
    const password = randomText(32);

    const ca = new CreateAccountByPassword(
      dummy.user_name,
      mail,
      password,
      '20',
      '0'
    );

    await expect(async () => {
      await ca.check(base.db);
    }).rejects.toThrow('user is already exists');
  });

  test('すでにユーザ名が存在する場合はチェックが失敗する', async () => {
    const user = await base.newUser();

    const userName = user.user?.user_name || '';
    const dummy = createUserModel();
    const password = randomText(32);

    const ca = new CreateAccountByPassword(
      userName,
      dummy.mail,
      password,
      '20',
      '0'
    );

    await expect(async () => {
      await ca.check(base.db);
    }).rejects.toThrow('user is already exists');
  });

  // TODO: 他のチェックも書く
});
