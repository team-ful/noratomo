import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import Base from './base';

export type Handler<T> = (base: Base<T>) => void;
export type HandlerWrapper = <T>(handler: Handler<T>) => NextApiHandler<T>;

const handlerWrapper: HandlerWrapper =
  <T>(handler: Handler<T>): NextApiHandler<T> =>
  (req: NextApiRequest, res: NextApiResponse<T>) => {
    const base = new Base<T>(req, res);

    handler(base);
  };

export default handlerWrapper;
