import {randomBytes} from 'crypto';
import mysql from 'mysql2/promise';
import config from '../../config';
import {setCert} from '../../src/services/cert';
import {
  findUserByUserID,
  createTestUser,
  createUserSSO,
  findUserByCateiruSSO,
} from '../../src/services/user';
import {createCertModel} from '../../src/tests/cert';
import {createUserModel} from '../../src/tests/user';

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
    expect(
      await findUserByCateiruSSO(connection, randomBytes(32).toString('hex'))
    ).toBeNull();
  });

  test('ssoが存在する場合は返る', async () => {
    const userModel = createUserModel();
    const user = await createTestUser(connection, userModel);

    const cert = createCertModel({
      user_id: user.id,
      cateiru_sso_id: randomBytes(32).toString('hex'),
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
