import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import {ApiError} from './apiError';

export interface Methods<T> {
  GET?: NextApiHandler<T>;
  POST?: NextApiHandler<T>;
  PUT?: NextApiHandler<T>;
  DELETE?: NextApiHandler<T>;
  HEAD?: NextApiHandler<T>;
}

/**
 * RESTfulを実現する
 *
 * @param {Methods} methods - メソッドごとのhandler
 * @returns {NextApiHandler} handler
 */
export const switchMethod =
  <T>(methods: Methods<T>): NextApiHandler<T> =>
  async (req: NextApiRequest, res: NextApiResponse<T>) => {
    try {
      switch (req.method?.toUpperCase()) {
        case 'GET':
          if (!methods.GET) {
            throw new ApiError(400, 'no GET method request');
          }
          await methods.GET(req, res);
          return;
        case 'POST':
          if (!methods.POST) {
            throw new ApiError(400, 'no POST method request');
          }
          await methods.POST(req, res);
          return;
        case 'PUT':
          if (!methods.PUT) {
            throw new ApiError(400, 'no PUT method request');
          }
          await methods.PUT(req, res);
          return;
        case 'DELETE':
          if (!methods.DELETE) {
            throw new ApiError(400, 'no DELETE method request');
          }
          await methods.DELETE(req, res);
          return;
        case 'HEAD':
          if (!methods.HEAD) {
            throw new ApiError(400, 'no HEAD method request');
          }
          await methods.HEAD(req, res);
          return;
        default:
          throw new ApiError(400, 'unknown method');
      }
    } catch (e) {
      if (e instanceof ApiError) {
        e.sendRes(res);
        return;
      }

      throw e;
    }
  };
