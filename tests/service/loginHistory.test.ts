import sql from 'mysql-bricks';
import {RowDataPacket} from 'mysql2/promise';
import {Device} from '../../src/base/base';
import {
  createLoginHistory,
  deleteLoginHistoryByUserID,
  findLoginHistoriesByUserID,
} from '../../src/services/loginHistory';
import TestBase from '../../src/tests/base';
import {createLoginHistoryModel, createUserID} from '../../src/tests/models';

describe('createLoginHistory', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('作成できる', async () => {
    const d = createLoginHistoryModel();

    const id = await createLoginHistory(
      base.db,
      d.user_id,
      d.ip_address,
      d.device_name || Device.Desktop,
      d.os || '',
      d.is_phone || false,
      d.is_tablet || false,
      d.is_desktop || false,
      d.browser_name || ''
    );

    const rows = await base.db.test<RowDataPacket[]>(
      'SELECT COUNT(*) FROM login_history WHERE id = ?',
      id
    );

    expect(rows[0]['COUNT(*)']).toBe(1);
  });

  test('IPアドレスが正しく保存されている', async () => {
    const d = createLoginHistoryModel();

    const id = await createLoginHistory(
      base.db,
      d.user_id,
      d.ip_address,
      d.device_name || Device.Desktop,
      d.os || '',
      d.is_phone || false,
      d.is_tablet || false,
      d.is_desktop || false,
      d.browser_name || ''
    );

    const rows = await base.db.test<RowDataPacket[]>(
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
      base.db,
      d.user_id,
      d.ip_address,
      d.device_name || Device.Desktop,
      d.os || '',
      d.is_phone || false,
      d.is_tablet || false,
      d.is_desktop || false,
      d.browser_name || ''
    );

    const rows = await base.db.test<RowDataPacket[]>(
      'SELECT INET6_NTOA(ip_address) FROM login_history WHERE id = ?',
      id
    );

    expect(rows[0]['INET6_NTOA(ip_address)']).toBe(d.ip_address);
  });
});

describe('findLoginHistoriesByUserID', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('取得できる', async () => {
    const userID = createUserID();
    const d = createLoginHistoryModel({user_id: userID});
    const values = [];
    for (let i = 0; 50 > i; i++) {
      values.push([
        d.user_id,
        sql('INET_ATON(?)', d.ip_address),
        d.device_name,
        d.os,
        sql('DATE_ADD(NOW(), INTERVAL ? HOUR)', i),
      ]);
    }
    const query = sql
      .insertInto(
        'login_history',
        'user_id',
        'ip_address',
        'device_name',
        'os',
        'login_date'
      )
      .values(values)
      .toParams({placeholder: '?'});
    await base.db.execute(query);

    //取り出す履歴の個数を指定した時 0以上
    const limit2History = await findLoginHistoriesByUserID(base.db, userID, 2);
    expect(limit2History).not.toBeNull();
    expect(limit2History?.length).toBe(2);

    //0を指定した時
    const noneHistory = await findLoginHistoriesByUserID(base.db, userID, 0);
    expect(noneHistory).not.toBeNull();
    expect(noneHistory?.length).toBe(0);

    //指定しない時
    const historyUnspecifiedLimit = await findLoginHistoriesByUserID(
      base.db,
      userID
    );
    expect(historyUnspecifiedLimit).not.toBeNull();
    expect(historyUnspecifiedLimit?.length).toBe(50);
    if (historyUnspecifiedLimit) {
      expect(
        historyUnspecifiedLimit[0].login_date >
          historyUnspecifiedLimit[1].login_date
      ).toBeTruthy();
      expect(
        historyUnspecifiedLimit[0].login_date >
          historyUnspecifiedLimit[49].login_date
      ).toBeTruthy();
    }
    if (historyUnspecifiedLimit && limit2History) {
      expect(historyUnspecifiedLimit[0].login_date).toEqual(
        limit2History[0].login_date
      );
    } else {
      throw new Error('db error');
    }
  });
});

describe('deleteLoginHistoryByUserID', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('削除できる', async () => {
    const userID = createUserID();

    // ログイン履歴を3つ作成する
    for (let i = 0; 3 > i; i++) {
      const d = createLoginHistoryModel({user_id: userID});

      await base.db.test(
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

    let rows = await base.db.test<RowDataPacket[]>(
      'SELECT COUNT(*) FROM login_history WHERE user_id = ?',
      userID
    );

    expect(rows[0]['COUNT(*)']).toBe(3);

    await deleteLoginHistoryByUserID(base.db, userID);

    rows = await base.db.test<RowDataPacket[]>(
      'SELECT COUNT(*) FROM login_history WHERE user_id = ?',
      userID
    );

    expect(rows[0]['COUNT(*)']).toBe(0);
  });
});
