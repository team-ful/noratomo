import {testApiHandler} from 'next-test-api-route-handler';
import {get, post, _delete} from '../../src/request';
import {
  createApplication,
  findApplicationsByUserId,
} from '../../src/services/application';
import {createEntryRow} from '../../src/services/entry';
import {
  findNumberOfByUserId,
  insertNumberOf,
} from '../../src/services/numberOf';
import {createShop} from '../../src/services/shop';
import TestBase from '../../src/tests/base';
import {createEntryModel, createShopModel} from '../../src/tests/models';

describe('request', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();

    const u = await base.newUser();
    await u.addSession(base.db);
  });

  afterAll(async () => {
    await base.end();
  });

  test('applicationを追加できる', async () => {
    const entry = createEntryModel();

    await testApiHandler({
      handler: post,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
          ...req.headers,
        };
      },
      url: `?id=${entry.id}`,
      test: async ({fetch}) => {
        const res = await fetch({method: 'POST'});

        expect(res.status).toBe(200);

        const request = await findApplicationsByUserId(
          base.db,
          base.users[0].user?.id || NaN,
          {}
        );

        expect(request.length).toBe(1);
        expect(request[0].entry_id).toBe(entry.id);

        const numberOf = await findNumberOfByUserId(
          base.db,
          base.users[0].user?.id || NaN
        );

        expect(numberOf?.application).toBe(1);
      },
    });
  });

  test('削除できる', async () => {
    const entry = createEntryModel();
    const useID = base.users[0].user?.id || NaN;

    const id = await createApplication(base.db, useID, entry.id);
    await insertNumberOf(base.db, useID, 0, 0, 0, 1);

    const numberOfBefore = await findNumberOfByUserId(base.db, useID);

    await testApiHandler({
      handler: _delete,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
          ...req.headers,
        };
      },
      url: `?id=${entry.id}`,
      test: async ({fetch}) => {
        const res = await fetch({method: 'DELETE'});

        expect(res.status).toBe(200);

        const request = await findApplicationsByUserId(base.db, useID, {});
        expect(request.find(v => v.id === id)).toBeFalsy();

        const numberOfAfter = await findNumberOfByUserId(
          base.db,
          base.users[0].user?.id || NaN
        );

        expect(
          (numberOfBefore?.application ?? 0) - (numberOfAfter?.application ?? 0)
        ).toBe(1);
      },
    });
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

    const entry = createEntryModel({shop_id: shop.id});
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

    const useID = base.users[0].user?.id || NaN;

    await createApplication(base.db, useID, entry.id);

    await testApiHandler({
      handler: get,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
          ...req.headers,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({method: 'GET'});

        expect(res.status).toBe(200);

        const entries = await res.json();

        expect(entries.length).toBe(1);
        expect(entries[0].id).toBe(entry.id);
      },
    });
  });
});
