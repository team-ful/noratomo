import sql from 'mysql-bricks';
import DBOperator from '../db/operator';
import Notice from '../models/notice';

/**
 * 通知を作成する
 *
 * @param {DBOperator} db - database
 * @param {number} userId - user id
 * @param {string} title - 通知タイトル
 * @param {string} bodyText - 通知詳細
 * @param {string} url - 通知URL
 * @returns {number} - notice id
 */
export async function createNotice(
  db: DBOperator,
  userId: number,
  title: string,
  bodyText?: string,
  url?: string
): Promise<number> {
  const insert: {[key: string]: string | number | boolean} = {
    user_id: userId,
    is_read: false,
    title: title,
    created: sql('NOW()'),
  };

  if (typeof bodyText !== 'undefined') {
    insert['text'] = bodyText;
  }
  if (typeof url !== 'undefined') {
    insert['url'] = url;
  }

  const query = sql.insert('notice', insert).toParams({placeholder: '?'});

  return await db.insert(query);
}

/**
 * 通知を既読にする
 *
 * @param {DBOperator} db - database
 * @param {number} id - notice id
 */
export async function read(db: DBOperator, id: number) {
  const query = sql
    .update('notice', {is_read: true})
    .where('id', id)
    .toParams({placeholder: '?'});

  await db.execute(query);
}

/**
 * UserIDで通知を取得する
 *
 * @param {DBOperator} db - database
 * @param {number} userId - user id
 * @param {number} limit - 取得量
 */
export async function findNoticeByUserId(
  db: DBOperator,
  userId: number,
  limit?: number
): Promise<Notice[]> {
  let query = sql
    .select('*')
    .from('notice')
    .where('user_id', userId)
    .orderBy('created');

  if (typeof limit !== 'undefined') {
    query = query.limit(limit);
  }

  const rows = await db.multi(query.toParams({placeholder: '?'}));

  return rows.map(v => new Notice(v));
}

/**
 * UserIDで未読の通知を取得する
 *
 * @param {DBOperator} db - database
 * @param {number} userId - user id
 * @param {number} limit - 取得量
 */
export async function findNoReadNoticeByUserId(
  db: DBOperator,
  userId: number,
  limit?: number
): Promise<Notice[]> {
  let query = sql
    .select('*')
    .from('notice')
    .where(sql.and({user_id: userId, is_read: false}))
    .orderBy('created');

  if (typeof limit !== 'undefined') {
    query = query.limit(limit);
  }

  const rows = await db.multi(query.toParams({placeholder: '?'}));

  return rows.map(v => new Notice(v));
}
