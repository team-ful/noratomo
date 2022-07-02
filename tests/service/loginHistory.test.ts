import mysql, {RowDataPacket} from 'mysql2/promise';
import config from '../../config';
import {Device} from '../../src/base/base';
import {
  createLoginHistory,
  deleteLoginHistoryByUserID,
  findLoginHistoriesByUserID,
} from '../../src/services/loginHistory';
import {createLoginHistoryModel, createUserID} from '../../src/tests/models';

describe('createLoginHistory', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('作成できる', async () => {
    const d = createLoginHistoryModel();

    const id = await createLoginHistory(
      db,
      d.user_id,
      d.ip_address,
      d.device_name || Device.Desktop,
      d.os || '',
      d.is_phone || false,
      d.is_tablet || false,
      d.is_desktop || false,
      d.blowser_name || ''
    );

    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) FROM login_history WHERE id = ?',
      id
    );

    expect(rows[0]['COUNT(*)']).toBe(1);
  });

  test('IPアドレスが正しく保存されている', async () => {
    const d = createLoginHistoryModel();

    const id = await createLoginHistory(
      db,
      d.user_id,
      d.ip_address,
      d.device_name || Device.Desktop,
      d.os || '',
      d.is_phone || false,
      d.is_tablet || false,
      d.is_desktop || false,
      d.blowser_name || ''
    );

    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT INET6_NTOA(ip_address) FROM login_history WHERE id = ?',
      id
    );

    expect(rows[0]['INET6_NTOA(ip_address)']).toBe(d.ip_address);
  });

  test('IPv6のIPアドレスが正しく保存されている', async () => {
    const d = createLoginHistoryModel({
      ip_address: '2001:db8:ffff:ffff:ffff:ffff:ffff:ffff',
    });

    const id = await createLoginHistory(
      db,
      d.user_id,
      d.ip_address,
      d.device_name || Device.Desktop,
      d.os || '',
      d.is_phone || false,
      d.is_tablet || false,
      d.is_desktop || false,
      d.blowser_name || ''
    );

    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT INET6_NTOA(ip_address) FROM login_history WHERE id = ?',
      id
    );

    expect(rows[0]['INET6_NTOA(ip_address)']).toBe(d.ip_address);
  });
});

describe('findLoginHistoriesByUserID', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('取得できる', async () => {
    const d = createLoginHistoryModel();

    await db.query(
      `INSERT INTO login_history (
      user_id,
      ip_address,
      device_name,
      os,
      login_date
    ) VALUES (?, INET_ATON(?), ?, ?, NOW())`,
      [d.user_id, d.ip_address, d.device_name, d.os]
    );

    const history = await findLoginHistoriesByUserID(db, d.user_id);

    expect(history).not.toBeNull();
    expect(history?.length).toBe(1);

    if (history) {
      expect(history[0].os).toBe(d.os);
      expect(history[0].ip_address).toBe(d.ip_address);
    }
  });
});

describe('deleteLoginHistoryByUserID', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('削除できる', async () => {
    const userID = createUserID();

    // ログイン履歴を3つ作成する
    for (let i = 0; 3 > i; i++) {
      const d = createLoginHistoryModel({user_id: userID});

      await db.query(
        `INSERT INTO login_history (
        user_id,
        ip_address,
        device_name,
        os,
        login_date
      ) VALUES (?, INET_ATON(?), ?, ?, NOW())`,
        [d.user_id, d.ip_address, d.device_name, d.os]
      );
    }

    let [rows] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) FROM login_history WHERE user_id = ?',
      userID
    );

    expect(rows[0]['COUNT(*)']).toBe(3);

    await deleteLoginHistoryByUserID(db, userID);

    [rows] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) FROM login_history WHERE user_id = ?',
      userID
    );

    expect(rows[0]['COUNT(*)']).toBe(0);
  });
});
