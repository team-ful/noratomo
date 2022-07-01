import sql, {select, insert} from 'mysql-bricks';
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
  const insertElement: {[key: string]: string | number} = {
    user_id: cert.user_id,
  };
  if (cert.password) {
    insertElement['password'] = cert.password;
  }
  if (cert.cateiru_sso_id) {
    insertElement['cateiru_sso_id'] = cert.cateiru_sso_id;
  }

  const query = insert('cert', insertElement).toParams({placeholder: '?'});

  await db.query(query.text, query.values);
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
  const query = select('*')
    .from('cert')
    .where({user_id: userId})
    .limit(1)
    .toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

  if (row.length === 0) {
    throw new ApiError(400, 'no cert');
  }

  return new Cert(row[0] as CertModel);
}

/**
 * Certを削除する
 *
 * @param {Connection} db - database
 * @param {number} userId - User ID
 */
export async function deleteCertById(db: Connection, userId: number) {
  const query = sql
    .delete('cert')
    .where('user_id', userId)
    .toParams({placeholder: '?'});

  await db.query(query.text, query.values);
}
