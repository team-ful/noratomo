import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import AuthedBase from './AuthedBase';
import Base from './base';

export const handlerWrapper =
  <T>(handler: (base: Base<T>) => Promise<void>): NextApiHandler<T> =>
  async (req: NextApiRequest, res: NextApiResponse<T>) => {
    const base = new Base<T>(req, res);

    await handler(base);

    await base.end();
    res.end();
  };

export const authHandlerWrapper =
  <T>(handler: (base: AuthedBase<T>) => Promise<void>): NextApiHandler<T> =>
  async (req: NextApiRequest, res: NextApiResponse<T>) => {
    const authBase = new AuthedBase<T>(req, res);

    await handler(authBase);

    await authBase.end();
    res.end();
  };
