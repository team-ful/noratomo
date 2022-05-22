import {Connection, Pool, RowDataPacket} from 'mysql2/promise';
import User, {convertUser} from '../models/user';

/**
 * UserIDからユーザ情報を取得する
 *
 * @param {Connection | Pool} db - database
 * @param {number} id - User ID
 */
export async function getUserByUserID(
  db: Connection | Pool,
  id: number
): Promise<User> {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM user WHERE id = ?',
    [id]
  );

  const row = rows[0];

  return new User(convertUser(row));
}
