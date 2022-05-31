import mysql from 'mysql2/promise';
import config from '../../config';

describe('dbの接続', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config.db);
  });

  afterAll(async () => {
    await connection.end();
  });
  test('接続できる', async () => {
    await connection.connect();
  }, 10000);
});
