import {gender, Gender} from './common';

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
 * ユーザ関連の操作をするクラス
 */
class User implements UserModel {
  readonly id: number;
  readonly display_name: string;
  readonly mail: string;
  readonly profile: string | null;
  readonly user_name: string;
  readonly age: number;
  readonly gender: Gender;
  readonly is_ban: boolean | null;
  readonly is_penalty: boolean | null;
  readonly is_admin: boolean | null;
  readonly join_date: Date;
  readonly avatar_url: string;

  constructor(init: Partial<User>) {
    // is_ban
    let isBan: boolean | null = null;
    if (init.is_ban !== null) {
      isBan = Boolean(init.is_ban);
    }

    // is_penalty
    let isPenalty: boolean | null = null;
    if (init.is_penalty !== null) {
      isPenalty = Boolean(init.is_penalty);
    }

    // is_admin
    let isAdmin: boolean | null = null;
    if (init.is_admin !== null) {
      isAdmin = Boolean(init.is_admin);
    }

    this.id = init.id || NaN;
    this.display_name = init.display_name || '';
    this.mail = init.mail || '';
    this.profile = init.profile || null;
    this.user_name = init.user_name || '';
    this.age = init.age || NaN;

    this.gender = gender(init.gender as number);

    this.is_ban = isBan;
    this.is_penalty = isPenalty;
    this.is_admin = isAdmin;

    this.join_date = new Date(init.join_date || '');
    this.avatar_url = init.avatar_url || '';
  }

  /**
   * 同じユーザかどうかを判定する
   *
   * @param {User} user - 判定するユーザ
   * @returns {boolean} 同じユーザの場合trueになる
   */
  public is(user: User) {
    return this.id === user.id;
  }

  /**
   * 比較するユーザより自分が参加日時が早いかどうかを判定する
   *
   * @param {User} user - 比較するユーザ
   * @returns {boolean} - 自分が引数のUserより参加日時が早いor同じ場合はtrue
   */
  public isSeniority(user: User) {
    const diff =
      Date.parse(user.join_date.toISOString()) -
      Date.parse(this.join_date.toISOString());

    return diff > 0;
  }
}

export default User;
