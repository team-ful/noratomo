import {NextApiRequest, NextApiResponse} from 'next';

class Base<T> {
  private req: NextApiRequest;
  private res: NextApiResponse;

  constructor(req: NextApiRequest, res: NextApiResponse<T>) {
    this.req = req;
    this.res = res;
  }

  public getReq() {
    return this.req;
  }

  public getRes() {
    return this.res;
  }
}

export default Base;
