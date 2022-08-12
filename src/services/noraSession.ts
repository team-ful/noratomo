import sql from 'mysql-bricks';
import DBOperator from '../db/operator';
import {NoraSession} from '../models/noraSession';
import {randomText} from '../utils/random';

/**
 * トークンを使用して野良セッションを取得する
 *
 * @param {DBOperator} db - database
 * @param {string} token - nora session token
 */
export async function findNoraSessionByToken(
  db: DBOperator,
  token: string
): Promise<NoraSession | null> {
  const query = sql
    .select('*')
    .from('nora_session')
    .where('token', token)
    .limit(1)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new NoraSession(row);
}

/**
 *
 * @param {DBOperator} db - database
 * @param {number[]} questionIds - 野良認証の問題
 * @returns {string} - nora session token
 */
export async function createNoraSession(
  db: DBOperator,
  questionIds: number[]
): Promise<string> {
  const token = randomText(64);

  const query = sql
    .insert('nora_session', {
      token: token,
      question_ids: questionIds.join(','),
    })
    .toParams({placeholder: '?'});

  await db.insert(query);

  return token;
}
