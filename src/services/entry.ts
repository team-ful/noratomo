import sql from 'mysql-bricks';
import DBOperator from '../db/operator';
import Entry from '../models/entry';
import Shop from '../models/shop';
import User from '../models/user';

interface UpdateOption {
  title?: string;
  body?: string;
}

/**
 * 細かく指定して、Entryを作成する
 *
 * @param {DBOperator} db - database
 * @param {number} ownerId - 作成者のuser_id
 * @param {number} shopId - 店のID
 * @param {string} title - title
 * @param {string} body - 本文
 */
export async function createEntryRow(
  db: DBOperator,
  ownerId: number,
  shopId: number,
  title: string,
  body: string
): Promise<number> {
  const query = sql
    .insert('entry', {
      owner_user_id: ownerId,
      title: title,
      shop_id: shopId,
      number_of_people: 1,
      date: sql('NOW()'),
      body: body,
      is_closed: false,
    })
    .toParams({placeholder: '?'});

  return await db.insert(query);
}

/**
 * Entryを作成する
 *
 * @param {DBOperator} db - database
 * @param {User} owner - 作成者
 * @param {Shop} shop - 対象の店
 * @param {string} title - title
 * @param {string} body - 本文
 */
export const createEntry = async (
  db: DBOperator,
  owner: User,
  shop: Shop,
  title: string,
  body: string
): Promise<number> => await createEntryRow(db, owner.id, shop.id, title, body);

/**
 * 内容を更新する
 *
 * @param {DBOperator} db - database
 * @param {number} id - entry id
 * @param {UpdateOption} updated - 更新する内容
 */
export async function updateEntry(
  db: DBOperator,
  id: number,
  updated: UpdateOption
) {
  const query = sql
    .update('entry', updated)
    .where('id', id)
    .toParams({placeholder: '?'});

  await db.execute(query);
}

/**
 * 対象のエントリを閉じる
 *
 * @param {DBOperator} db - database
 * @param {number} id - entry id
 */
export async function closeEntry(db: DBOperator, id: number) {
  const query = sql
    .update('entry', {
      is_closed: true,
    })
    .where('id', id)
    .toParams({placeholder: '?'});

  await db.execute(query);
}

/**
 * 対象のエントリをマッチ済みにする
 *
 * @param {DBOperator} db - database
 * @param {number} id - entry id
 */
export async function matchedEntry(db: DBOperator, id: number) {
  const query = sql
    .update('entry', {is_matched: true})
    .where('id', id)
    .toParams({placeholder: '?'});

  await db.execute(query);
}

/**
 * Entry id からentryを取得する
 *
 * request_peopleは引かない
 *
 * @param {DBOperator} db - database
 * @param {number} id - entry id
 */
export async function findEntryById(
  db: DBOperator,
  id: number
): Promise<Entry | null> {
  const query = sql
    .select('*')
    .from('entry')
    .where('id', id)
    .limit(1)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new Entry(row);
}

/**
 * user_idからentryを取得する
 *
 * request_peopleも引く
 *
 * @param {DBOperator} db - database
 * @param {number} userId - user id
 */
export async function findEntryByUserId(
  db: DBOperator,
  userId: number
): Promise<Entry[]> {
  const query = sql
    .select('entry.*', 'COUNT(application.id) as request_people')
    .from('entry')
    .leftOuterJoin('application')
    .on('entry.id', 'application.entry_id')
    .groupBy('entry.id')
    .where('entry.owner_user_id', userId)
    .orderBy('entry.date desc')
    .toParams({placeholder: '?'});

  const rows = await db.multi(query);

  return rows.map(v => new Entry(v));
}

/**
 * shop_idからentryを取得する
 *
 * @param {DBOperator} db - database
 * @param {number} shopId - shop id
 */
export async function findEntryByShopId(
  db: DBOperator,
  shopId: number
): Promise<Entry[]> {
  const query = sql
    .select('*')
    .from('entry')
    .where('shop_id', shopId)
    .toParams({placeholder: '?'});

  const rows = await db.multi(query);

  return rows.map(v => new Entry(v));
}

/**
 * 全エントリを取得する
 *
 * request_peopleも引く
 *
 * @param {DBOperator} db - database
 * @param {number} userId - 除外するUserID。このユーザがいいねをつけているものは取得しない
 * @param {number} limit - limit
 * @param {number} offset - offset
 */
export async function findAllEntries(
  db: DBOperator,
  userId: number,
  limit: number,
  offset: number
): Promise<Entry[]> {
  // SELECT entry.*, COUNT(application.id) as request_people
  // FROM entry
  //     LEFT JOIN application
  //         ON entry.id = application.entry_id
  // WHERE entry.is_closed = 0
  //     AND entry.is_matched = 0
  //     AND NOT EXISTS (
  //         SELECT *
  //         FROM application
  //         WHERE application.entry_id = entry.id
  //             AND application.user_id = ?
  //             AND is_met = 0
  //             AND is_closed = 0)
  // GROUP BY entry.id
  // ORDER BY entry.date desc
  // LIMIT 10;

  const query = sql
    .select('entry.*', 'COUNT(application.id) as request_people')
    .from('entry')
    .leftOuterJoin('application')
    .on('entry.id', 'application.entry_id')
    .groupBy('entry.id')
    .where('entry.is_closed', false)
    .and('entry.is_matched', false)
    .and(
      sql.not(
        sql.exists(
          sql
            .select('user_id')
            .from('application')
            .where(sql('application.entry_id = entry.id'))
            .and('application.user_id', userId)
            .and(sql('is_met = 0'))
            .and(sql('is_closed = 0'))
        )
      )
    )
    .orderBy('entry.date desc')
    .limit(limit)
    .offset(offset)
    .toParams({placeholder: '?'});

  const rows = await db.multi(query);

  return rows.map(v => new Entry(v));
}

/**
 * 複数のIDを指定して取得する
 *
 * request_peopleも引く
 *
 * @param {DBOperator} db - database
 * @param {number} ids - idのリスト
 */
export async function findEntriesByIds(
  db: DBOperator,
  ids: number[]
): Promise<Entry[]> {
  const query = sql
    .select('entry.*', 'COUNT(application.id) as request_people')
    .from('entry')
    .leftOuterJoin('application')
    .on('entry.id', 'application.entry_id')
    .groupBy('entry.id')
    .orderBy('date desc')
    .where(sql.in('entry.id', ...ids))
    .toParams({placeholder: '?'});

  const rows = await db.multi(query);

  return rows.map(v => new Entry(v));
}

/**
 * user idのentryをすべて削除する
 *
 * @param {DBOperator} db - database
 * @param {number} userId - user id
 */
export async function deleteEntryByUserId(db: DBOperator, userId: number) {
  const query = sql
    .delete('entry')
    .where('owner_user_id', userId)
    .toParams({placeholder: '?'});

  await db.execute(query);
}
