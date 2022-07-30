import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import {ApiError} from './apiError';
import AuthedBase from './authedBase';
import Base from './base';

export const handlerWrapper =
  <T>(
    handler: (base: Base<T>) => Promise<void>,
    method?: string
  ): NextApiHandler<T> =>
  async (req: NextApiRequest, res: NextApiResponse<T>) => {
    const base = new Base<T>(req, res);

    try {
      if (method) {
        base.checkMethod(method);
      }

      await handler(base);
    } catch (e) {
      if (e instanceof ApiError) {
        e.send(base);
        return;
      }
      // db閉じないといけない
      await base.end();
      throw e;
    }

    await base.end();
    res.status(base.status);
    res.end();
  };

export const authHandlerWrapper =
  <T>(
    handler: (base: AuthedBase<T>) => Promise<void>,
    method?: string
  ): NextApiHandler<T> =>
  async (req: NextApiRequest, res: NextApiResponse<T>) => {
    const authBase = new AuthedBase<T>(req, res);

    try {
      if (method) {
        authBase.checkMethod(method);
      }

      await authBase.login();
      await handler(authBase);
    } catch (e) {
      if (e instanceof ApiError) {
        e.send(authBase);
        return;
      }
      // db閉じないといけない
      await authBase.end();
      throw e;
    }

    await authBase.end();
    res.status(authBase.status);
    res.end();
  };
