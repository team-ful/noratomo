import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {
  createNotice,
  findNoReadNoticeByUserId,
  findNoticeByUserId,
  read,
} from '../../src/services/notice';
import TestBase from '../../src/tests/base';
import {createNoticeModel} from '../../src/tests/models';

describe('notice', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('createNotice', async () => {
    const noticeModel = createNoticeModel();

    const id = await createNotice(
      base.db,
      noticeModel.user_id,
      noticeModel.title
    );

    const row = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM notice WHERE id = ?',
      [id]
    );

    expect(row.length).toBe(1);
    expect(row[0]['user_id']).toBe(noticeModel.user_id);
    expect(row[0].is_read).toBe(0);
  });

  test('findNoticeByUserId', async () => {
    const noticeModel = createNoticeModel();

    for (let i = 0; 3 > i; i++) {
      await base.db.test(
        'INSERT INTO notice (user_id, title, is_read, created) VALUES (?, ?, ?, NOW())',
        [noticeModel.user_id, noticeModel.title, noticeModel.is_read]
      );
    }

    const notices = await findNoticeByUserId(base.db, noticeModel.user_id);

    expect(notices.length).toBe(3);

    const noticesLimit = await findNoticeByUserId(
      base.db,
      noticeModel.user_id,
      2
    );

    expect(noticesLimit.length).toBe(2);
  });

  test('findNoReadNoticeByUserId', async () => {
    const noticeModel = createNoticeModel({is_read: true});

    for (let i = 0; 1 > i; i++) {
      await base.db.test(
        'INSERT INTO notice (user_id, title, is_read, created) VALUES (?, ?, ?, NOW())',
        [noticeModel.user_id, noticeModel.title, noticeModel.is_read]
      );
    }
    await base.db.test(
      'INSERT INTO notice (user_id, title, is_read, created) VALUES (?, ?, ?, NOW())',
      [noticeModel.user_id, noticeModel.title, false]
    );

    const notices = await findNoReadNoticeByUserId(
      base.db,
      noticeModel.user_id
    );

    expect(notices.length).toBe(1);
  });

  test('read', async () => {
    const noticeModel = createNoticeModel({is_read: false});
    const id = (
      await base.db.test<ResultSetHeader>(
        'INSERT INTO notice (user_id, title, is_read, created) VALUES (?, ?, ?, NOW())',
        [noticeModel.user_id, noticeModel.title, noticeModel.is_read]
      )
    ).insertId;

    await read(base.db, id);

    const row = await base.db.test<RowDataPacket[]>(
      'SELECT is_read FROM notice WHERE id =?',
      [id]
    );

    expect(row.length).toBe(1);
    expect(row[0]['is_read']).toBe(1);
  });
});
