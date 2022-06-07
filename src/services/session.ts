import {randomBytes} from 'crypto';
import {Connection, RowDataPacket} from 'mysql2/promise';
import {ApiError} from 'next/dist/server/api-utils';
import sql, {select, gte, insert, delete as sqlDelete} from 'sql-bricks';
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
  const query = select('*')
    .from('session')
    .where({session_token: token})
    .and(gte('period_date', sql('now()')))
    .toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

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
  const query = insert('session', {
    session_token: sessionToken,
    date: sql('NOW()'),
    period_date: sql('DATE_ADD(NOW(), INTERVAL ? DAY)', periodDay),
    user_id: userId,
  }).toParams({placeholder: '?'});

  await db.query(query.text, query.values);

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
  const query = sqlDelete('session')
    .where({session_token: sessionToken})
    .toParams({placeholder: '?'});
  await db.query<RowDataPacket[]>(query.text, query.values);
}
