import {RowDataPacket} from 'mysql2/promise';
import {Gender} from '../../src/models/common';
import {setCert} from '../../src/services/cert';
import {
  findUserByUserID,
  createTestUser,
  createUserSSO,
  findUserByCateiruSSO,
  findUserBySessionToken,
  findUserByMail,
  findUserByUserName,
  createUserPW,
  findUserByUserNameAndMail,
  updateUser,
  deleteUserByID,
} from '../../src/services/user';
import TestBase from '../../src/tests/base';
import {createCertModel, createUserModel} from '../../src/tests/models';
import {TestUser} from '../../src/tests/user';
import {randomText} from '../../src/utils/random';

describe('getUser', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('byUserID', async () => {
    const dummy = await createTestUser(base.db, createUserModel());

    const user = await findUserByUserID(base.db, dummy.id);

    expect(user).toEqual(dummy);
  }, 10000);

  test('byUserIdで存在しないidはエラーが帰る', async () => {
    expect(async () => {
      await findUserByUserID(base.db, 123451234512345);
    }).rejects.toThrowError('not found');
  });

  test('byCateiruSSO', async () => {});
});

describe('createTestUser', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('作成できる', async () => {
    const userModel = createUserModel();

    const user = await createTestUser(base.db, userModel);

    expect(user.display_name).toBe(userModel.display_name);

    const dbUser = await findUserByUserID(base.db, user.id);

    expect(dbUser).toEqual(user);
  });
});

describe('createUserSSO', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('作成できる', async () => {
    const userModel = createUserModel();

    const userId = await createUserSSO(
      base.db,
      userModel.display_name || 'hoge',
      userModel.mail,
      userModel.user_name,
      userModel.gender,
      userModel.is_admin || false,
      userModel.avatar_url || ''
    );

    const dbUser = await findUserByUserID(base.db, userId);

    // とりあえず同じであることをuser_idで判定する
    expect(dbUser.user_name).toBe(userModel.user_name);
  });
});

describe('findUserByCateiruSSO', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('certが存在しない場合はnullが返る', async () => {
    expect(await findUserByCateiruSSO(base.db, randomText(32))).toBeNull();
  });

  test('ssoが存在する場合は返る', async () => {
    const userModel = createUserModel();
    const user = await createTestUser(base.db, userModel);

    const cert = createCertModel({
      user_id: user.id,
      cateiru_sso_id: randomText(32),
    });
    await setCert(base.db, cert);

    const dbUser = await findUserByCateiruSSO(
      base.db,
      cert.cateiru_sso_id || '' // 必ず存在する
    );

    expect(dbUser).not.toBeNull();
    expect(dbUser?.id).toEqual(user.id);
  });
});

describe('findUserBySessionToken', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('取得できる', async () => {
    const user = await base.newUser();
    await user.addSession(base.db);

    const dbUser = await findUserBySessionToken(
      base.db,
      user.session?.session_token || ''
    );

    expect(dbUser).not.toBeNull();
    expect(dbUser?.id).toBe(user.user?.id);
  });

  test('存在しない場合はnullが返る', async () => {
    const dbUser = await findUserBySessionToken(base.db, randomText(128));

    expect(dbUser).toBeNull();
  });
});

describe('findUserByMail', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('取得できる', async () => {
    const user = await base.newUser();
    await user.addSession(base.db);

    const dbUser = await findUserByMail(base.db, user.user?.mail || '');

    expect(dbUser).not.toBeNull();
    expect(dbUser?.id).toBe(user.user?.id);
  });

  test('存在しない場合はnullが返る', async () => {
    const dbUser = await findUserByMail(base.db, randomText(128));

    expect(dbUser).toBeNull();
  });
});

describe('findUserByUserName', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('取得できる', async () => {
    const user = await base.newUser();
    await user.addSession(base.db);

    const dbUser = await findUserByUserName(
      base.db,
      user.user?.user_name || ''
    );

    expect(dbUser).not.toBeNull();
    expect(dbUser?.id).toBe(user.user?.id);
  });

  test('存在しない場合はnullが返る', async () => {
    const dbUser = await findUserByUserName(base.db, randomText(128));

    expect(dbUser).toBeNull();
  });
});

describe('createUserPW', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('作成できる', async () => {
    const userModel = createUserModel();

    const userId = await createUserPW(
      base.db,
      userModel.mail,
      userModel.user_name,
      userModel.gender,
      userModel.age || 24
    );

    const dbUser = await findUserByUserID(base.db, userId);

    // とりあえず同じであることをuser_idで判定する
    expect(dbUser.user_name).toBe(userModel.user_name);
  });
});

