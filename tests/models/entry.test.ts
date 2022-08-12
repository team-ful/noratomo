import Entry from '../../src/models/entry';
import {createShop} from '../../src/services/shop';
import TestBase from '../../src/tests/base';
import {createEntryModel, createShopModel} from '../../src/tests/models';

describe('entry', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('作成できる', () => {
    const entry = createEntryModel();

    const e = new Entry(entry);

    expect(e.body).toBe(entry.body);
    expect(e.id).toBe(entry.id);
  });

  test('jsonShopIncluded', async () => {
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

    const entry = createEntryModel({shop_id: shopId});

    const e = new Entry(entry);

    const resp = await e.jsonShopIncluded(base.db);

    expect(resp.id).toBe(entry.id);
    expect(shop.address).toBe(shop.address);
  });
});
