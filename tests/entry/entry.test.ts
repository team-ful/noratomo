import {fillShop, fillShopAndRequest} from '../../src/entry/entry';
import Entry from '../../src/models/entry';
import {createApplication} from '../../src/services/application';
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

  test('fillShopAndRequest', async () => {
    const user = await base.newUser();
    const user2 = await base.newUser();
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
      owner_user_id: user2.user?.id,
      shop_id: shop.id,
    });
    const entry3 = createEntryModel({
      owner_user_id: user.user?.id,
      shop_id: shop.id,
    });
    const entries = [entry1, entry2, entry3];

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

    await createApplication(base.db, user.user?.id || NaN, entry3.id);

    const shopIncludeEntry = await fillShopAndRequest(
      base.db,
      entries.map(v => new Entry(v)),
      user.user?.id || NaN
    );

    // is_ownerフラグが正しく立っている
    expect(
      shopIncludeEntry.find(v => v.id === entry1.id && v.is_owner)
    ).toBeTruthy();
    expect(
      shopIncludeEntry.find(v => v.id === entry2.id && !v.is_owner)
    ).toBeTruthy();
  });
});
