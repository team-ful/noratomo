import {NextApiRequest, NextApiResponse} from 'next';
import Base from './base';

/**
 * 認証済みのユーザ用
 */
class AuthedBase<T> extends Base<T> {
  constructor(req: NextApiRequest, res: NextApiResponse<T>) {
    super(req, res);
  }
}

export default AuthedBase;
