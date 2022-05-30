import type {Connection, RowDataPacket} from 'mysql2/promise';
import {ApiError} from 'next/dist/server/api-utils';
import Cert, {CertModel} from '../models/cret';

/**
 * Certを作成する
 *
 * @param {Connection} db - database
 * @param {CertModel} cert - cert
 */
export async function setCert(db: Connection, cert: CertModel) {
  if (cert.password) {
    await db.query(
      `
    INSERT INTO cert (
      user_id,
      password
    ) VALUES (?, ?)`,
      [cert.user_id, cert.password]
    );
  } else if (cert.cateiru_sso_id) {
    await db.query(
      `
    INSERT INTO cert (
      user_id,
      cateiru_sso_id
    ) VALUES (?, ?)`,
      [cert.user_id, cert.cateiru_sso_id]
    );
  } else {
    await db.query(
      `
    INSERT INTO cert (
      user_id,
      password,
      cateiru_sso_id
    ) VALUES (?, ?, ?)`,
      [cert.user_id, cert.password, cert.cateiru_sso_id]
    );
  }
}

/**
 * UserIDからCertを取得する
 *
 * @param {Connection} db - database
 * @param {number} userId - User ID
 * @returns {Cert} - cert object.
 */
export async function findCertByUserID(
  db: Connection,
  userId: number
): Promise<Cert> {
  const [row] = await db.query<RowDataPacket[]>(
    "SELECT * FROM cert WHERE user_id = '?'",
    [userId]
  );

  if (row.length === 0) {
    throw new ApiError(400, 'no cert');
  }

  return new Cert(row[0] as CertModel);
}
