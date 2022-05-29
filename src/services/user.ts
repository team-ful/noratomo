import {ResultSetHeader} from 'mysql2/promise';
import {Connection, Pool, RowDataPacket} from 'mysql2/promise';
import User, {UserModel} from '../models/user';

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
    "SELECT * FROM user WHERE id = '?' LIMIT 1",
    [id]
  );

  if (rows.length === 0) {
    throw new Error('not found');
  }

  return new User(rows[0] as UserModel);
}

/**
 * ユーザを作成する
 *
 * @param {Connection} db - database
 * @param {UserModel} user - 追加するユーザ
 * @returns {Promise<User>} id
 */
export async function createUser(
  db: Connection,
  user: UserModel
): Promise<User> {
  const [rows] = await db.query<ResultSetHeader>(
    `INSERT INTO user (
    display_name,
    mail,
    profile,
    user_name,
    age,
    gender,
    is_ban,
    is_penalty,
    is_admin,
    join_date,
    avatar_url
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.display_name,
      user.mail,
      user.profile,
      user.user_name,
      user.age,
      user.gender,
      user.is_ban,
      user.is_penalty,
      user.is_admin,
      user.join_date, // 通常now()を使用して日時を設定するがテスト用で時間を合わせたいためjs側から入れる
      user.avatar_url,
    ]
  );

  user.id = rows.insertId;

  return new User(user);
}

/**
 * CateiruSSOでログインしている場合、そのユーザを取得する
 *
 * @param {Connection | Pool} db - db
 * @param {string} id - cateirusso userid
 */
export async function getUserByCateiruSSO(
  db: Connection | Pool,
  id: string
): Promise<User | null> {
  const [row] = await db.query<RowDataPacket[]>(
    `SELECT * FROM user WHERE user.id = (
    SELECT 'user_id' FROM cert WHERE cert.cateiru_sso_id = '?' LIMIT 1
  ) LIMIT 1`,
    [id]
  );

  if (row.length === 0) {
    return null;
  }

  return new User(row[0] as UserModel);
}
