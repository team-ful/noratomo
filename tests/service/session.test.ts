import {randomBytes, randomInt} from 'crypto';
import mysql from 'mysql2/promise';
import config from '../../config';
import {
  createSession,
  findSessionBySessionToken,
  deleteSessionBySessionToken,
  createSessionSpecifyToken,
} from '../../src/services/session';

describe('session', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('作成、取得', async () => {
    const session = await createSession(db, randomInt(10000));

    const dbSession = await findSessionBySessionToken(
      db,
      session.session_token
    );

    expect(dbSession?.user_id).toBe(session.user_id);
  });

  test('作成できる', async () => {
    const token = randomBytes(128).toString('hex');
    const periodDay = 1;
    const userId = randomInt(10000);

    const session = await createSessionSpecifyToken(
      db,
      token,
      periodDay,
      userId
    );

    expect(session.user_id).toBe(userId);

    const now = new Date(Date.now());

    // 時間をみる: hourのみ
    expect(session.date.getHours()).toBe(now.getHours());
    // period dateは+1日なので時間は同じはず
    expect(session.period_date.getHours()).toBe(now.getHours());

    // 1日進める
    now.setDate(now.getDate() + 1);
    expect(session.period_date.getDate()).toBe(now.getDate());
  });

  test('削除できる', async () => {
    const session = await createSession(db, randomInt(10000));

    const sessionToken = session.session_token;

    await deleteSessionBySessionToken(db, sessionToken);

    const dbSession = await findSessionBySessionToken(
      db,
      session.session_token
    );

    expect(dbSession).toBeNull();
  });
});
