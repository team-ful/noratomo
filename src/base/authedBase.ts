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

  user?: User;

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
      this.user = user;
    }
  }
}

export default AuthedBase;
