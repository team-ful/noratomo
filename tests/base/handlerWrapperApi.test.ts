import {testApiHandler} from 'next-test-api-route-handler';
import Base from '../../src/base/base';
import {handlerWrapper} from '../../src/base/handlerWrapper';

describe('API', () => {
  test('ちゃんとラップできている', async () => {
    const handler = (base: Base<void>) => {
      base.res.send('It works!');
    };

    const h = handlerWrapper(handler);

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
