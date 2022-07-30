import {testApiHandler} from 'next-test-api-route-handler';
import {ApiError} from '../../src/base/apiError';
import Base from '../../src/base/base';
import {handlerWrapper} from '../../src/base/handlerWrapper';

describe('API', () => {
  test('ちゃんとラップできている', async () => {
    const handler = async (base: Base<void>) => {
      base.res.send('It works!');
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        // Returns a real ServerResponse instance
        const res = await fetch();
        // Hence, res.status == 200 if send(...) was called above
        expect(res.status).toBe(200);
        // We can even inspect the data that was returned
        expect(await res.text()).toBe('It works!');
      },
    });
  });
});

describe('error', () => {
  test('400エラーをthrowしたとき正しく400エラーになる', async () => {
    expect.hasAssertions();

    const handler = async () => {
      throw new ApiError(400, 'hogehoge');
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(400);
      },
    });
  });
});