describe('findUserByUserNameAndMail', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('ユーザ名で取得できる', async () => {
    const user = await base.newUser();
    await user.addSession(base.db);

    const dbUser = await findUserByUserNameAndMail(
      base.db,
      user.user?.user_name || '',
      ''
    );

    expect(dbUser).not.toBeNull();
    expect(dbUser?.id).toBe(user.user?.id);
  });

  test('メールアドレスで取得できる', async () => {
    const user = await base.newUser();
    await user.addSession(base.db);

    const dbUser = await findUserByUserNameAndMail(
      base.db,
      '',
      user.user?.mail || ''
    );

    expect(dbUser).not.toBeNull();
    expect(dbUser?.id).toBe(user.user?.id);
  });

  test('ユーザ名、メールアドレスがどちらも存在しないと取得できない', async () => {
    const dbUser = await findUserByUserNameAndMail(
      base.db,
      'hugahuga',
      'hogehoge'
    );

    expect(dbUser).toBeNull();
  });
});

describe('updateUser', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('メールアドレスを更新できる', async () => {
    const user = await base.newUser();

    const u = await findUserByUserID(base.db, user.user?.id || NaN);

    const newMail = `${randomText(10)}@example.com`;

    await updateUser(base.db, u.id, {
      mail: newMail,
    });

    const u1 = await findUserByUserID(base.db, user.user?.id || NaN);

    expect(u1).not.toEqual(u);
    expect(u1.mail).not.toBe(u.mail);
    expect(u1.id).toBe(u.id);
  });

  test('display_nameを更新できる', async () => {
    const user = await base.newUser();

    const u = await findUserByUserID(base.db, user.user?.id || NaN);

    const newDisplayName = 'nyanya';

    await updateUser(base.db, u.id, {
      display_name: newDisplayName,
    });

    const u1 = await findUserByUserID(base.db, user.user?.id || NaN);

    expect(u1).not.toEqual(u);
    expect(u1.display_name).not.toBe(u.display_name);
    expect(u1.id).toBe(u.id);
  });

  test('user_nameを更新できる', async () => {
    const user = await base.newUser();

    const u = await findUserByUserID(base.db, user.user?.id || NaN);

    const newUserName = randomText(10);

    await updateUser(base.db, u.id, {
      user_name: newUserName,
    });

    const u1 = await findUserByUserID(base.db, user.user?.id || NaN);

    expect(u1).not.toEqual(u);
    expect(u1.user_name).not.toBe(u.user_name);
    expect(u1.id).toBe(u.id);
  });

  test('genderを更新できる', async () => {
    const user = await base.newUser();

    const u = await findUserByUserID(base.db, user.user?.id || NaN);

    expect(u.gender).toBe(Gender.Male);

    const newGender = Gender.Female;

    await updateUser(base.db, u.id, {
      gender: newGender,
    });

    const u1 = await findUserByUserID(base.db, user.user?.id || NaN);

    expect(u1).not.toEqual(u);
    expect(u1.gender).not.toBe(u.gender);
    expect(u1.id).toBe(u.id);
  });

  test('is_adminを更新できる', async () => {
    const user = await base.newUser();

    const u = await findUserByUserID(base.db, user.user?.id || NaN);

    const newAdmin = true;

    await updateUser(base.db, u.id, {
      is_admin: newAdmin,
    });

    const u1 = await findUserByUserID(base.db, user.user?.id || NaN);

    expect(u1).not.toEqual(u);
    expect(u1.is_admin).not.toBe(u.is_admin);
    expect(u1.id).toBe(u.id);
  });

  test('avatarURLを更新できる', async () => {
    const user = await base.newUser();

    const u = await findUserByUserID(base.db, user.user?.id || NaN);

    const newAvatarUrl = randomText(10);

    await updateUser(base.db, u.id, {
      avatar_url: newAvatarUrl,
    });

    const u1 = await findUserByUserID(base.db, user.user?.id || NaN);

    expect(u1).not.toEqual(u);
    expect(u1.avatar_url).not.toBe(u.avatar_url);
    expect(u1.id).toBe(u.id);
  });

  test('同じuserNameで更新するとエラー', async () => {
    const user = await base.newUser();

    const user2 = new TestUser();
    await user2.create(base.db);

    const u = await findUserByUserID(base.db, user.user?.id || NaN);

    expect(async () => {
      await updateUser(base.db, u.id, {
        user_name: user2.user?.user_name || '',
      });
    }).rejects.toThrow();
  });

  test('idから削除できる', async () => {
    const user = await base.newUser();

    await deleteUserByID(base.db, user.user?.id || NaN);

    const rows = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM user WHERE id = ?',
      user.user?.id || NaN
    );

    expect(rows.length).toBe(0);
  });
});
