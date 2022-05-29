import mysql from 'mysql2/promise';
import config from '../../config';
import {getUserByUserID, createUser} from '../../src/services/user';
import {createUserModel} from '../../src/tests/user';

describe('ユーザIDから取得', () => {
  test('connection', async () => {
    const connection = await mysql.createConnection(config.db);
    await connection.connect();

    const dummy = await createUser(connection, createUserModel());

    const user = await getUserByUserID(connection, dummy.id);

    expect(user).toEqual(dummy);

    await connection.end();
  }, 10000);

  test('存在しないidはエラーが帰る', async () => {
    const connection = await mysql.createConnection(config.db);
    await connection.connect();

    expect(async () => {
      await getUserByUserID(connection, 123451234512345);
    }).rejects.toThrowError('not found');

    await connection.end();
  });
});
