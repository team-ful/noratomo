import {NextApiResponse} from 'next';
import Base from './base';

export class ApiError extends Error {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);

    this.code = code;
  }

  public send<T>(base: Base<T>) {
    this.sendRes(base.res);
  }

  public sendRes<T>(res: NextApiResponse<T>) {
    res.status(this.code).send(this.message as any);

    if (process.env.NODE_ENV === 'production') {
      console.error(this.stack);
    } else {
      console.info(this.message);
    }
  }
}
