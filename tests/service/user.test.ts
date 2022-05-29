import mysql from 'mysql2/promise';
import config from '../../config';
import {getUserByUserID, createUser} from '../../src/services/user';
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
    const dummy = await createUser(connection, createUserModel());

    const user = await getUserByUserID(connection, dummy.id);

    expect(user).toEqual(dummy);
  }, 10000);

  test('byUserIdで存在しないidはエラーが帰る', async () => {
    expect(async () => {
      await getUserByUserID(connection, 123451234512345);
    }).rejects.toThrowError('not found');
  });

  test('byCateiruSSO', async () => {});
});

describe('createUser', () => {
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

    const user = await createUser(connection, userModel);

    expect(user.display_name).toBe(userModel.display_name);

    const dbUser = await getUserByUserID(connection, user.id);

    expect(dbUser).toEqual(user);
  });
});
