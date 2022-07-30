import {NextApiResponse} from 'next';
import Base from './base';

export class ApiError extends Error {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);

    this.code = code;
  }

  public async send<T>(base: Base<T>) {
    this.sendRes(base.res);
    await base.dbEnd();
  }

  public sendRes<T>(res: NextApiResponse<T>) {
    res.status(this.code).send(this.message as any);
    res.end();

    if (process.env.NODE_ENV !== 'production') {
      console.error(this.stack);
    }
  }
}
