import {RowDataPacket} from 'mysql2';
import {Gender} from './common';

export interface UserModel {
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
  profile: string | null;

  // ユーザ名
  // Twitterのidと同じ立ち位置
  // 一意であり、ユーザが自由に設定できる
  user_name: string;

  // 年齢
  age: number;

  // 性別
  gender: Gender;

  // Banされているかどうか
  is_ban: boolean | null;

  // ペナルティを食らっているかどうか
  is_penalty: boolean | null;

  // 管理者ユーザかどうか
  is_admin: boolean | null;

  // アカウントを作成した日時
  join_date: Date;

  // アバターURL
  avatar_url: string;
}

/**
 * query叩いて帰ってきたRowデータをUserModelに変更します
 *
 * @param {RowDataPacket} row - DBの結果
 * @returns {UserModel} ユーザモデル
 */
export function convertUser(row: RowDataPacket): UserModel {
  // 性別
  let gender: Gender = Gender.NotNone;
  if (row.gender) {
    switch (row.gender) {
      case 0:
        gender = Gender.NotNone;
        break;
      case 1:
        gender = Gender.Male;
        break;
      case 2:
        gender = Gender.Female;
        break;
      case 3:
        gender = Gender.NotApplicable;
        break;
    }
  }

  // profile
  let profile: string | null = null;
  if (row.profile !== null) {
    profile = row.profile as string;
  }

  // is_ban
  let isBan: boolean | null = null;
  if (row.is_ban !== null) {
    isBan = Boolean(row.is_ban);
  }

  // is_penalty
  let isPenalty: boolean | null = null;
  if (row.is_penalty !== null) {
    isPenalty = Boolean(row.is_penalty);
  }

  // is_admin
  let isAdmin: boolean | null = null;
  if (row.is_admin !== null) {
    isAdmin = Boolean(row.is_admin);
  }

  return {
    id: row.id as number,
    display_name: row.display_name as string,
    mail: row.mail as string,
    profile: profile,
    user_name: row.user_name as string,
    age: row.age as number,
    gender: gender,
    is_ban: isBan,
    is_penalty: isPenalty,
    is_admin: isAdmin,
    join_date: new Date(row.join_date),
    avatar_url: row.avatar_url as string,
  };
}

/**
 * ユーザ関連の操作をするクラス
 */
class User {
  public user: UserModel;

  constructor(user: UserModel) {
    this.user = user;
  }
}

export default User;
