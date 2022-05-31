import {ResultSetHeader} from 'mysql2/promise';
import {Connection, Pool, RowDataPacket} from 'mysql2/promise';
import {Gender} from '../models/common';
import User, {UserModel} from '../models/user';

/**
 * UserIDからユーザ情報を取得する
 *
 * @param {Connection | Pool} db - database
 * @param {number} id - User ID
 */
export async function findUserByUserID(
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
 * WARN: 主にテストで使用する
 *
 * @param {Connection} db - database
 * @param {UserModel} user - 追加するユーザ
 * @returns {Promise<User>} id
 */
export async function createTestUser(
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
 * Cateiru SSO用のユーザ作成
 *
 * @param {Connection} db - database
 * @param {string} displayName - 表示名
 * @param {string} mail - メールアドレス
 * @param {string} userName - ユーザ名
 * @param {string} gender - 性別
 * @param {string} isAdmin - 管理者かどうか
 * @param {string} avatarURL - アバターのURL
 * @returns {Promise<number>} user id
 */
export async function createUserSSO(
  db: Connection,
  displayName: string,
  mail: string,
  userName: string,
  gender: Gender,
  isAdmin: boolean,
  avatarURL: string
): Promise<number> {
  const [rows] = await db.query<ResultSetHeader>(
    `INSERT INTO user (
    display_name,
    mail,
    user_name,
    gender,
    is_admin,
    avatar_url,
    join_date
  ) VALUES (?, ?, ?, ?, ?, ?, now())`,
    [displayName, mail, userName, gender, isAdmin, avatarURL]
  );

  return rows.insertId;
}

/**
 * CateiruSSOでログインしている場合、そのユーザを取得する
 *
 * @param {Connection | Pool} db - db
 * @param {string} id - cateirusso userid
 */
export async function findUserByCateiruSSO(
  db: Connection | Pool,
  id: string
): Promise<User | null> {
  const [row] = await db.query<RowDataPacket[]>(
    `SELECT * FROM user WHERE user.id = (
    SELECT user_id FROM cert WHERE cert.cateiru_sso_id = ? LIMIT 1
  ) LIMIT 1`,
    [id]
  );

  if (row.length === 0) {
    return null;
  }

  return new User(row[0] as UserModel);
}

/**
 * Session Tokenからユーザを取得する
 *
 * @param {Connection} db - database
 * @param {string} token - session token
 */
export async function findUserBySessionToken(
  db: Connection,
  token: string
): Promise<User | null> {
  const [row] = await db.query<RowDataPacket[]>(
    `
    SELECT * FROM user
      WHERE id = (
        SELECT user_id FROM session
        WHERE
          session_token = ? AND
          period_date >= NOW()
        LIMIT 1
      )
      LIMIT 1
  `,
    [token]
  );

  if (row.length === 0) {
    return null;
  }

  return new User(row[0] as UserModel);
}

/**
 * メールアドレスからユーザを探す
 *
 * @param {Connection} db - database
 * @param {string} mail - メールアドレス
 */
export async function findUserByMail(
  db: Connection,
  mail: string
): Promise<User | null> {
  const [row] = await db.query<RowDataPacket[]>(
    `
  SELECT * FROM user
    WHERE
      mail = ?
    LIMIT 1
  `,
    [mail]
  );

  if (row.length === 0) {
    return null;
  }

  return new User(row[0] as UserModel);
}

/**
 * ユーザ名からユーザを探す
 *
 * @param {Connection} db - database
 * @param {string} userName - ユーザ名
 */
export async function findUserByUserName(
  db: Connection,
  userName: string
): Promise<User | null> {
  const [row] = await db.query<RowDataPacket[]>(
    `
  SELECT * FROM user
    WHERE
      user_name = ?
    LIMIT 1
  `,
    [userName]
  );

  if (row.length === 0) {
    return null;
  }

  return new User(row[0] as UserModel);
}
