import fetchMock from 'fetch-mock-jest';
import FormData from 'form-data';
import {PageConfig} from 'next';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../config';
import {post} from '../../src/entry';
import {findEntryById} from '../../src/services/entry';
import {findShopById} from '../../src/services/shop';
import TestBase from '../../src/tests/base';
import {createEntryModel, createShopModel} from '../../src/tests/models';
import {randomText} from '../../src/utils/random';

const hotppeerBody = (id: string) => ({
  results: {
    api_version: '1.26',
    results_available: 1,
    results_returned: '1',
    results_start: 1,
    shop: [
      {
        access: 'ＪＲ武蔵野線越谷レイクタウン駅北口より徒歩約18分  ',
        address: '埼玉県越谷市レイクタウン３－1－1　イオンレイクタウンMORI',
        budget_memo: '',
        catch: '',
        food: {},
        genre: {
          catch: 'にゃにゃにゃ',
          name: 'カフェ・スイーツ',
        },
        id: id,
        lat: 35.8820392884,
        lng: 139.8280217533,
        name: 'にゃにゃにゃ イオンレイクタウン店',
        other_memo: '',
        photo: {
          pc: {
            l: 'https://imgfp.hotp.jp/IMGH/aaaa.jpg',
            m: 'https://imgfp.hotp.jp/IMGH/aaaa.jpg',
            s: 'https://imgfp.hotp.jp/IMGH/aaaa.jpg',
          },
        },
        shop_detail_memo: '',
        urls: {
          pc: 'https://example.com',
        },
      },
    ],
  },
});

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

    const id = randomText(10);

    const url = endpoint;
    url.searchParams.set('key', apiKey);
    url.searchParams.set('id', id);
    url.searchParams.set('format', 'json');
    url.searchParams.set('type', 'lite');
    url.searchParams.set('count', '1');
    url.searchParams.set('start', '0');

    fetchMock.get(url.toString(), {
      body: hotppeerBody(id),
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

  test('すでにshopにある場合はそれを使う', async () => {
    const shop = createShopModel();
  });
});
