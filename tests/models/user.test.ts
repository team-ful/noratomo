import mysql from 'mysql2/promise';
import config from '../../config';
import {getUserByUserID} from '../../src/models/user';
import {createUser} from '../tools/user';

describe('ユーザIDから取得', () => {
  test('connection', async () => {
    const mail = "user@example.com'";

    const connection = await mysql.createConnection(config.db);
    await connection.connect();

    const id = await createUser(connection, {mail: mail});

    const user = await getUserByUserID(connection, id);

    expect(user.mail).toBe(mail);

    await connection.end();
  }, 10000);
});
