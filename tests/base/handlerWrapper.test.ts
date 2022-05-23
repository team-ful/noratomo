import {NextApiRequest, NextApiResponse} from 'next';

import httpMocks from 'node-mocks-http';
import AuthedBase from '../../src/base/AuthedBase';
import Base from '../../src/base/base';
import {
  handlerWrapper,
  authHandlerWrapper,
} from '../../src/base/handlerWrapper';

jest.mock('../../src/base/base');
jest.mock('../../src/base/AuthedBase');

const BaseMock = Base as jest.Mock;
const AuthedBaseMock = AuthedBase as jest.Mock;

describe('handlerWrapper', () => {
  test('base', async () => {
    const handler = jest.fn();

    const h = handlerWrapper(handler);

    const req = httpMocks.createRequest<NextApiRequest>();
    const res = httpMocks.createResponse<NextApiResponse>();

    h(req, res);

    expect(BaseMock).toHaveBeenCalled();
  });

  test('authBase', async () => {
    const handler = jest.fn();

    const h = authHandlerWrapper(handler);

    const req = httpMocks.createRequest<NextApiRequest>();
    const res = httpMocks.createResponse<NextApiResponse>();

    h(req, res);

    expect(AuthedBaseMock).toHaveBeenCalled();
  });
});
