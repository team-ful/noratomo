import sql from 'mysql-bricks';
import DBOperator from '../db/operator';
import {Application} from '../models/application';

export interface Options {
  limit?: number;
  is_met?: boolean;
  is_closed?: boolean;
}

/**
 * ユーザIDでapplicationを取得する
 *
 * @param {DBOperator} db - database
 * @param {number} userId - user id
 * @param {Options} options - option
 */
export async function findApplicationsByUserId(
  db: DBOperator,
  userId: number,
  options: Options
): Promise<Application[]> {
  let query = sql
    .select('*')
    .from('application')
    .where('user_id', userId)
    .limit(options.limit ?? 50);

  if (typeof options.is_met !== 'undefined') {
    query = query.where('is_met', options.is_met);
  }
  if (typeof options.is_closed !== 'undefined') {
    query = query.where('is_closed', options.is_closed);
  }

  const rows = await db.multi(query.toParams({placeholder: '?'}));

  return rows.map(v => new Application(v));
}

/**
 * すでにリクエストが作成されているのかをみるためのもの
 *
 * @param {DBOperator} db - database
 * @param {number} userId - user id
 * @param {number} entryId - entry id
 */
export async function findApplicationByEntryIdAndUserId(
  db: DBOperator,
  userId: number,
  entryId: number
) {
  const query = sql
    .select('*')
    .from('application')
    .where('user_id', userId)
    .and('entry_id', entryId)
    .limit(1)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new Application(row);
}

/**
 * entryIdを指定してすべてのapplicationを取得する
 *
 * @param {DBOperator} db - database
 * @param {number} entryId - entry id
 */
export async function findApplicationsByEntryId(
  db: DBOperator,
  entryId: number
): Promise<Application[]> {
  const query = sql
    .select('*')
    .from('application')
    .where('entry_id', entryId)
    .toParams({placeholder: '?'});

  const rows = await db.multi(query);

  return rows.map(v => new Application(v));
}

/**
 * idを指定してapplicationを取得する
 *
 * @param {DBOperator} db - database
 * @param {number} id - application id
 */
export async function findApplicationById(db: DBOperator, id: number) {
  const query = sql
    .select('*')
    .from('application')
    .where('id', id)
    .limit(1)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new Application(row);
}

/**
 * applicationを作成する
 *
 * @param {DBOperator} db - database
 * @param {number} userId - user id
 * @param {number} entryId - entry id
 */
export async function createApplication(
  db: DBOperator,
  userId: number,
  entryId: number
): Promise<number> {
  const query = sql
    .insert('application', {
      user_id: userId,
      entry_id: entryId,
    })
    .toParams({placeholder: '?'});

  return await db.insert(query);
}

/**
 * 指定したidを削除する
 *
 * @param {DBOperator} db - database
 * @param {number} id - id
 */
export async function deleteApplicationById(db: DBOperator, id: number) {
  const query = sql
    .delete('application')
    .where('id', id)
    .toParams({placeholder: '?'});

  await db.execute(query);
}

/**
 * 指定したuser_idを削除する
 *
 * @param {DBOperator} db - database
 * @param {number} userId - user id
 */
export async function deleteApplicationByUserId(
  db: DBOperator,
  userId: number
) {
  const query = sql
    .delete('application')
    .where('user_id', userId)
    .toParams({placeholder: '?'});

  await db.execute(query);
}

/**
 * 指定したentry_idを削除する
 *
 * @param {DBOperator} db - database
 * @param {number} entryId - entry id
 * @param {number} userId - user id
 */
export async function deleteApplicationByUserIdAndEntryId(
  db: DBOperator,
  entryId: number,
  userId: number
) {
  const query = sql
    .delete('application')
    .where('entry_id', entryId)
    .and('user_id', userId)
    .toParams({placeholder: '?'});

  await db.execute(query);
}
