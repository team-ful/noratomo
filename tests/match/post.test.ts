import {randomInt} from 'crypto';
import FormData from 'form-data';
import {testApiHandler} from 'next-test-api-route-handler';
import {post} from '../../src/match';
import {createApplication} from '../../src/services/application';
import {createEntryRow, findEntryById} from '../../src/services/entry';
import {findMeetByEntryId} from '../../src/services/meet';
import {findNoticeByUserId} from '../../src/services/notice';
import TestBase from '../../src/tests/base';
import formDataHandler from '../../src/tests/handler';
import {createEntryModel} from '../../src/tests/models';

describe('post', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();

    const u = await base.newUser();
    await u.addSession(base.db);
  });

  afterAll(async () => {
    await base.end();
  });

  test('マッチできる', async () => {
    const entryModel = createEntryModel({
      owner_user_id: base.users[0].user?.id,
    });
    const entryId = await createEntryRow(
      base.db,
      entryModel.owner_user_id,
      entryModel.shop_id,
      entryModel.title,
      entryModel.body || '',
      entryModel.meeting_lat,
      entryModel.meeting_lon,
      entryModel.meet_date
    );

    const requestUser = await base.newUser();
    const applicatonId = await createApplication(
      base.db,
      requestUser.user?.id || 0,
      entryId
    );
    const notices = await findNoticeByUserId(
      base.db,
      requestUser.user?.id || NaN
    );

    const h = formDataHandler(post);
    const form = new FormData();
    form.append('entry_id', entryId);
    form.append('application_id', applicatonId);

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
          ...req.headers,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({method: 'POST', body: form});

        expect(res.status).toBe(200);

        const entry = await findEntryById(base.db, entryId);
        expect(entry).not.toBeNull();
        expect(entry?.is_matched).toBeTruthy();

        const meet = await findMeetByEntryId(base.db, entryId);
        expect(meet).not.toBeNull();
        expect(meet?.owner_id).toBe(base.users[0].user?.id);
        expect(meet?.apply_user_id).toBe(requestUser.user?.id);

        const afterNotices = await findNoticeByUserId(
          base.db,
          requestUser.user?.id || NaN
        );

        // 通知が+1されている
        expect(notices.length).toBe(afterNotices.length - 1);
      },
    });
  });

  test('entryIdが不正の場合は400', async () => {
    const entryModel = createEntryModel({
      owner_user_id: base.users[0].user?.id,
    });
    const entryId = await createEntryRow(
      base.db,
      entryModel.owner_user_id,
      entryModel.shop_id,
      entryModel.title,
      entryModel.body || '',
      entryModel.meeting_lat,
      entryModel.meeting_lon,
      entryModel.meet_date
    );

    const requestUser = await base.newUser();
    const applicatonId = await createApplication(
      base.db,
      requestUser.user?.id || 0,
      entryId
    );

    const h = formDataHandler(post);
    const form = new FormData();

    // ランダムな値にする
    form.append('entry_id', randomInt(10000));
    form.append('application_id', applicatonId);

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
          ...req.headers,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({method: 'POST', body: form});

        expect(res.status).toBe(400);
      },
    });
  });

  test('applicationIdが不正の場合は400', async () => {
    const entryModel = createEntryModel({
      owner_user_id: base.users[0].user?.id,
    });
    const entryId = await createEntryRow(
      base.db,
      entryModel.owner_user_id,
      entryModel.shop_id,
      entryModel.title,
      entryModel.body || '',
      entryModel.meeting_lat,
      entryModel.meeting_lon,
      entryModel.meet_date
    );

    const requestUser = await base.newUser();
    await createApplication(base.db, requestUser.user?.id || 0, entryId);

    const h = formDataHandler(post);
    const form = new FormData();

    form.append('entry_id', entryId);
    form.append('application_id', randomInt(10000));

    await testApiHandler({
      handler: h,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
          ...req.headers,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({method: 'POST', body: form});

        expect(res.status).toBe(400);
      },
    });
  });
});
