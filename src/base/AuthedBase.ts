import {Connection, Pool} from 'mysql2/promise';
import {NextApiRequest, NextApiResponse} from 'next';
import User from '../models/user';
import {findUserByUserID} from '../services/user';
import Base from './base';

/**
 * 認証済みのユーザ用
 */
class AuthedBase<T> extends Base<T> {
  private userId: number;

  constructor(req: NextApiRequest, res: NextApiResponse<T>) {
    super(req, res);

    this.userId = NaN;
  }

  public async getUser(db: Connection | Pool): Promise<User> {
    return await findUserByUserID(db, this.userId);
  }
}

export default AuthedBase;
