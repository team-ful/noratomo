import sql from 'mysql-bricks';
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
  const query = sql
    .select('*')
    .from('user')
    .where({id: id})
    .limit(1)
    .toParams({placeholder: '?'});

  const [rows] = await db.query<RowDataPacket[]>(query.text, query.values);

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
  const query = sql
    .insert('user', {
      display_name: user.display_name,
      mail: user.mail,
      profile: user.profile,
      user_name: user.user_name,
      age: user.age,
      gender: user.gender,
      is_ban: user.is_ban,
      is_penalty: user.is_penalty,
      is_admin: user.is_admin,
      join_date: user.join_date, // 通常now()を使用して日時を設定するがテスト用で時間を合わせたいためjs側から入れる
      avatar_url: user.avatar_url,
    })
    .toParams({placeholder: '?'});

  const [rows] = await db.query<ResultSetHeader>(query.text, query.values);

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
  const query = sql
    .insert('user', {
      display_name: displayName,
      mail: mail,
      user_name: userName,
      gender: gender,
      is_admin: isAdmin,
      join_date: sql('NOW()'),
      avatar_url: avatarURL,
    })
    .toParams({placeholder: '?'});

  const [rows] = await db.query<ResultSetHeader>(query.text, query.values);

  return rows.insertId;
}

/**
 * パスワード用ユーザ作成
 *
 * @param {Connection} db - database
 * @param {string} mail - メールアドレス
 * @param {string} userName - ユーザ名
 * @param {string} gender - 性別
 * @param {number} age - 年齢
 * @returns {Promise<number>} user id
 */
export async function createUserPW(
  db: Connection,
  mail: string,
  userName: string,
  gender: Gender,
  age: number
): Promise<number> {
  const query = sql
    .insert('user', {
      mail: mail,
      user_name: userName,
      gender: gender,
      age: age,
      join_date: sql('NOW()'),
    })
    .toParams({placeholder: '?'});

  const [rows] = await db.query<ResultSetHeader>(query.text, query.values);

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
  const query = sql
    .select('*')
    .from('user')
    .where(
      sql.eq(
        'user.id',
        sql
          .select('user_id')
          .from('cert')
          .where('cert.cateiru_sso_id', id)
          .limit(1)
      )
    )
    .limit(1)
    .toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

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
  const query = sql
    .select('*')
    .from('user')
    .where(
      sql.eq(
        'user.id',
        sql
          .select('user_id')
          .from('session')
          .where('session.session_token', token)
          .and(sql.gte('period_date', sql('NOW()')))
          .limit(1)
      )
    )
    .limit(1)
    .toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

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
  const query = sql
    .select('*')
    .from('user')
    .where('mail', mail)
    .limit(1)
    .toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

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
  const query = sql
    .select('*')
    .from('user')
    .where('user_name', userName)
    .limit(1)
    .toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

  if (row.length === 0) {
    return null;
  }

  return new User(row[0] as UserModel);
}

/**
 * ユーザ名とメールアドレスでselectする
 *
 * @param {Connection} db - database
 * @param {string} userName - user name
 * @param {string} mail - mail
 */
export async function findUserByUserNameAndMail(
  db: Connection,
  userName: string,
  mail: string
): Promise<User | null> {
  const query = sql
    .select('*')
    .from('user')
    .where(sql.or({user_name: userName, mail: mail}))
    .limit(1)
    .toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

  if (row.length === 0) {
    return null;
  }

  return new User(row[0] as UserModel);
}

/**
 * 設定、プロフィールを更新する
 *
 * @param {Connection} db - database
 * @param {number} id - ユーザID
 * @param {{}} option - option
 * @param {string | null} option.display_name - display name
 * @param {string} option.mail - メールアドレス
 * @param {string | null} option.profile - profile
 * @param {string} option.user_name - user name
 * @param {number} option.age - 年齢
 * @param {Gender} option.gender - 性別
 */
export async function updateUser(
  db: Connection,
  id: number,
  option: {
    display_name?: string | null;
    mail?: string;
    profile?: string | null;
    user_name?: string;
    age?: number;
    gender?: Gender;
  }
) {
  const query = sql
    .update('user', option)
    .where('id', id)
    .toParams({placeholder: '?'});

  await db.query(query.text, query.values);
}
