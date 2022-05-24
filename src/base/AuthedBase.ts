import {Connection, Pool} from 'mysql2/promise';
import {NextApiRequest, NextApiResponse} from 'next';
import User from '../models/user';
import {getUserByUserID} from '../services/user';
import Base from './base';

/**
 * 認証済みのユーザ用
 */
class AuthedBase<T> extends Base<T> {
  private userId: number = NaN;

  constructor(req: NextApiRequest, res: NextApiResponse<T>) {
    super(req, res);
  }

  public async getUser(db: Connection | Pool): Promise<User> {
    return await getUserByUserID(db, this.userId);
  }
}

export default AuthedBase;
