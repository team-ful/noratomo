import {testApiHandler} from 'next-test-api-route-handler';
import {detail} from '../../src/entry';
import {createApplication} from '../../src/services/application';
import {createEntryRow} from '../../src/services/entry';
import {createShop} from '../../src/services/shop';
import TestBase from '../../src/tests/base';
import {createEntryModel, createShopModel} from '../../src/tests/models';

describe('detail', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();

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

    const entry = createEntryModel({
      owner_user_id: base.users[0].user?.id,
      shop_id: shop.id,
    });
    entry.id = await createEntryRow(
      base.db,
      entry.owner_user_id,
      entry.shop_id,
      entry.title,
      entry.body || '',
      entry.meeting_lat,
      entry.meeting_lon,
      entry.meet_date
    );

    const applicationUser = await base.newUser();
    await createApplication(base.db, applicationUser.user?.id || 0, entry.id);

    await testApiHandler({
      handler: detail,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
          ...req.headers,
        };
      },
      url: `?entry_id=${entry.id}`,
      test: async ({fetch}) => {
        const res = await fetch({method: 'GET'});

        expect(res.status).toBe(200);

        const detailEntry = await res.json();

        expect(detailEntry.id).toBe(entry.id);
        expect(detailEntry.shop.id).toBe(shop.id);
        expect(detailEntry.applications.length).toBe(1);
        expect(detailEntry.applications[0].user.avatar_url).toBe(
          applicationUser.user?.avatar_url
        );
      },
    });
  });
});
