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
    // ref. https://github.com/vercel/next.js/blob/881c313b39dc2b975d6c5da89f223a6b2ca6c541/packages/next/server/api-utils/index.ts#L163-L171
    res.statusCode = this.code;
    res.statusMessage = this.message;
    res.end(this.message);

    if (process.env.NODE_ENV !== 'production') {
      console.error(this.stack);
    }
  }
}
