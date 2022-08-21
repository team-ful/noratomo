import {testApiHandler} from 'next-test-api-route-handler';
import {getAll} from '../../src/entry';
import {createEntryRow} from '../../src/services/entry';
import {createShop} from '../../src/services/shop';
import TestBase from '../../src/tests/base';
import {createEntryModel, createShopModel} from '../../src/tests/models';

describe('getAll', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();

    // すべてのentryレコード削除する
    await base.db.test('TRUNCATE TABLE entry', []);

    const u = await base.newUser();
    await u.loginFromPassword(base.db);
    await u.addSession(base.db);
  });

  afterAll(async () => {
    await base.end();
  });

  test('取得できる', async () => {
    const shop = createShopModel({
      genre_catch: 'hogehoge',
      photo_url: 'https://example.com',
    });
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
    shop.id = shopId;

    const entry1 = createEntryModel({
      shop_id: shopId,
      owner_user_id: base.users[0].user?.id,
    });

    for (const e of [entry1]) {
      const id = await createEntryRow(
        base.db,
        e.owner_user_id,
        e.shop_id,
        e.title,
        e.body || ''
      );

      e.id = id;
    }

    await testApiHandler({
      handler: getAll,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
          ...req.headers,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);

        const response = await res.json();

        expect(response.find(v => v.id === entry1.id)).toBeTruthy();
      },
    });
  });
});
