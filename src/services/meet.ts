import sql from 'mysql-bricks';
import DBOperator from '../db/operator';
import {Meet} from '../models/meet';
import {randomText} from '../utils/random';

/**
 * meetを作成する
 *
 * @param {DBOperator} db - database
 * @param {number} entryId - entry id
 * @param {number} ownerId - owner id
 * @param {number} applyUserId - apply user id
 * @returns {number} - meet id
 */
export async function createMeet(
  db: DBOperator,
  entryId: number,
  ownerId: number,
  applyUserId: number
): Promise<number> {
  const findId = randomText(15);

  const query = sql
    .insertInto('meet')
    .values({
      entry_id: entryId,
      owner_id: ownerId,
      apply_user_id: applyUserId,
      find_id: findId,
    })
    .toParams({placeholder: '?'});

  return await db.insert(query);
}

/**
 * meet idを指定してmeetを取得する
 *
 * @param {DBOperator} db - database
 * @param {number} id - meet id
 */
export async function findMeetById(
  db: DBOperator,
  id: number
): Promise<Meet | null> {
  const query = sql
    .select('*')
    .from('meet')
    .where('id', id)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new Meet(row);
}
