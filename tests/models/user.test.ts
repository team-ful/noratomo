import mysql from 'mysql2/promise';
import config from '../../config';
import {getUserByUserID} from '../../src/services/user';
import {createUser} from '../../src/tests/user';

describe('ユーザIDから取得', () => {
  test('connection', async () => {
    const mail = "user@example.com'";

    const connection = await mysql.createConnection(config.db);
    await connection.connect();

    const dummy = await createUser(connection, {mail: mail});

    const user = await getUserByUserID(connection, dummy.id);

    expect(user.mail).toBe(mail);

    await connection.end();
  }, 10000);
});
