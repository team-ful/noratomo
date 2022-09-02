import {ResultSetHeader} from 'mysql2';
import {testApiHandler} from 'next-test-api-route-handler';
import {get} from '../../src/match';
import {createShop} from '../../src/services/shop';
import TestBase from '../../src/tests/base';
import formDataHandler from '../../src/tests/handler';
import {createEntryModel, createShopModel} from '../../src/tests/models';
import {randomText} from '../../src/utils/random';

describe('get', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('取得できる', async () => {
    const user = await base.newUser();
    await user.addSession(base.db);

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
    shop.id = shopId;
    const entryModel = createEntryModel({is_matched: true, shop_id: shop.id});
    entryModel.id = (
      await base.db.test<ResultSetHeader>(
        `INSERT INTO entry(
      owner_user_id,
      title,
      shop_id,
      number_of_people,
      date,
      is_matched
    ) VALUES (?, ?, ?, ?, NOW(), ?)`,
        [
          entryModel.owner_user_id,
          entryModel.title,
          entryModel.shop_id,
          entryModel.number_of_people,
          entryModel.is_matched,
        ]
      )
    ).insertId;
    await base.db.test(
      `INSERT INTO application (
      user_id,
      entry_id
    ) VALUES (?, ?)`,
      [user.user?.id, entryModel.id]
    );
    await base.db.test(
      `INSERT INTO meet (
      entry_id,
      owner_id,
      apply_user_id,
      find_id
    ) VALUES (?, ?, ?, ?)`,
      [entryModel.id, entryModel.owner_user_id, user.user?.id, randomText(15)]
    );

    const h = formDataHandler(get);

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.sessionCookie,
          ...req.headers,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({method: 'GET'});

        expect(res.status).toBe(200);

        // 空の配列で帰ってくる
        const entries = await res.json();
        expect(entries.length).toBe(1);

        expect(entries[0].id).toBe(entryModel.id);
      },
    });
  });

  test('取得できる（0件）', async () => {
    const user = await base.newUser();
    await user.addSession(base.db);
    const h = formDataHandler(get);

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.sessionCookie,
          ...req.headers,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({method: 'GET'});

        expect(res.status).toBe(200);

        // 空の配列で帰ってくる
        expect((await res.json()).length).toBe(0);
      },
    });
  });
});
