import {Connection, ResultSetHeader} from 'mysql2/promise';
import {v4} from 'uuid';
import User from '../../src/models/user';

/**
 * テスト用のダミーユーザを作成する
 *
 * @param {Connection} db - database
 * @param {Partial<User>} option - カスタムしたユーザー
 * @returns {Promise<number>} id
 */
export async function createUser(
  db: Connection,
  option?: Partial<User>
): Promise<number> {
  const display_name = option?.display_name || v4().slice(0, 10);
  const mail = option?.mail || `${v4().slice(0, 10)}@example.com`;
  const profile = option?.profile || v4();
  const userName = option?.user_name || v4();
  const age = option?.age || Math.floor(Math.random() * 100);
  const gender = option?.gender || 1;
  const isBan = option?.is_ban || false;
  const isPenalty = option?.is_penalty || false;
  const isAdmin = option?.is_admin || false;
  const avatarURL = option?.avatar_url || `https://example.com/${v4()}`;

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
      display_name,
      mail,
      profile,
      userName,
      age,
      gender,
      isBan,
      isPenalty,
      isAdmin,
      avatarURL,
    ]
  );

  return rows.insertId;
}
