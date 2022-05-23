import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import AuthedBase from './AuthedBase';
import Base from './base';

export const handlerWrapper =
  <T>(handler: (base: Base<T>) => void): NextApiHandler<T> =>
  (req: NextApiRequest, res: NextApiResponse<T>) => {
    const base = new Base<T>(req, res);

    handler(base);
  };

export const authHandlerWrapper =
  <T>(handler: (base: AuthedBase<T>) => void): NextApiHandler<T> =>
  (req: NextApiRequest, res: NextApiResponse<T>) => {
    const authBase = new AuthedBase<T>(req, res);

    handler(authBase);
  };
