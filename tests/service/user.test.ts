import mysql from 'mysql2/promise';
import config from '../../config';
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
} from '../../src/services/user';
import {createCertModel, createUserModel} from '../../src/tests/models';
import {TestUser} from '../../src/tests/user';
import {randomText} from '../../src/utils/random';

describe('getUser', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config.db);
    await connection.connect();
  });

  afterAll(async () => {
    await connection.end();
  });

  test('byUserID', async () => {
    const dummy = await createTestUser(connection, createUserModel());

    const user = await findUserByUserID(connection, dummy.id);

    expect(user).toEqual(dummy);
  }, 10000);

  test('byUserIdで存在しないidはエラーが帰る', async () => {
    expect(async () => {
      await findUserByUserID(connection, 123451234512345);
    }).rejects.toThrowError('not found');
  });

  test('byCateiruSSO', async () => {});
});

describe('createTestUser', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config.db);
    await connection.connect();
  });

  afterAll(async () => {
    await connection.end();
  });

  test('作成できる', async () => {
    const userModel = createUserModel();

    const user = await createTestUser(connection, userModel);

    expect(user.display_name).toBe(userModel.display_name);

    const dbUser = await findUserByUserID(connection, user.id);

    expect(dbUser).toEqual(user);
  });
});

describe('createUserSSO', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config.db);
    await connection.connect();
  });

  afterAll(async () => {
    await connection.end();
  });

  test('作成できる', async () => {
    const userModel = createUserModel();

    const userId = await createUserSSO(
      connection,
      userModel.display_name || 'hoge',
      userModel.mail,
      userModel.user_name,
      userModel.gender,
      userModel.is_admin || false,
      userModel.avatar_url || ''
    );

    const dbUser = await findUserByUserID(connection, userId);

    // とりあえず同じであることをuser_idで判定する
    expect(dbUser.user_name).toBe(userModel.user_name);
  });
});

describe('findUserByCateiruSSO', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config.db);
    await connection.connect();
  });

  afterAll(async () => {
    await connection.end();
  });

  test('certが存在しない場合はnullが返る', async () => {
    expect(await findUserByCateiruSSO(connection, randomText(32))).toBeNull();
  });

  test('ssoが存在する場合は返る', async () => {
    const userModel = createUserModel();
    const user = await createTestUser(connection, userModel);

    const cert = createCertModel({
      user_id: user.id,
      cateiru_sso_id: randomText(32),
    });
    await setCert(connection, cert);

    const dbUser = await findUserByCateiruSSO(
      connection,
      cert.cateiru_sso_id || '' // 必ず存在する
    );

    expect(dbUser).not.toBeNull();
    expect(dbUser?.id).toEqual(user.id);
  });
});

describe('findUserBySessionToken', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config.db);
    await connection.connect();
  });

  afterAll(async () => {
    await connection.end();
  });

  test('取得できる', async () => {
    const user = new TestUser();
    await user.create(connection);
    await user.addSession(connection);

    const dbUser = await findUserBySessionToken(
      connection,
      user.session?.session_token || ''
    );

    expect(dbUser).not.toBeNull();
    expect(dbUser?.id).toBe(user.user?.id);
  });

  test('存在しない場合はnullが返る', async () => {
    const user = new TestUser();
    await user.create(connection);

    const dbUser = await findUserBySessionToken(connection, randomText(128));

    expect(dbUser).toBeNull();
  });
});

describe('findUserByMail', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config.db);
    await connection.connect();
  });

  afterAll(async () => {
    await connection.end();
  });

  test('取得できる', async () => {
    const user = new TestUser();
    await user.create(connection);
    await user.addSession(connection);

    const dbUser = await findUserByMail(connection, user.user?.mail || '');

    expect(dbUser).not.toBeNull();
    expect(dbUser?.id).toBe(user.user?.id);
  });

  test('存在しない場合はnullが返る', async () => {
    const user = new TestUser();
    await user.create(connection);

    const dbUser = await findUserByMail(connection, randomText(128));

    expect(dbUser).toBeNull();
  });
});

describe('findUserByUserName', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config.db);
    await connection.connect();
  });

  afterAll(async () => {
    await connection.end();
  });

  test('取得できる', async () => {
    const user = new TestUser();
    await user.create(connection);
    await user.addSession(connection);

    const dbUser = await findUserByUserName(
      connection,
      user.user?.user_name || ''
    );

    expect(dbUser).not.toBeNull();
    expect(dbUser?.id).toBe(user.user?.id);
  });

  test('存在しない場合はnullが返る', async () => {
    const user = new TestUser();
    await user.create(connection);

    const dbUser = await findUserByUserName(connection, randomText(128));

    expect(dbUser).toBeNull();
  });
});

describe('createUserPW', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('作成できる', async () => {
    const userModel = createUserModel();

    const userId = await createUserPW(
      db,
      userModel.mail,
      userModel.user_name,
      userModel.gender,
      userModel.age || 24
    );

    const dbUser = await findUserByUserID(db, userId);

    // とりあえず同じであることをuser_idで判定する
    expect(dbUser.user_name).toBe(userModel.user_name);
  });
});

describe('findUserByUserNameAndMail', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('ユーザ名で取得できる', async () => {
    const user = new TestUser();
    await user.create(db);
    await user.addSession(db);

    const dbUser = await findUserByUserNameAndMail(
      db,
      user.user?.user_name || '',
      ''
    );

    expect(dbUser).not.toBeNull();
    expect(dbUser?.id).toBe(user.user?.id);
  });

  test('メールアドレスで取得できる', async () => {
    const user = new TestUser();
    await user.create(db);
    await user.addSession(db);

    const dbUser = await findUserByUserNameAndMail(
      db,
      '',
      user.user?.mail || ''
    );

    expect(dbUser).not.toBeNull();
    expect(dbUser?.id).toBe(user.user?.id);
  });

  test('ユーザ名、メールアドレスがどちらも存在しないと取得できない', async () => {
    const dbUser = await findUserByUserNameAndMail(db, 'hugahuga', 'hogehoge');

    expect(dbUser).toBeNull();
  });
});

describe('updateUser', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('display_nameを更新できる', async () => {
    const user = new TestUser();
    await user.create(db);

    const u = await findUserByUserID(db, user.user?.id || NaN);

    const newDisplayName = 'nyanya';

    await updateUser(db, u.id, {
      display_name: newDisplayName,
    });

    const u1 = await findUserByUserID(db, user.user?.id || NaN);

    expect(u1).not.toEqual(u);
    expect(u1.display_name).not.toBe(u.display_name);
    expect(u1.id).toBe(u.id);
  });

  test('同じuserNameで更新するとエラー', async () => {
    const user = new TestUser();
    await user.create(db);

    const user2 = new TestUser();
    await user2.create(db);

    const u = await findUserByUserID(db, user.user?.id || NaN);

    expect(async () => {
      await updateUser(db, u.id, {
        user_name: user2.user?.user_name || '',
      });
    }).rejects.toThrow();
  });
});
