import DBOperator, {DefaultObject} from '../db/operator';
import {findNoReadNoticeByUserId, findNoticeByUserId} from '../services/notice';
import {gender, Gender} from './common';
import Notice from './notice';

export interface UserModel {
  // ユーザを識別するID
  // 他のテーブルの`user_id`になる。
  // ユニーク
  id: number;

  // 表示名
  // 自由に付与することができる
  display_name: string | null;

  // メールアドレス
  mail: string;

  // プロフィール
  profile: string | null;

  // ユーザ名
  // Twitterのidと同じ立ち位置
  // 一意であり、ユーザが自由に設定できる
  user_name: string;

  // 年齢
  age: number | null;

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
  avatar_url: string | null;
}

export interface ExternalUser {
  display_name: string | null;
  mail: string;
  profile: string | null;
  user_name: string;
  age: number | null;
  gender: number;
  is_admin: boolean | null;
  avatar_url: string | null;
  join_date: Date;
}

/**
 * ユーザ関連の操作をするクラス
 */
class User implements UserModel {
  readonly id: number;
  readonly display_name: string | null;
  readonly mail: string;
  readonly profile: string | null;
  readonly user_name: string;
  readonly age: number | null;
  readonly gender: Gender;
  readonly is_ban: boolean;
  readonly is_penalty: boolean;
  readonly is_admin: boolean;
  readonly join_date: Date;
  readonly avatar_url: string | null;

  constructor(init: DefaultObject | UserModel) {
    this.is_ban = init.is_ban as boolean;
    this.is_penalty = init.is_penalty as boolean;
    this.is_admin = init.is_admin as boolean;

    this.id = init.id as Required<number>;
    this.display_name = init.display_name as string | null;
    this.mail = init.mail as string;
    this.profile = init.profile as string | null;
    this.user_name = init.user_name as string;
    this.age = init.age as number | null;

    this.gender = gender(init.gender as number);

    this.join_date = new Date(init.join_date as Date);
    this.avatar_url = init.avatar_url as string | null;
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

  /**
   * ユーザの通知
   *
   * @param {DBOperator} db - database
   * @param {boolean} includeRead - trueの場合、既読の通知も返す
   * @param {number} limit - optional. 取得個数
   * @returns {Notice[]} - 通知
   */
  public async notice(
    db: DBOperator,
    includeRead: boolean,
    limit?: number
  ): Promise<Notice[]> {
    if (includeRead) {
      return await findNoticeByUserId(db, this.id, limit);
    }
    return await findNoReadNoticeByUserId(db, this.id, limit);
  }

  public externalUser(): ExternalUser {
    return {
      display_name: this.display_name,
      mail: this.mail,
      profile: this.profile,
      user_name: this.user_name,
      age: this.age,
      gender: this.gender,
      is_admin: this.is_admin,
      avatar_url: this.avatar_url,
      join_date: this.join_date,
    };
  }
}

export default User;
