import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import AuthedBase from './authedBase';
import Base from './base';

export const handlerWrapper =
  <T>(
    handler: (base: Base<T>) => Promise<void>,
    method?: string
  ): NextApiHandler<T> =>
  async (req: NextApiRequest, res: NextApiResponse<T>) => {
    const base = new Base<T>(req, res);

    base.checkMethod(method || 'GET');

    try {
      await handler(base);
    } catch (e) {
      // db閉じないといけない
      await base.end();
      throw e;
    }

    await base.end();
    res.end();
  };

export const authHandlerWrapper =
  <T>(
    handler: (base: AuthedBase<T>) => Promise<void>,
    method?: string
  ): NextApiHandler<T> =>
  async (req: NextApiRequest, res: NextApiResponse<T>) => {
    const authBase = new AuthedBase<T>(req, res);

    authBase.checkMethod(method || 'GET');

    try {
      await authBase.login();
      await handler(authBase);
    } catch (e) {
      // db閉じないといけない
      await authBase.end();
      throw e;
    }

    await authBase.end();
    res.end();
  };
