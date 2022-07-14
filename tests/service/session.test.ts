import {randomInt} from 'crypto';
import {RowDataPacket} from 'mysql2/promise';
import {
  createSession,
  findSessionBySessionToken,
  deleteSessionBySessionToken,
  createSessionSpecifyToken,
  findSessionByRefreshToken,
  createRefreshSpecifyToken,
  findRefreshByRefreshToken,
  findSessionTokenByRefreshToken,
  deleteRefreshByRefreshToken,
  deleteRefreshBySessionToken,
} from '../../src/services/session';
import TestBase from '../../src/tests/base';
import {createSessionModel} from '../../src/tests/models';
import {randomText} from '../../src/utils/random';

describe('session', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('createSession', async () => {
    const session = await createSession(base.db, randomInt(10000));

    const row = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM session WHERE session_token = ?',
      session.session_token
    );

    expect(row.length).toBe(1);
  });

  test('findSessionBySessionToken', async () => {
    const s = createSessionModel();

    await base.db.test(
      `INSERT INTO session(
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [s.session_token, '7', s.user_id]
    );

    const session = await findSessionBySessionToken(base.db, s.session_token);

    expect(session?.user_id).toBe(s.user_id);
  });

  test('findRefreshByRefreshToken', async () => {
    const s = createSessionModel();
    const r = randomText(64);

    await base.db.test(
      `INSERT INTO refresh(
      refresh_token,
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [r, s.session_token, '7', s.user_id]
    );

    const session = await findRefreshByRefreshToken(base.db, r);

    expect(session?.user_id).toBe(s.user_id);
  });

  test('findSessionByRefreshToken', async () => {
    const s = createSessionModel();
    const r = randomText(64);

    await base.db.test(
      `INSERT INTO session(
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [s.session_token, '7', s.user_id]
    );

    await base.db.test(
      `INSERT INTO refresh(
      refresh_token,
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [r, s.session_token, '7', s.user_id]
    );

    const session = await findSessionByRefreshToken(base.db, r);

    expect(session?.user_id).toBe(s.user_id);
  });

  test('findSessionTokenByRefreshToken', async () => {
    const s = createSessionModel();
    const r = randomText(64);

    await base.db.test(
      `INSERT INTO refresh(
      refresh_token,
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [r, s.session_token, '7', s.user_id]
    );

    const sessionToken = await findSessionTokenByRefreshToken(base.db, r);

    expect(sessionToken).toBe(s.session_token);
  });

  test('sessionを作成できる', async () => {
    const token = randomText(64);
    const periodDay = 1;
    const userId = randomInt(10000);

    await createSessionSpecifyToken(base.db, token, periodDay, userId);

    const session = await findSessionBySessionToken(base.db, token);

    expect(session).not.toBeNull();
    if (session) {
      expect(session.user_id).toBe(userId);

      const now = new Date(Date.now());

      // 時間をみる: hourのみ
      expect(session.date.getHours()).toBe(now.getHours());
      // period dateは+1日なので時間は同じはず
      expect(session.period_date.getHours()).toBe(now.getHours());

      // 1日進める
      now.setDate(now.getDate() + 1);
      expect(session.period_date.getDate()).toBe(now.getDate());
    }
  });

  test('refreshを作成できる', async () => {
    const token = randomText(64);
    const sessionToken = randomText(64);
    const periodDay = 1;
    const userId = randomInt(10000);

    await createRefreshSpecifyToken(
      base.db,
      token,
      sessionToken,
      periodDay,
      userId
    );

    const session = await findRefreshByRefreshToken(base.db, token);

    expect(session).not.toBeNull();
    if (session) {
      expect(session.user_id).toBe(userId);

      const now = new Date(Date.now());

      // 時間をみる: hourのみ
      expect(session.date.getHours()).toBe(now.getHours());
      // period dateは+1日なので時間は同じはず
      expect(session.period_date.getHours()).toBe(now.getHours());

      // 1日進める
      now.setDate(now.getDate() + 1);
      expect(session.period_date.getDate()).toBe(now.getDate());
    }
  });

  test('session tokenでSessionを削除できる', async () => {
    const s = createSessionModel();

    await base.db.test(
      `INSERT INTO session(
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [s.session_token, '7', s.user_id]
    );

    await deleteSessionBySessionToken(base.db, s.session_token);

    const dbSession = await findSessionBySessionToken(base.db, s.session_token);

    expect(dbSession).toBeNull();
  });

  test('refresh tokenでRefreshを削除できる', async () => {
    const s = createSessionModel();
    const r = randomText(64);

    await base.db.test(
      `INSERT INTO refresh(
      refresh_token,
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [r, s.session_token, '7', s.user_id]
    );

    await deleteRefreshByRefreshToken(base.db, r);

    const dbSession = await findRefreshByRefreshToken(base.db, r);

    expect(dbSession).toBeNull();
  });

  test('session tokenでRefreshを削除', async () => {
    const s = createSessionModel();
    const r = randomText(64);

    await base.db.test(
      `INSERT INTO refresh(
      refresh_token,
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [r, s.session_token, '7', s.user_id]
    );

    await deleteRefreshBySessionToken(base.db, s.session_token);

    const dbSession = await findRefreshByRefreshToken(base.db, r);

    expect(dbSession).toBeNull();
  });
});
