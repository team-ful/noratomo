import mysql from 'mysql2/promise';
import config from '../../config';
import DBOperator from '../../src/db/operator';

describe('DBOperator', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config.db);
  });

  afterAll(async () => {
    await connection.end();
  });

  test('作成できる', async () => {
    new DBOperator(connection);
  });
});
