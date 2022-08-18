import {NextApiRequest, NextApiResponse} from 'next';
import config from '../../config';
import User from '../models/user';
import {
  deleteRefreshByRefreshToken,
  deleteRefreshBySessionToken,
  deleteSessionBySessionToken,
  findRefreshByRefreshToken,
} from '../services/session';
import {
  findUserBySessionToken,
  findUserByUserID,
  updateUser,
} from '../services/user';
import {ApiError} from './apiError';
import Base from './base';

/**
 * 認証済みのユーザ用
 */
class AuthedBase<T> extends Base<T> {
  private _user?: User;

  constructor(req: NextApiRequest, res: NextApiResponse<T>) {
    super(req, res);

    this.sessionToken = this.getCookie(config.sessionCookieName);
    this.refreshToken = this.getCookie(config.refreshCookieName);
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
    // this.sessionTokenとthis.refreshTokenは上書きしている
    await this.newLogin(user);

    this._user = user;
  }

  // 認証用トークンcookieを全部削除する
  public clearSessionCookies() {
    this.clearCookie(config.sessionCookieName, config.sessionCookieOptions());
    this.clearCookie(config.refreshCookieName, config.refreshCookieOptions());
    this.clearCookie(config.otherCookieName, config.otherCookieOptions());
  }

  public async logout() {
    if (this.sessionToken) {
      await deleteSessionBySessionToken(await this.db(), this.sessionToken);
    }

    if (this.refreshToken) {
      await deleteRefreshByRefreshToken(await this.db(), this.refreshToken);
    }

    this.clearSessionCookies();
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

  public async updateAvatar(newURL: string) {
    await updateUser(await this.db(), this.user.id, {
      avatar_url: newURL,
    });
  }
}

export default AuthedBase;
