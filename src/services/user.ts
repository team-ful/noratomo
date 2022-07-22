import sql from 'mysql-bricks';
import DBOperator from '../db/operator';
import {Gender} from '../models/common';
import User, {UserModel} from '../models/user';

export interface UpdateOption {
  display_name?: string | null;
  mail?: string;
  profile?: string | null;
  user_name?: string;
  age?: number;
  gender?: Gender;
  is_admin?: boolean;
  avatar_url?: string;
}

/**
 * UserIDからユーザ情報を取得する
 *
 * @param {DBOperator} db - database
 * @param {number} id - User ID
 */
export async function findUserByUserID(
  db: DBOperator,
  id: number
): Promise<User> {
  const query = sql
    .select('*')
    .from('user')
    .where({id: id})
    .limit(1)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    throw new Error('not found');
  }

  return new User(row);
}

/**
 * ユーザを作成する
 * WARN: 主にテストで使用する
 *
 * @param {DBOperator} db - database
 * @param {UserModel} user - 追加するユーザ
 * @returns {Promise<User>} id
 */
export async function createTestUser(
  db: DBOperator,
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

  user.id = await db.insert(query);

  return new User(user);
}

/**
 * Cateiru SSO用のユーザ作成
 *
 * @param {DBOperator} db - database
 * @param {string} displayName - 表示名
 * @param {string} mail - メールアドレス
 * @param {string} userName - ユーザ名
 * @param {string} gender - 性別
 * @param {string} isAdmin - 管理者かどうか
 * @param {string} avatarURL - アバターのURL
 * @returns {Promise<number>} user id
 */
export async function createUserSSO(
  db: DBOperator,
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

  return await db.insert(query);
}

/**
 * パスワード用ユーザ作成
 *
 * @param {DBOperator} db - database
 * @param {string} mail - メールアドレス
 * @param {string} userName - ユーザ名
 * @param {string} gender - 性別
 * @param {number} age - 年齢
 * @returns {Promise<number>} user id
 */
export async function createUserPW(
  db: DBOperator,
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

  return await db.insert(query);
}

/**
 * CateiruSSOでログインしている場合、そのユーザを取得する
 *
 * @param {DBOperator} db - db
 * @param {string} id - cateirusso userid
 */
export async function findUserByCateiruSSO(
  db: DBOperator,
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

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new User(row);
}

/**
 * Session Tokenからユーザを取得する
 *
 * @param {DBOperator} db - database
 * @param {string} token - session token
 */
export async function findUserBySessionToken(
  db: DBOperator,
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

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new User(row);
}

/**
 * メールアドレスからユーザを探す
 *
 * @param {DBOperator} db - database
 * @param {string} mail - メールアドレス
 */
export async function findUserByMail(
  db: DBOperator,
  mail: string
): Promise<User | null> {
  const query = sql
    .select('*')
    .from('user')
    .where('mail', mail)
    .limit(1)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new User(row);
}

/**
 * ユーザ名からユーザを探す
 *
 * @param {DBOperator} db - database
 * @param {string} userName - ユーザ名
 */
export async function findUserByUserName(
  db: DBOperator,
  userName: string
): Promise<User | null> {
  const query = sql
    .select('*')
    .from('user')
    .where('user_name', userName)
    .limit(1)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new User(row);
}

/**
 * ユーザ名とメールアドレスでselectする
 *
 * @param {DBOperator} db - database
 * @param {string} userName - user name
 * @param {string} mail - mail
 */
export async function findUserByUserNameAndMail(
  db: DBOperator,
  userName: string,
  mail: string
): Promise<User | null> {
  const query = sql
    .select('*')
    .from('user')
    .where(sql.or({user_name: userName, mail: mail}))
    .limit(1)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new User(row);
}

/**
 * 全ユーザを返す
 *
 * @param {DBOperator} db - database
 * @param {number} limit - db limit
 * @param {number} offset - db offset
 */
export async function allUsers(
  db: DBOperator,
  limit?: number,
  offset?: number
) {
  let query = sql.select('*').from('user');

  if (typeof limit === 'number') {
    query = query.limit(limit);
  }
  if (typeof offset === 'number') {
    query = query.offset(offset);
  }

  const rows = await db.multi(query.toParams({placeholder: '?'}));

  return rows.map(v => new User(v));
}

/**
 * 設定、プロフィールを更新する
 *
 * @param {DBOperator} db - database
 * @param {number} id - ユーザID
 * @param {UpdateOption} option - options
 */
export async function updateUser(
  db: DBOperator,
  id: number,
  option: UpdateOption
) {
  const query = sql
    .update('user', option)
    .where('id', id)
    .toParams({placeholder: '?'});

  await db.execute(query);
}

/**
 * userを削除する
 *
 * @param {DBOperator} db - database
 * @param {number} id - ユーザID
 */
export async function deleteUserByID(db: DBOperator, id: number) {
  const query = sql.delete('user').where('id', id).toParams({placeholder: '?'});

  await db.execute(query);
}
