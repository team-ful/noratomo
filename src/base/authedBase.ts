import {NextApiRequest, NextApiResponse} from 'next';
import {ApiError} from 'next/dist/server/api-utils';
import config from '../../config';
import User from '../models/user';
import {findUserBySessionToken} from '../services/user';
import Base from './base';

/**
 * 認証済みのユーザ用
 */
class AuthedBase<T> extends Base<T> {
  private userId: number;
  readonly sessionToken: string;

  private _user?: User;

  constructor(req: NextApiRequest, res: NextApiResponse<T>) {
    super(req, res);

    this.userId = NaN;
    const session = this.getCookie(config.sessionCookieName);

    // cookieがない場合
    if (typeof session !== 'string' || session.length === 0) {
      throw new ApiError(403, 'no login');
    }

    this.sessionToken = session;
  }

  // ログインする
  public async login() {
    const user = await findUserBySessionToken(
      await this.db(),
      this.sessionToken
    );

    if (user === null) {
      // ユーザがnullということは値が不正か有効期限切れであるためcookieを削除する
      this.clearCookie(config.sessionCookieName, config.sessionCookieOptions());

      throw new ApiError(403, 'login failed');
    } else {
      this._user = user;
    }
  }

  // ユーザを返す
  get user() {
    if (this._user) {
      return this._user;
    } else {
      throw new ApiError(500, 'no login');
    }
  }

  // 公開可能なユーザ情報を返す
  public getPublicUserData() {
    const u = this.user;

    return {
      display_name: u.display_name,
      mail: u.mail,
      profile: u.profile,
      user_name: u.user_name,
      age: u.age,
      gender: u.gender,
      is_admin: u.is_admin,
      avatar_url: u.avatar_url,
      join_date: u.join_date,
    };
  }

  public adminOnly() {
    if (this._user && !this._user.is_admin) {
      throw new ApiError(403, 'no administrator');
    }
  }
}

export default AuthedBase;
