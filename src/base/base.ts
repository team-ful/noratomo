import {NextApiRequest, NextApiResponse} from 'next';

class Base<T> {
  public req: NextApiRequest;
  public res: NextApiResponse;

  constructor(req: NextApiRequest, res: NextApiResponse<T>) {
    this.req = req;
    this.res = res;
  }
}

export default Base;
