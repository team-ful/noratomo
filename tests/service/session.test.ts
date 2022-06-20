import {randomInt} from 'crypto';
import mysql, {RowDataPacket} from 'mysql2/promise';
import config from '../../config';
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
import {createSessionModel} from '../../src/tests/models';
import {randomText} from '../../src/utils/random';

describe('session', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('createSession', async () => {
    const session = await createSession(db, randomInt(10000));

    const [row] = await db.query<RowDataPacket[]>(
      'SELECT * FROM session WHERE session_token = ?',
      session.session_token
    );

    expect(row.length).toBe(1);
  });

  test('findSessionBySessionToken', async () => {
    const s = createSessionModel();

    await db.query(
      `INSERT INTO session(
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [s.session_token, '7', s.user_id]
    );

    const session = await findSessionBySessionToken(db, s.session_token);

    expect(session?.user_id).toBe(s.user_id);
  });

  test('findRefreshByRefreshToken', async () => {
    const s = createSessionModel();
    const r = randomText(64);

    await db.query(
      `INSERT INTO refresh(
      refresh_token,
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [r, s.session_token, '7', s.user_id]
    );

    const session = await findRefreshByRefreshToken(db, r);

    expect(session?.user_id).toBe(s.user_id);
  });

  test('findSessionByRefreshToken', async () => {
    const s = createSessionModel();
    const r = randomText(64);

    await db.query(
      `INSERT INTO session(
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [s.session_token, '7', s.user_id]
    );

    await db.query(
      `INSERT INTO refresh(
      refresh_token,
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [r, s.session_token, '7', s.user_id]
    );

    const session = await findSessionByRefreshToken(db, r);

    expect(session?.user_id).toBe(s.user_id);
  });

  test('findSessionTokenByRefreshToken', async () => {
    const s = createSessionModel();
    const r = randomText(64);

    await db.query(
      `INSERT INTO refresh(
      refresh_token,
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [r, s.session_token, '7', s.user_id]
    );

    const sessionToken = await findSessionTokenByRefreshToken(db, r);

    expect(sessionToken).toBe(s.session_token);
  });

  test('sessionを作成できる', async () => {
    const token = randomText(64);
    const periodDay = 1;
    const userId = randomInt(10000);

    await createSessionSpecifyToken(db, token, periodDay, userId);

    const session = await findSessionBySessionToken(db, token);

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

    await createRefreshSpecifyToken(db, token, sessionToken, periodDay, userId);

    const session = await findRefreshByRefreshToken(db, token);

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

    await db.query(
      `INSERT INTO session(
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [s.session_token, '7', s.user_id]
    );

    await deleteSessionBySessionToken(db, s.session_token);

    const dbSession = await findSessionBySessionToken(db, s.session_token);

    expect(dbSession).toBeNull();
  });

  test('refresh tokenでRefreshを削除できる', async () => {
    const s = createSessionModel();
    const r = randomText(64);

    await db.query(
      `INSERT INTO refresh(
      refresh_token,
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [r, s.session_token, '7', s.user_id]
    );

    await deleteRefreshByRefreshToken(db, r);

    const dbSession = await findRefreshByRefreshToken(db, r);

    expect(dbSession).toBeNull();
  });

  test('session tokenでRefreshを削除', async () => {
    const s = createSessionModel();
    const r = randomText(64);

    await db.query(
      `INSERT INTO refresh(
      refresh_token,
      session_token,
      date,
      period_date,
      user_id
    ) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
      [r, s.session_token, '7', s.user_id]
    );

    await deleteRefreshBySessionToken(db, s.session_token);

    const dbSession = await findRefreshByRefreshToken(db, r);

    expect(dbSession).toBeNull();
  });
});
