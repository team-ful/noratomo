import mysql from 'mysql2/promise';
import config from '../../config';
import {getUserByUserID} from '../../src/services/user';
import {createUser} from '../../src/tests/user';

describe('ユーザIDから取得', () => {
  test('connection', async () => {
    const connection = await mysql.createConnection(config.db);
    await connection.connect();

    const dummy = await createUser(connection);

    const user = await getUserByUserID(connection, dummy.user.id);

    expect(user.user).toEqual(dummy.user);

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
