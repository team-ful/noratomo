import mysql from 'mysql';
import {Config} from '../../config/config';

describe('db接続', () => {
  test('接続する', () => {
    process.env.ENVIRONMENT = 'test';
    const config: Config = require('../../config').default;

    const connection = mysql.createConnection(config.db);

    connection.connect(err => {
      expect(err).toThrow();
    });
  });
});
