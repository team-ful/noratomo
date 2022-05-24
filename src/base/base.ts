import mysql, {Connection} from 'mysql2/promise';
import {NextApiRequest, NextApiResponse} from 'next';
import config from '../../config';

class Base<T> {
  public req: NextApiRequest;
  public res: NextApiResponse;

  constructor(req: NextApiRequest, res: NextApiResponse<T>) {
    this.req = req;
    this.res = res;
  }

  /**
   * DB Connectionを返す
   *
   * @returns {mysql.Connection} DB Connection
   */
  public async connectionDB() {
    const connection = await mysql.createConnection(config.db);
    await connection.connect();

    return connection;
  }
}

export default Base;
