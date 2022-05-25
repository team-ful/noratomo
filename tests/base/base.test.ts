import {testApiHandler} from 'next-test-api-route-handler';
import {ApiError} from 'next/dist/server/api-utils';
import Base, {Device} from '../../src/base/base';
import {handlerWrapper} from '../../src/base/handlerWrapper';

describe('getQuery', () => {
  test('URLクエリパラメータが取得できる', async () => {
    const handler = async (base: Base<void>) => {
      expect(base.getQuery('hoge')).toBe('huga');
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      url: '/?hoge=huga',
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
        res.status.end;
      },
    });
  });

  test('クエリパラメータの値が空', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(base.getQuery('hoge')).toBe('');
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      url: '/?hoge',
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });

  test('クエリパラメータは存在しない', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(base.getQuery('nya')).toBe(undefined);
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      url: '/?hoge',
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });
});

describe('getPostForm', () => {
  const query = 'test=hoge';

  test('getPostFormで取得できる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      const form = base.getPostForm();
      expect(form['test']).toBe('hoge');
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: query,
        });

        expect(res.status).toBe(200);
      },
    });
  });

  test('content-typeがapplication/x-www-form-urlencodedではない', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(() => base.getPostForm()).toThrow(
        new ApiError(400, 'no application/x-www-form-urlencoded')
      );
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'text/plain',
          },
          body: query,
        });

        expect(res.status).toBe(200);
      },
    });
  });
});

describe('getPostJson', () => {
  const query = {test: 'hoge'};

  test('getPostFormで取得できる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      const json = base.getPostJson();
      expect(json).toEqual(query);
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(query),
        });

        expect(res.status).toBe(200);
      },
    });
  });

  test('content-typeがapplication/jsonではない', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(() => base.getPostJson()).toThrow(
        new ApiError(400, 'no application/(id+)?json')
      );
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'text/plain',
          },
          body: JSON.stringify(query),
        });

        expect(res.status).toBe(200);
      },
    });
  });
});

describe('checkContentType', () => {
  test('同じcontent-typeの場合はtrueが返る', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(base.checkContentType('text/plain')).toBe(true);
      expect(base.checkContentType('Text/Plain')).toBe(true);
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'text/plain',
          },
          body: '',
        });

        expect(res.status).toBe(200);
      },
    });
  });

  test('違うcontent-typeの場合はfalseが返る', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(base.checkContentType('application/json')).toBe(false);
      expect(base.checkContentType('text/pl')).toBe(false);
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'text/plain',
          },
          body: '',
        });

        expect(res.status).toBe(200);
      },
    });
  });
});

describe('parseIp', () => {
  test('IPアドレスが取得できる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(base.getIp()).toBe('::ffff:127.0.0.1');
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);
      },
    });
  });
});

describe('parseUA', () => {
  test('WIndows UAが取得できる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(base.getVender()).toBe('Chrome');
      expect(base.getPlatform()).toBe('Windows');
      expect(base.getDevice()).toEqual(Device.Desktop);
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      requestPatcher: req =>
        (req.headers = {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36',
        }),
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);
      },
    });
  });

  test('iPhone UAが取得できる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(base.getVender()).toBe('Mobile Safari');
      expect(base.getPlatform()).toBe('iOS');
      expect(base.getDevice()).toEqual(Device.Mobile);
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      requestPatcher: req =>
        (req.headers = {
          'user-agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        }),
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);
      },
    });
  });

  test('client hintsでUAを取得できる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(base.getVender()).toBe('Google Chrome');
      expect(base.getPlatform()).toBe('Windows');
      expect(base.getDevice()).toEqual(Device.Desktop);
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      requestPatcher: req =>
        (req.headers = {
          'sec-ch-ua-platform': '"Windows"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua':
            '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
        }),
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);
      },
    });
  });
});

describe('sendJson', () => {
  const data = {test: 'hoge'};

  test('client hintsでUAを取得できる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      base.sendJson(data);
    };

    const h = handlerWrapper(handler);

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();

        console.log(res.headers);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(data);
      },
    });
  });
});
