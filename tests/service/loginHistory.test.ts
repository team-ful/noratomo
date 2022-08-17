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

    // ログイン履歴を50作成する
    for (let i = 0; 50 > i; i++) {
      const d = createLoginHistoryModel({user_id: userID});
      await base.db.test(
        `INSERT INTO login_history (
        user_id,
        ip_address,
        device_name,
        os,
        login_date
      ) VALUES (?, INET_ATON(?), ?, ?, DATE_ADD(now(), INTERVAL ${i} HOUR))`,
        [d.user_id, d.ip_address, d.device_name, d.os]
      );
    }

    //取り出す履歴の個数を指定した時
    const re_history = await findLoginHistoriesByUserID(base.db, userID, 2);
    expect(re_history).not.toBeNull();
    expect(re_history?.length).toBe(2);

    //指定しない時
    const history2 = await findLoginHistoriesByUserID(base.db, userID);
    expect(history2).not.toBeNull();
    expect(history2?.length).toBe(50);
    if (history2) {
      expect(history2[0].login_date > history2[1].login_date).toBeTruthy();
      expect(history2[0].login_date > history2[49].login_date).toBeTruthy();
    }
    if (history2 && re_history) {
      expect(history2[0].login_date).toEqual(re_history[0].login_date);
    }

    //もう１０件ログインをバラバラに追加して、最新のログインから取得できているか調べる。
    for (let i = 0; 10 > i; i++) {
      const d = createLoginHistoryModel({user_id: userID});
      if (i % 2 === 0) {
        await base.db.test(
          `INSERT INTO login_history (
        user_id,
        ip_address,
        device_name,
        os,
        login_date
      ) VALUES (?, INET_ATON(?), ?, ?, DATE_ADD(now(), INTERVAL ${i} HOUR))`,
          [d.user_id, d.ip_address, d.device_name, d.os]
        );
      } else {
        await base.db.test(
          `INSERT INTO login_history (
          user_id,
          ip_address,
          device_name,
          os,
          login_date
        ) VALUES (?, INET_ATON(?), ?, ?, DATE_ADD(now(), INTERVAL ${-i} HOUR))`,
          [d.user_id, d.ip_address, d.device_name, d.os]
        );
      }
    }
    // 指定するとき
    const over50_history = await findLoginHistoriesByUserID(base.db, userID, 2);
    expect(over50_history).not.toBeNull();
    expect(over50_history?.length).toBe(2);

    //指定しない時
    const over50history2 = await findLoginHistoriesByUserID(base.db, userID);
    expect(over50history2).not.toBeNull();
    expect(over50history2?.length).toBe(50);
    if (over50history2) {
      expect(
        over50history2[0].login_date > over50history2[1].login_date
      ).toBeTruthy();

      expect(
        over50history2[1].login_date > over50history2[2].login_date
      ).toBeTruthy();

      expect(
        over50history2[0].login_date > over50history2[49].login_date
      ).toBeTruthy();
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
