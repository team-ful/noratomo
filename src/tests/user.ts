import {Connection, ResultSetHeader} from 'mysql2/promise';
import {v4} from 'uuid';
import {UserModel} from '../models/user';

/**
 * テスト用のダミーユーザを作成する
 *
 * @param {Connection} db - database
 * @param {Partial<UserModel>} option - カスタムしたユーザー
 * @returns {Promise<number>} id
 */
export async function createUser(
  db: Connection,
  option?: Partial<UserModel>
): Promise<UserModel> {
  const newUser: UserModel = {
    id: NaN, // 上書きされる
    display_name: option?.display_name || v4().slice(0, 10),
    mail: option?.mail || `${v4().slice(0, 10)}@example.com`,
    profile: option?.profile || v4(),
    user_name: option?.user_name || v4(),
    age: option?.age || Math.floor(Math.random() * 100),
    gender: option?.gender || 1,
    is_ban: option?.is_ban || false,
    is_penalty: option?.is_penalty || false,
    is_admin: option?.is_admin || false,
    join_date: new Date(Date.now()),
    avatar_url: option?.avatar_url || `https://example.com/${v4()}`,
  };

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
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, now(), ?)`,
    [
      newUser.display_name,
      newUser.mail,
      newUser.profile,
      newUser.user_name,
      newUser.age,
      newUser.gender,
      newUser.is_ban,
      newUser.is_penalty,
      newUser.is_admin,
      newUser.avatar_url,
    ]
  );

  newUser.id = rows.insertId;

  return newUser;
}
