import {RowDataPacket} from 'mysql2';
import {
  findNumberOfByUserId,
  insertNumberOf,
  updateNumberOf,
} from '../../src/services/numberOf';
import TestBase from '../../src/tests/base';
import {createUserID} from '../../src/tests/models';

describe('numberOf', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('insertNumberOf', async () => {
    const userId = createUserID();

    // 新規作成
    await insertNumberOf(base.db, userId, 0, 1);

    let row = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM number_of WHERE user_id = ?',
      [userId]
    );
    expect(row.length).toBe(1);
    expect(row[0]['evaluations']).toBe(0);

    await insertNumberOf(base.db, userId, 10, 20, 30);
    row = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM number_of WHERE user_id = ?',
      [userId]
    );
    expect(row.length).toBe(1);
    expect(row[0]['evaluations']).toBe(10);
    expect(row[0]['entry']).toBe(21);
    expect(row[0]['meet']).toBe(30);
    expect(row[0]['application']).toBe(0);
  });

  test('findNumberOfByUserId', async () => {
    const userId = createUserID();

    await base.db.test(
      'INSERT INTO number_of (user_id, evaluations, entry) VALUES (?, ?, ?)',
      [userId, 10, 0]
    );

    const numberOf = await findNumberOfByUserId(base.db, userId);
    expect(numberOf).not.toBeNull();
    expect(numberOf?.evaluations).toBe(10);
    expect(numberOf?.entry).toBe(0);
    expect(numberOf?.meet).toBe(0);
  });

  test('updateNumberOf', async () => {
    const userId = createUserID();

    await base.db.test(
      'INSERT INTO number_of (user_id, evaluations, entry) VALUES (?, ?, ?)',
      [userId, 10, 0]
    );

    await updateNumberOf(base.db, userId, -5, 2);

    const row = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM number_of WHERE user_id = ?',
      [userId]
    );
    expect(row.length).toBe(1);
    expect(row[0]['evaluations']).toBe(5);
    expect(row[0]['entry']).toBe(2);
    expect(row[0]['meet']).toBe(0);
  });
});
