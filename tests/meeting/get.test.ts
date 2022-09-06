import {testApiHandler} from 'next-test-api-route-handler';
import {get} from '../../src/meeting';
import {EntryModel} from '../../src/models/entry';
import {MeetModel} from '../../src/models/meet';
import {ShopModel} from '../../src/models/shop';
import {createEntryRow} from '../../src/services/entry';
import {createMeet} from '../../src/services/meet';
import {createShop} from '../../src/services/shop';
import TestBase from '../../src/tests/base';
import {
  createEntryModel,
  createMeetModel,
  createShopModel,
} from '../../src/tests/models';
import {TestUser} from '../../src/tests/user';

describe('get', () => {
  const base = new TestBase();
  let _meet: MeetModel;
  let _entry: EntryModel;
  let _shop: ShopModel;
  let owner: TestUser;
  let partner: TestUser;

  beforeAll(async () => {
    await base.connection();

    owner = await base.newUser();
    partner = await base.newUser();

    await owner.addSession(base.db);
    await partner.addSession(base.db);

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
      owner_user_id: owner.user?.id,
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

    const meet = createMeetModel({
      owner_id: owner.user?.id,
      apply_user_id: partner.user?.id,
      entry_id: entry.id,
    });
    meet.id = await createMeet(
      base.db,
      meet.entry_id,
      meet.owner_id,
      meet.apply_user_id
    );

    _meet = meet;
    _entry = entry;
    _shop = shop;
  });

  afterAll(async () => {
    await base.end();
  });

  test('取得できる', async () => {
    await testApiHandler({
      handler: get,
      requestPatcher: async req => {
        req.headers = {
          cookie: owner.cookie,
          ...req.headers,
        };
      },
      url: `?entry_id=${_entry.id}`,
      test: async ({fetch}) => {
        const res = await fetch({method: 'GET'});

        expect(res.status).toBe(200);

        const matchEntry = await res.json();

        expect(matchEntry.id).toBe(_entry.id);
        expect(matchEntry.shop.id).toBe(_shop.id);
        expect(matchEntry.partner.user_name).toBe(partner.user?.user_name);
        expect(matchEntry.find_id).not.toBeNull();
      },
    });
  });

  test('ユーザが関係者じゃないと取得できない', async () => {
    const externalUser = await base.newUser();
    await externalUser.addSession(base.db);

    await testApiHandler({
      handler: get,
      requestPatcher: async req => {
        req.headers = {
          cookie: externalUser.cookie,
          ...req.headers,
        };
      },
      url: `?entry_id=${_entry.id}`,
      test: async ({fetch}) => {
        const res = await fetch({method: 'GET'});

        expect(res.status).toBe(400);
      },
    });
  });

  test('パートナー側でも取得できる', async () => {
    await testApiHandler({
      handler: get,
      requestPatcher: async req => {
        req.headers = {
          cookie: partner.cookie,
          ...req.headers,
        };
      },
      url: `?entry_id=${_entry.id}`,
      test: async ({fetch}) => {
        const res = await fetch({method: 'GET'});

        expect(res.status).toBe(200);

        const matchEntry = await res.json();

        expect(matchEntry.id).toBe(_entry.id);
        expect(matchEntry.shop.id).toBe(_shop.id);
        expect(matchEntry.partner.user_name).toBe(owner.user?.user_name);
        expect(matchEntry.find_id).not.toBeNull();
      },
    });
  });
});
