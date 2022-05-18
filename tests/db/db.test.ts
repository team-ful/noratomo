import mysql from 'mysql2/promise';
import config from '../../config';

describe('dbの接続', () => {
  test('接続できる', async () => {
    const connection = await mysql.createConnection(config.db);
    await connection.connect();
    await connection.end();
  }, 10000);
});
