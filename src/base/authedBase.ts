import {NextApiRequest, NextApiResponse} from 'next';
import {ApiError} from 'next/dist/server/api-utils';
import config from '../../config';
import User from '../models/user';
import {
  deleteRefreshBySessionToken,
  deleteSessionBySessionToken,
  findRefreshByRefreshToken,
} from '../services/session';
import {findUserBySessionToken, findUserByUserID} from '../services/user';
import Base from './base';

/**
 * 認証済みのユーザ用
 */
class AuthedBase<T> extends Base<T> {
  private userId: number;
  readonly sessionToken?: string;
  readonly refreshToken?: string;

  private _user?: User;

  constructor(req: NextApiRequest, res: NextApiResponse<T>) {
    super(req, res);

    this.userId = NaN;
    const session = this.getCookie(config.sessionCookieName);
    const refresh = this.getCookie(config.refreshCookieName);

    this.sessionToken = session;
    this.refreshToken = refresh;
  }

  // ログインする
  public async login() {
    if (
      typeof this.sessionToken !== 'string' ||
      this.sessionToken.length === 0
    ) {
      // refresh tokenを使用したログインを試みる
      await this.loginByRefresh();
      return;
    }

    const user = await findUserBySessionToken(
      await this.db(),
      this.sessionToken
    );

    if (user === null) {
      // refresh tokenを使用したログインを試みる
      await this.loginByRefresh();
    } else {
      this._user = user;
    }
  }

  private async loginByRefresh() {
    if (
      typeof this.refreshToken !== 'string' ||
      this.refreshToken.length === 0
    ) {
      this.clearSessionCookies();

      throw new ApiError(403, 'login failed');
    }

    const session = await findRefreshByRefreshToken(
      await this.db(),
      this.refreshToken
    );
    if (session === null) {
      this.clearSessionCookies();

      throw new ApiError(403, 'login failed');
    }

    // tokenをDBから削除
    await deleteSessionBySessionToken(await this.db(), session.session_token);
    await deleteRefreshBySessionToken(await this.db(), session.session_token);

    const user = await findUserByUserID(await this.db(), session?.user_id);

    if (user === null) {
      throw new ApiError(500, 'no user');
    }

    // 新しいトークンを付与
    await this.newLogin(user);

    this._user = user;
  }

  // 認証用トークンcookieを全部削除する
  public clearSessionCookies() {
    this.clearCookie(config.sessionCookieName, config.sessionCookieOptions());
    this.clearCookie(config.refreshCookieName, config.refreshCookieOptions());
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
