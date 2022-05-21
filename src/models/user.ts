import {Connection, Pool, RowDataPacket} from 'mysql2/promise';
import {Gender} from './common';

export default interface User {
  // ユーザを識別するID
  // 他のテーブルの`user_id`になる。
  // ユニーク
  id: number;

  // 表示名
  // 自由に付与することができる
  display_name: string;

  // メールアドレス
  mail: string;

  // プロフィール
  profile: string;

  // ユーザ名
  // Twitterのidと同じ立ち位置
  // 一意であり、ユーザが自由に設定できる
  user_name: string;

  // 年齢
  age: number;

  // 性別
  gender: Gender;

  // Banされているかどうか
  is_ban: boolean;

  // ペナルティを食らっているかどうか
  is_penalty: boolean;

  // 管理者ユーザかどうか
  is_admin: boolean;

  // アカウントを作成した日時
  join_date: Date;

  // アバターURL
  avatar_url: string;
}

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
  const [rows, fields] = await db.query<RowDataPacket[]>(
    'SELECT * FROM user WHERE id = ?',
    [id]
  );

  const row = rows[0];

  return row as User;
}
