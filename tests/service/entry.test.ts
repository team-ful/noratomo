import {randomInt} from 'crypto';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import DBOperator from '../../src/db/operator';
import {EntryModel} from '../../src/models/entry';
import Shop from '../../src/models/shop';
import User from '../../src/models/user';
import {
  closeEntry,
  createEntry,
  createEntryRow,
  deleteEntryByUserId,
  findAllEntries,
  findEntriesByIds,
  findEntryById,
  findEntryByShopId,
  findEntryByUserId,
  updateEntry,
  updateRequestPeople,
} from '../../src/services/entry';
import TestBase from '../../src/tests/base';
import {
  createEntryModel,
  createShopModel,
  createUserModel,
} from '../../src/tests/models';

/**
 * Entryを作成する（テスト用）
 *
 * @param {DBOperator} db - database
 * @param {EntryModel} e - entry
 */
async function ce(db: DBOperator, e: EntryModel): Promise<number> {
  const row = await db.test<ResultSetHeader>(
    `INSERT INTO entry (
    owner_user_id,
    title,
    shop_id,
    number_of_people,
    date,
    body,
    is_closed
  ) VALUES (?, ?, ?, ?, NOW(), ?, false)`,
    [e.owner_user_id, e.title, e.shop_id, e.number_of_people, e.body]
  );

  return row.insertId;
}

describe('entry', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('createEntryRow', async () => {
    const entry = createEntryModel();

    const id = await createEntryRow(
      base.db,
      entry.owner_user_id,
      entry.shop_id,
      entry.title,
      entry.body || ''
    );

    const result = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM entry WHERE id = ?',
      id
    );

    expect(result.length).toBe(1);
    expect(result[0].owner_user_id).toBe(entry.owner_user_id);
  });

  test('createEntry', async () => {
    const entry = createEntryModel();
    const user = createUserModel();
    const shop = createShopModel();

    const id = await createEntry(
      base.db,
      new User(user),
      new Shop(shop),
      entry.title,
      entry.body || ''
    );

    const result = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM entry WHERE id = ?',
      id
    );

    expect(result.length).toBe(1);
    expect(result[0].owner_user_id).toBe(user.id);
  });

  test('updateEntryタイトルのみ', async () => {
    const entry = createEntryModel();
    const id = await ce(base.db, entry);

    const newEntry = createEntryModel();

    await updateEntry(base.db, id, {
      title: newEntry.title,
    });

    const result = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM entry WHERE id = ?',
      id
    );

    expect(result.length).toBe(1);
    expect(result[0].owner_user_id).toBe(entry.owner_user_id);

    expect(result[0].title).toBe(newEntry.title);
    expect(result[0].body).toBe(entry.body);
  });

  test('updateEntryタイトル、本文', async () => {
    const entry = createEntryModel();
    const id = await ce(base.db, entry);

    const newEntry = createEntryModel();

    await updateEntry(base.db, id, {
      title: newEntry.title,
      body: newEntry.body || '',
    });

    const result = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM entry WHERE id = ?',
      id
    );

    expect(result.length).toBe(1);
    expect(result[0].owner_user_id).toBe(entry.owner_user_id);

    expect(result[0].title).toBe(newEntry.title);
    expect(result[0].body).toBe(newEntry.body);
  });

  test('closeEntry', async () => {
    const entry = createEntryModel();
    const id = await ce(base.db, entry);

    await closeEntry(base.db, id);

    const result = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM entry WHERE id = ?',
      id
    );

    expect(result.length).toBe(1);
    expect(result[0].is_closed).toBeTruthy();

    // すでにtrueになっているものに適用してもエラーは発生しない
    await closeEntry(base.db, id);

    const result2 = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM entry WHERE id = ?',
      id
    );

    expect(result2.length).toBe(1);
    expect(result2[0].is_closed).toBeTruthy();
  });

  test('findEntryById', async () => {
    const entry = createEntryModel();
    const id = await ce(base.db, entry);

    const result = await findEntryById(base.db, id);

    expect(result).not.toBeNull();
    expect(result?.title).toBe(entry.title);
  });

  test('findEntryByUserId', async () => {
    const userId = randomInt(100000);

    const entry1 = createEntryModel({owner_user_id: userId});
    const entry2 = createEntryModel({owner_user_id: userId});

    await ce(base.db, entry1);
    await ce(base.db, entry2);

    const results = await findEntryByUserId(base.db, userId);

    expect(results.length).toBe(2);
  });

  test('findEntryByShopId', async () => {
    const shopId = randomInt(100000);

    const entry1 = createEntryModel({shop_id: shopId});
    const entry2 = createEntryModel({shop_id: shopId});

    await ce(base.db, entry1);
    await ce(base.db, entry2);

    const results = await findEntryByShopId(base.db, shopId);

    expect(results.length).toBe(2);
  });

  test('findAllEntries', async () => {
    const ids: number[] = [];
    for (let i = 0; 10 > i; i++) {
      const entry = createEntryModel();
      ids.push(await ce(base.db, entry));
    }

    const entries = await findAllEntries(base.db, 10, 0);

    expect(entries.length).toBe(10);

    // 直近追加したエントリのid10件がすべてある = 最新のものを取得できている
    expect(entries.every(v => ids.includes(v.id))).toBeTruthy();
  });

  test('findEntriesByIds', async () => {
    const ids: number[] = [];
    for (let i = 0; 10 > i; i++) {
      const entry = createEntryModel();
      ids.push(await ce(base.db, entry));
    }

    const entries = await findEntriesByIds(base.db, ids);

    expect(entries.every(v => ids.includes(v.id))).toBeTruthy();
  });

  test('updateRequestPeople', async () => {
    const entry = createEntryModel();
    const id = await ce(base.db, entry);

    await updateRequestPeople(base.db, id, 20);

    let result = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM entry WHERE id = ?',
      [id]
    );
    expect(result[0].request_people).toBe(20);

    await updateRequestPeople(base.db, id, -15);

    result = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM entry WHERE id = ?',
      [id]
    );
    expect(result[0].request_people).toBe(5);

    expect(updateRequestPeople(base.db, randomInt(1000), 20)).rejects.toThrow();
  });

  test('deleteEntryByUserId', async () => {
    const entry = createEntryModel();
    const id = await ce(base.db, entry);

    const result = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM entry WHERE id = ?',
      id
    );

    expect(result.length).toBe(1);

    await deleteEntryByUserId(base.db, entry.owner_user_id);

    const result2 = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM entry WHERE id = ?',
      id
    );

    expect(result2.length).toBe(0);
  });
});
