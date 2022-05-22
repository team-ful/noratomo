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
 * ユーザ関連の操作をするクラス
 */
class User {
  public user: UserModel;

  constructor(user: UserModel) {
    this.user = user;
  }
}

export default User;
