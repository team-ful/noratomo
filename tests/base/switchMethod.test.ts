import {NextApiHandler} from 'next';
import {testApiHandler} from 'next-test-api-route-handler';
import Base from '../../src/base/base';
import {handlerWrapper} from '../../src/base/handlerWrapper';
import {switchMethod} from '../../src/base/switchMethod';

describe('switch', () => {
  let hw: NextApiHandler<void>;

  beforeAll(() => {
    const getHandler = async (base: Base<void>) => {
      base.res.send('It works!');
    };
    const postHandler = async () => {};
    const deleteHandler = async () => {};

    hw = switchMethod({
      GET: handlerWrapper(getHandler),
      POST: handlerWrapper(postHandler),
      DELETE: handlerWrapper(deleteHandler),
    });
  });

  test('GET', async () => {
    await testApiHandler({
      handler: hw,
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

  test('POST', async () => {
    await testApiHandler({
      handler: hw,
      test: async ({fetch}) => {
        // Returns a real ServerResponse instance
        const res = await fetch({
          method: 'POST',
        });
        expect(res.status).toBe(200);
      },
    });
  });

  test('PUT: 存在しない', async () => {
    await testApiHandler({
      handler: hw,
      test: async ({fetch}) => {
        // Returns a real ServerResponse instance
        const res = await fetch({
          method: 'PUT',
        });
        expect(res.status).toBe(400);
      },
    });
  });

  test('DELETE', async () => {
    await testApiHandler({
      handler: hw,
      test: async ({fetch}) => {
        // Returns a real ServerResponse instance
        const res = await fetch({
          method: 'DELETE',
        });
        expect(res.status).toBe(200);
      },
    });
  });

  test('HEAD: 存在しない', async () => {
    await testApiHandler({
      handler: hw,
      test: async ({fetch}) => {
        // Returns a real ServerResponse instance
        const res = await fetch({
          method: 'HEAD',
        });
        expect(res.status).toBe(400);
      },
    });
  });
});
