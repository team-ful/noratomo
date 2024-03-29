import fetchMock from 'fetch-mock-jest';
import FormData from 'form-data';
import {PageConfig} from 'next';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../config';
import {post} from '../../src/entry';
import {findEntryById} from '../../src/services/entry';
import {findNumberOfByUserId} from '../../src/services/numberOf';
import {createShop, findShopById} from '../../src/services/shop';
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

  const h: typeof post & {config?: PageConfig} = post;
  h.config = {
    api: {
      bodyParser: false,
    },
  };

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

    const entry = createEntryModel();

    const form = new FormData();
    form.append('title', entry.title);
    form.append('body', entry.body);
    form.append('meeting_lat', '1000.111');
    form.append('meeting_lon', '130000.0');
    form.append('meet_date', new Date().toISOString());
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

        const numberOf = await findNumberOfByUserId(
          base.db,
          base.users[0].user?.id || 0
        );
        expect(numberOf).not.toBeNull();
        expect(numberOf?.entry).toBe(1);
      },
    });
  });

  test('すでにshopにある場合はそれを使う', async () => {
    const shop = createShopModel();

    const shopId = await createShop(
      base.db,
      shop.name,
      shop.address,
      shop.lat,
      shop.lon,
      shop.genre_name,
      shop.genre_catch || '',
      shop.gender,
      shop.site_url,
      shop.photo_url || '',
      shop.hotpepper_id || ''
    );

    const entry = createEntryModel();

    const form = new FormData();
    form.append('title', entry.title);
    form.append('body', entry.body);
    form.append('meeting_lat', '1000.111');
    form.append('meeting_lon', '130000.0');
    form.append('meet_date', new Date().toISOString());
    form.append('hotppepper', shop.hotpepper_id);

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
        expect(newShop?.id).toBe(shopId);
        expect(newShop?.name).toBe(shop.name);
      },
    });
  });

  test('ホットペッパーお店IDを指定しない場合、ユーザが店情報を追加する必要がある', async () => {
    const entry = createEntryModel();
    const shop = createShopModel({photo_url: randomText(20)});

    const form = new FormData();
    form.append('title', entry.title);
    form.append('body', entry.body);
    form.append('meeting_lat', '1000.111');
    form.append('meeting_lon', '130000.0');
    form.append('meet_date', new Date().toISOString());

    // shop情報
    form.append('shop_name', shop.name);
    form.append('shop_address', shop.address);
    form.append('lat', shop.lat);
    form.append('lon', shop.lon);
    form.append('genre_name', shop.genre_name);
    form.append('gender', 'true');
    form.append('site_url', shop.site_url);
    form.append('photo', shop.photo_url || '');

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
        expect(newShop?.name).toBe(shop.name);
        expect(newShop?.photo_url).toBe(shop.photo_url);
      },
    });
  });

  test('ユーザ定義の店情報はphotoは省略可能', async () => {
    const entry = createEntryModel();
    const shop = createShopModel();

    const form = new FormData();
    form.append('title', entry.title);
    form.append('body', entry.body);
    form.append('meeting_lat', '1000.111');
    form.append('meeting_lon', '130000.0');
    form.append('meet_date', new Date().toISOString());

    // shop情報
    form.append('shop_name', shop.name);
    form.append('shop_address', shop.address);
    form.append('lat', shop.lat);
    form.append('lon', shop.lon);
    form.append('genre_name', shop.genre_name);
    form.append('gender', 'true');
    form.append('site_url', shop.site_url);

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
        expect(newShop?.name).toBe(shop.name);
        expect(newShop?.photo_url).toBeNull();
      },
    });
  });

  test('bodyは省略可能', async () => {
    const entry = createEntryModel();
    const shop = createShopModel();

    const form = new FormData();
    form.append('title', entry.title);
    form.append('meeting_lat', '1000.111');
    form.append('meeting_lon', '130000.0');
    form.append('meet_date', new Date().toISOString());

    // shop情報
    form.append('shop_name', shop.name);
    form.append('shop_address', shop.address);
    form.append('lat', shop.lat);
    form.append('lon', shop.lon);
    form.append('genre_name', shop.genre_name);
    form.append('gender', 'true');
    form.append('site_url', shop.site_url);
    form.append('photo', shop.photo_url || '');

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
        expect(newEntryFromDB.body).toBe(''); // Nullalbeだけどnullにはならない
        expect(newEntryFromDB.owner_user_id).toBe(base.users[0].user?.id);

        // DBからshopを引く（新しく追加されているはず）
        const newShop = await findShopById(base.db, newEntryFromDB.shop_id);
        expect(newShop?.name).toBe(shop.name);
      },
    });
  });
});
