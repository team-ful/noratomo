import {URL} from 'url';
import {serialize} from 'cookie';
import {testApiHandler} from 'next-test-api-route-handler';
import {ApiError} from 'next/dist/server/api-utils';
import config from '../../config';
import Base, {Device} from '../../src/base/base';
import {handlerWrapper} from '../../src/base/handlerWrapper';
import {findLoginHistoriesByUserID} from '../../src/services/loginHistory';
import {findSessionTokenByRefreshToken} from '../../src/services/session';
import {findUserBySessionToken} from '../../src/services/user';
import TestBase from '../../src/tests/base';
import {TestUser} from '../../src/tests/user';

describe('getQuery', () => {
  test('URLクエリパラメータが取得できる', async () => {
    const handler = async (base: Base<void>) => {
      expect(base.getQuery('hoge')).toBe('huga');
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      url: '/?hoge=huga',
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });

  test('クエリパラメータの値が空', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(base.getQuery('hoge')).toBe('');
    };

    const h = handlerWrapper(handler, 'GET');

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

    const h = handlerWrapper(handler, 'GET');

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

describe('getPostURLForm', () => {
  const query = 'test=hoge';

  test('getPostURLFormで取得できる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      const form = base.getPostURLForm('test');
      expect(form).toBe('hoge');

      const noExistForm = base.getPostURLForm('testaaaaa');
      expect(noExistForm).toBeUndefined();

      expect(() => {
        base.getPostURLForm('testaaaaa', true);
      }).toThrow('Illegal form value testaaaaa');
    };

    const h = handlerWrapper(handler, 'POST');

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
      expect(() => base.getPostURLForm('test')).toThrow(
        new ApiError(400, 'no application/x-www-form-urlencoded')
      );
    };

    const h = handlerWrapper(handler, 'POST');

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

  test('getPostJsonで取得できる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      const json = base.getPostJson();
      expect(json).toEqual(query);
    };

    const h = handlerWrapper(handler, 'POST');

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

    const h = handlerWrapper(handler, 'POST');

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

    const h = handlerWrapper(handler, 'POST');

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

    const h = handlerWrapper(handler, 'POST');

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

    const h = handlerWrapper(handler, 'GET');

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

    const h = handlerWrapper(handler, 'GET');

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

    const h = handlerWrapper(handler, 'GET');

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

    const h = handlerWrapper(handler, 'GET');

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

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(data);
      },
    });
  });
});

describe('checkReferer', () => {
  const url = new URL('https://example.com');

  test('同じrefererのときはtrueが返る', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(base.checkReferer(url)).toBe(true);
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {referer: url.toString()};
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });

  test('違うrefererのときはfalseが返る', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(base.checkReferer(new URL('https://example.test'))).toBe(false);
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {referer: url.toString()};
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });

  test('refererがからの場合はfalse', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      expect(base.checkReferer(url)).toBe(false);
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });

  test('refererがURLでパースできない場合は400が返る', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      base.checkReferer(url);
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {referer: url.hostname};
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(400);
      },
    });
  });
});

describe('cookie', () => {
  test('cookieを取得できる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      const cookie = base.getCookie('test');

      expect(cookie).toBe('test-value');
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: serialize('test', 'test-value'),
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });

  test('cookieがない場合はundefinedが返る', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      const cookie = base.getCookie('test');

      expect(cookie).toBeUndefined();
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });

  test('cookieをセットできる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      base.setCookie('test', 'test-value');
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const cookie = res.cookies[0]['test'];

        expect(cookie).toBe('test-value');
      },
    });
  });

  test('cookieを複数セットできる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      base.setCookie('test', 'test-value');
      base.setCookie('test2', 'hogehoge');
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        expect(res.cookies[0]['test']).toBe('test-value');
        expect(res.cookies[1]['test2']).toBe('hogehoge');
      },
    });
  });

  test('cookieを削除できる', async () => {
    expect.hasAssertions();

    const handler = async (base: Base<void>) => {
      base.clearCookie('test');
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: serialize('test', 'test-value'),
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
        expect(res.cookies[0]['test']).toBe('');
        expect(res.cookies[0]['max-age']).toBe('-1');
      },
    });
  });
});

describe('newLogin', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('新規でログインするとtokenがcookieにセットされる', async () => {
    expect.hasAssertions();

    let userId = NaN;

    const handler = async (base: Base<void>) => {
      const user = new TestUser();
      await user.create(await base.db());
      await user.addSession(await base.db());

      userId = user.user?.id || NaN;

      if (typeof user.user !== 'undefined') {
        await base.newLogin(user.user);
      }
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        let session = '';
        let refresh = '';

        for (const c of res.cookies) {
          if (typeof c[config.sessionCookieName] === 'string') {
            session = c[config.sessionCookieName];
          } else if (typeof c[config.refreshCookieName] === 'string') {
            refresh = c[config.refreshCookieName];
          }
        }

        const user = await findUserBySessionToken(base.db, session);

        expect(user?.id).toBe(userId);

        const sessionToken = await findSessionTokenByRefreshToken(
          base.db,
          refresh
        );

        expect(sessionToken).toBe(session);

        const loginHistory = await findLoginHistoriesByUserID(
          base.db,
          user?.id || NaN
        );

        expect(loginHistory).not.toBeNull();
        if (loginHistory) {
          expect(loginHistory.length).toBe(2); // TestUserでログイン履歴を保存しているため2
          expect(loginHistory[0].device_name).toBe(Device.Desktop);
        }
      },
    });
  });
});

describe('checkMethod', () => {
  test('何も指定しないとGET', async () => {
    expect.hasAssertions();

    const handler = async () => {
      null;
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });

  test('指定できる', async () => {
    expect.hasAssertions();

    const handler = async () => {
      null;
    };

    const h = handlerWrapper(handler, 'GET');

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);
      },
    });
  });

  test('違うメソッドでアクセスするとエラー', async () => {
    expect.hasAssertions();

    const handler = async () => {
      null;
    };

    const h = handlerWrapper(handler, 'POST');

    await testApiHandler({
      handler: h,
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(400);
      },
    });
  });
});
