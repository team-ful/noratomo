import fs from 'fs';
import fetchMock from 'fetch-mock-jest';
import FormData from 'form-data';
import {PageConfig} from 'next';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../config';
import {post} from '../../src/entry';
import {findEntryById} from '../../src/services/entry';
import {findShopById} from '../../src/services/shop';
import TestBase from '../../src/tests/base';
import {createEntryModel} from '../../src/tests/models';

describe('post', () => {
  const base = new TestBase();
  const endpoint = config.hotpepperGourmetSearchEndpoint;
  const apiKey = config.hotpepperApiKey;

  beforeAll(async () => {
    await base.connection();

    const u = await base.newUser();
    await u.loginFromPassword(base.db);
    await u.addSession(base.db);
  });

  afterAll(async () => {
    await base.end();
  });

  test('ホットペッパーIDを指定して投稿できる', async () => {
    expect.hasAssertions();

    const id = 'j1234';

    const url = endpoint;
    url.searchParams.set('key', apiKey);
    url.searchParams.set('id', id);
    url.searchParams.set('format', 'json');
    url.searchParams.set('type', 'lite');
    url.searchParams.set('count', '1');
    url.searchParams.set('start', '0');

    const resp = fs.readFileSync(
      './tests/service/api/hotpepper/gourmet_response_sample2.json'
    );

    fetchMock.get(url.toString(), {
      body: resp.toString(),
      headers: {
        // 何故かjsなのである
        'content-type': 'text/javascript',
      },
    });

    const h: typeof post & {config?: PageConfig} = post;
    h.config = {
      api: {
        bodyParser: false,
      },
    };

    const entry = createEntryModel();

    const form = new FormData();
    form.append('title', entry.title);
    form.append('body', entry.body);
    form.append('hotppepper', id);

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
          ...req.headers,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          body: form,
        });

        expect(res.status).toBe(200);

        const newEntry = await res.json();

        // DBからEntryを引く
        const newEntryFromDB = await findEntryById(base.db, newEntry.id);
        if (newEntryFromDB === null) {
          throw new Error();
        }
        expect(newEntryFromDB.title).toBe(entry.title);
        expect(newEntryFromDB.body).toBe(entry.body);
        expect(newEntryFromDB.owner_user_id).toBe(base.users[0].user?.id);

        // DBからshopを引く（新しく追加されているはず）
        const newShop = await findShopById(base.db, newEntryFromDB.shop_id);
        expect(newShop?.name).toBe('にゃにゃにゃ イオンレイクタウン店');
      },
    });
  });
});
