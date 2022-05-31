import {randomInt} from 'crypto';
import mysql from 'mysql2/promise';
import config from '../../config';
import {
  createSession,
  findSessionBySessionToken,
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
});
