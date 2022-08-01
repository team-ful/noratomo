import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {
  createShop,
  createShopUserDefined,
  findShopByHotpepperID,
  findShopById,
} from '../../src/services/shop';
import TestBase from '../../src/tests/base';
import {createShopModel} from '../../src/tests/models';

describe('shop', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('findShopByHotpepperID', async () => {
    const shop = createShopModel();

    const row = await base.db.test<ResultSetHeader>(
      `INSERT INTO shop (
      name,
      address,
      lat,
      lon,
      genre_name,
      genre_catch,
      gender,
      site_url,
      photo_url,
      hotpepper_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        shop.name,
        shop.address,
        shop.lat,
        shop.lon,
        shop.genre_name,
        shop.genre_catch,
        shop.gender,
        shop.site_url,
        shop.photo_url,
        shop.hotpepper_id,
      ]
    );

    const s = await findShopByHotpepperID(base.db, shop.hotpepper_id || '');

    expect(row.insertId).toBe(s?.id);
    expect(s?.hotpepper_id).toBe(shop.hotpepper_id);
    expect(s?.name).toBe(shop.name);
  });

  test('findShopById', async () => {
    const shop = createShopModel();

    const row = await base.db.test<ResultSetHeader>(
      `INSERT INTO shop (
      name,
      address,
      lat,
      lon,
      genre_name,
      genre_catch,
      gender,
      site_url,
      photo_url,
      hotpepper_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        shop.name,
        shop.address,
        shop.lat,
        shop.lon,
        shop.genre_name,
        shop.genre_catch,
        shop.gender,
        shop.site_url,
        shop.photo_url,
        shop.hotpepper_id,
      ]
    );

    const s = await findShopById(base.db, row.insertId);

    expect(row.insertId).toBe(s?.id);
    expect(s?.hotpepper_id).toBe(shop.hotpepper_id);
    expect(s?.name).toBe(shop.name);
  });

  test('createShop', async () => {
    const shop = createShopModel();

    const id = await createShop(
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

    const result = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM shop WHERE id = ?',
      [id]
    );

    expect(result.length).toBe(1);
    expect(result[0]['name']).toBe(shop.name);
  });

  test('createShopUserDefined', async () => {
    const shop = createShopModel();

    const id = await createShopUserDefined(
      base.db,
      shop.name,
      shop.address,
      shop.lat,
      shop.lon,
      shop.genre_name,
      shop.gender,
      shop.site_url,
      shop.photo_url || undefined
    );

    const result = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM shop WHERE id = ?',
      [id]
    );

    expect(result.length).toBe(1);
    expect(result[0]['name']).toBe(shop.name);
  });
});
