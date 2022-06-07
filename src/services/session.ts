import {randomBytes} from 'crypto';
import {Connection, RowDataPacket} from 'mysql2/promise';
import {ApiError} from 'next/dist/server/api-utils';
import config from '../../config';
import {Session, SessionModel} from '../models/session';

/**
 * Session TokenからSessionを取得する
 *
 * @param {Connection} db - database
 * @param {string} token - session token
 */
export async function findSessionBySessionToken(
  db: Connection,
  token: string
): Promise<Session | null> {
  const [row] = await db.query<RowDataPacket[]>(
    `
  SELECT * FROM session
    WHERE
      session_token = ? AND
      period_date >= NOW()
  `,
    [token]
  );

  if (row.length === 0) {
    return null;
  }

  return new Session(row[0] as SessionModel);
}

/**
 * user idを指定してセッション情報を保存する
 * 有効期限は1週間
 *
 * @param {Connection} db - database
 * @param {number} userId - user id
 */
export async function createSession(
  db: Connection,
  userId: number
): Promise<Session> {
  const sessionToken = randomBytes(128).toString('hex');

  return createSessionSpecifyToken(
    db,
    sessionToken,
    config.sessionPeriodDay,
    userId
  );
}

/**
 * session tokenを指定して新しいレコードを作成する
 *
 * @param {Connection} db - database
 * @param {string} sessionToken - session token
 * @param {number} periodDay - 有効期限（日）
 * @param {number} userId - user id
 */
export async function createSessionSpecifyToken(
  db: Connection,
  sessionToken: string,
  periodDay: number,
  userId: number
) {
  await db.query(
    `
  INSERT INTO session (
    session_token,
    date,
    period_date,
    user_id
  ) VALUES (
    ?,
    NOW(),
    DATE_ADD(NOW(), INTERVAL ? DAY),
    ?
  )
  `,
    [sessionToken, periodDay, userId]
  );

  const session = await findSessionBySessionToken(db, sessionToken);

  if (!session) {
    throw new ApiError(500, 'no insert session');
  }

  return session;
}

/**
 *
 * @param {Connection} db - database
 * @param {string} sessionToken - session token
 */
export async function deleteSessionBySessionToken(
  db: Connection,
  sessionToken: string
) {
  await db.query<RowDataPacket[]>(
    `
  DELETE from session
  WHERE
    session_token = ?
  `,
    [sessionToken]
  );
}
