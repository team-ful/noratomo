import {fillShop} from '../../src/entry/entry';
import Entry from '../../src/models/entry';
import {createEntryRow} from '../../src/services/entry';
import {createShop} from '../../src/services/shop';
import TestBase from '../../src/tests/base';
import {createEntryModel, createShopModel} from '../../src/tests/models';

describe('entry', () => {
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

  test('fillShop', async () => {
    const user = await base.newUser();
    const shop = createShopModel();
    const shopId = await createShop(
      base.db,
      shop.name,
      shop.address,
      shop.lat,
      shop.lon,
      shop.genre_name,
      shop.genre_catch ?? '',
      shop.gender,
      shop.site_url,
      shop.photo_url ?? '',
      shop.hotpepper_id ?? ''
    );
    shop.id = shopId;

    const entry1 = createEntryModel({
      owner_user_id: user.user?.id,
      shop_id: shop.id,
    });
    const entry2 = createEntryModel({
      owner_user_id: user.user?.id,
      shop_id: shop.id,
    });
    const entries = [entry1, entry2];

    for (const entry of entries) {
      const id = await createEntryRow(
        base.db,
        entry.owner_user_id,
        entry.shop_id,
        entry.title,
        entry.body ?? ''
      );
      entry.id = id;
    }

    const shopIncludeEntry = await fillShop(
      base.db,
      entries.map(v => new Entry(v))
    );

    expect(shopIncludeEntry[0].shop.id).toBe(shop.id);
  });
});
