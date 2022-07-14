import sql, {select, insert} from 'mysql-bricks';
import {ApiError} from 'next/dist/server/api-utils';
import DBOperator from '../db/operator';
import Cert, {CertModel} from '../models/cret';

/**
 * Certを作成する
 *
 * @param {DBOperator} db - database
 * @param {CertModel} cert - cert
 */
export async function setCert(db: DBOperator, cert: CertModel) {
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

  await db.execute(query);
}

/**
 * UserIDからCertを取得する
 *
 * @param {DBOperator} db - database
 * @param {number} userId - User ID
 * @returns {Cert} - cert object.
 */
export async function findCertByUserID(
  db: DBOperator,
  userId: number
): Promise<Cert> {
  const query = select('*')
    .from('cert')
    .where({user_id: userId})
    .limit(1)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    throw new ApiError(400, 'no cert');
  }

  return new Cert(row);
}

/**
 * Certを削除する
 *
 * @param {DBOperator} db - database
 * @param {number} userId - User ID
 */
export async function deleteCertById(db: DBOperator, userId: number) {
  const query = sql
    .delete('cert')
    .where('user_id', userId)
    .toParams({placeholder: '?'});

  await db.execute(query);
}
