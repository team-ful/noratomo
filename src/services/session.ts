import sql, {select, gte, insert, delete as sqlDelete} from 'mysql-bricks';
import {Connection, RowDataPacket} from 'mysql2/promise';
import {ApiError} from 'next/dist/server/api-utils';
import config from '../../config';
import {Session, SessionModel} from '../models/session';
import {randomText} from '../utils/random';

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
    .limit(1)
    .toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

  if (row.length === 0) {
    return null;
  }

  return new Session(row[0] as SessionModel);
}

/**
 * Refresh tokenからSessionを取得する
 *
 * @param {Connection} db - database
 * @param {string} token - refresh token
 */
export async function findSessionByRefreshToken(
  db: Connection,
  token: string
): Promise<Session | null> {
  const query = select('*')
    .from('session')
    .where(
      sql.eq(
        'session_token',
        select('session_token')
          .from('refresh')
          .where({refresh_token: token})
          .and(gte('period_date', sql('now()')))
          .limit(1)
      )
    )
    .and(gte('period_date', sql('now()')))
    .limit(1)
    .toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

  if (row.length === 0) {
    return null;
  }

  return new Session(row[0] as SessionModel);
}

/**
 * refresh Tokenからrefreshを取得する
 *
 * @param {Connection} db - database
 * @param {string} token - session token
 */
export async function findRefreshByRefreshToken(db: Connection, token: string) {
  const query = select('*')
    .from('refresh')
    .where({refresh_token: token})
    .and(gte('period_date', sql('now()')))
    .limit(1)
    .toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

  if (row.length === 0) {
    return null;
  }

  return new Session(row[0] as SessionModel);
}

/**
 * refresh tokenからsession tokenを取得する
 *
 * @param {Connection} db - database
 * @param {string} refreshToken - refresh token
 */
export async function findSessionTokenByRefreshToken(
  db: Connection,
  refreshToken: string
): Promise<string | null> {
  const query = select('session_token')
    .from('refresh')
    .where({refresh_token: refreshToken})
    .and(gte('period_date', sql('now()')))
    .limit(1)
    .toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

  if (row.length === 0) {
    return null;
  }

  return row[0].session_token;
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
  const sessionToken = randomText(64);
  const refreshToken = randomText(64);

  // session tokenを追加する
  await createSessionSpecifyToken(
    db,
    sessionToken,
    config.sessionPeriodDay,
    userId
  );

  // refresh tokenを追加する
  await createRefreshSpecifyToken(
    db,
    refreshToken,
    sessionToken,
    config.refreshPeriodDay,
    userId
  );

  // refresh token経由でsessionを取得する
  const session = await findSessionByRefreshToken(db, refreshToken);

  if (!session) {
    throw new ApiError(500, 'no insert session');
  }

  session.refresh_token = refreshToken;

  return session;
}

/**
 * refreshTokenを使用してユーザ情報を取得します。
 * sessionTokenの有効期限が切れている前提であり、トークンを更新します。
 *
 * @param {Connection} db - database
 * @param {string} refreshToken - refresh token
 * @param {number} userId - user id
 */
export async function updateSessionTokenByRefreshToken(
  db: Connection,
  refreshToken: string,
  userId: number
) {
  const newSessionToken = randomText(64);

  // session tokenを追加する
  await createSessionSpecifyToken(
    db,
    newSessionToken,
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
}

/**
 * refresh_tokenを指定して新しいレコードを作成する
 *
 * @param {Connection} db - database
 * @param {string} refreshToken - リフレッシュトークン
 * @param {string} sessionToken - session token
 * @param {number} periodDay - 有効期限（日）
 * @param {number} userId - user id
 */
export async function createRefreshSpecifyToken(
  db: Connection,
  refreshToken: string,
  sessionToken: string,
  periodDay: number,
  userId: number
) {
  const query = insert('refresh', {
    refresh_token: refreshToken,
    session_token: sessionToken,
    date: sql('NOW()'),
    period_date: sql('DATE_ADD(NOW(), INTERVAL ? DAY)', periodDay),
    user_id: userId,
  }).toParams({placeholder: '?'});

  await db.query(query.text, query.values);
}

/**
 * session tokenからSessionを削除
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

/**
 * refresh tokenからRefreshを削除
 *
 * @param {Connection} db - database
 * @param {string} refreshToken - refresh token
 */
export async function deleteRefreshByRefreshToken(
  db: Connection,
  refreshToken: string
) {
  const query = sqlDelete('refresh')
    .where({refresh_token: refreshToken})
    .toParams({placeholder: '?'});
  await db.query<RowDataPacket[]>(query.text, query.values);
}

/**
 * session tokenからRefreshを削除
 *
 * @param {Connection} db - database
 * @param {string} sessionToken - session token
 */
export async function deleteRefreshBySessionToken(
  db: Connection,
  sessionToken: string
) {
  const query = sqlDelete('refresh')
    .where({session_token: sessionToken})
    .toParams({placeholder: '?'});
  await db.query<RowDataPacket[]>(query.text, query.values);
}
