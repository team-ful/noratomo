import sql from 'mysql-bricks';
import {Connection, ResultSetHeader, RowDataPacket} from 'mysql2/promise';
import {Device} from '../base/base';
import LoginHistory from '../models/loginHistory';

/**
 * ユーザー名からログイン履歴を取得する
 *
 * @param {Connection} db - database
 * @param {number} userID - user id
 */
export async function findLoginHistoriesByUserID(
  db: Connection,
  userID: number
): Promise<LoginHistory[] | null> {
  const query = sql
    .select([
      'id',
      'user_id',
      // IPアドレスは`INET6_ATON`使っている
      sql('INET6_NTOA(ip_address)'),
      'device_name',
      'os',
      'is_phone',
      'is_tablet',
      'is_desktop',
      'blowser_name',
      'login_date',
    ])
    .from('login_history')
    .where('user_id', userID)
    .toParams({placeholder: '?'});

  const [rows] = await db.query<RowDataPacket[]>(query.text, query.values);

  if (rows.length === 0) {
    return null;
  }

  return rows.map(v => new LoginHistory(v));
}

/**
 * ログイン履歴を追加する
 *
 * @param {Connection} db - database
 * @param {number} userID - ユーザーID
 * @param {string} ip - IP アドレス
 * @param {Device} deviceName - デバイス名
 * @param {string} os - OS名
 * @param {boolean} isPhone - モバイル端末か
 * @param {boolean} isTablet - タブレットか
 * @param {boolean} isDesktop - デスクトップか
 * @param {string} browserName - ブラウザ名
 * @returns {number} - ログイン履歴のID
 */
export async function createLoginHistory(
  db: Connection,
  userID: number,
  ip: string,
  deviceName: Device,
  os: string,
  isPhone: boolean,
  isTablet: boolean,
  isDesktop: boolean,
  browserName: string
): Promise<number> {
  const query = sql
    .insert('login_history', {
      user_id: userID,
      ip_address: sql('INET6_ATON(?)', ip),
      device_name: deviceName,
      os: os,
      is_phone: isPhone,
      is_tablet: isTablet,
      is_desktop: isDesktop,
      blowser_name: browserName,
      login_date: sql('NOW()'),
    })
    .toParams({placeholder: '?'});

  const [rows] = await db.query<ResultSetHeader>(query.text, query.values);

  return rows.insertId;
}

/**
 * 指定したユーザIDのログイン履歴をすべて削除する
 *
 * @param {Connection} db - database
 * @param {number} userID - ユーザID
 */
export async function deleteLoginHistoryByUserID(
  db: Connection,
  userID: number
) {
  const query = sql
    .delete('login_history')
    .where('user_id', userID)
    .toParams({placeholder: '?'});

  await db.query(query.text, query.values);
}
