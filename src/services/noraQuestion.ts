import sql, {insert, select, update} from 'mysql-bricks';
import {ApiError} from 'next/dist/server/api-utils';
import DBOperator from '../db/operator';
import {NoraQuestion, NoraQuestionSelect} from '../models/noraQuestion';

export interface UpdateNoraQuestion {
  question_title?: string;
  answers?: NoraQuestionSelect[];
  current_answer_index?: number;
  score?: number;
}

/**
 * 野良認証のクイズを追加する
 *
 * @param {DBOperator} db - database
 * @param {string} title - 野良認証の問題タイトル
 * @param {NoraQuestionSelect[]} answers - 野良認証の回答リスト
 * @param {number} answerIndex - 野良認証の正解の回答インデックス
 * @param {number} score - その野良認証のスコア
 */
export async function createNoraQuestion(
  db: DBOperator,
  title: string,
  answers: NoraQuestionSelect[],
  answerIndex: number,
  score: number
): Promise<NoraQuestion> {
  // answerIndexが範囲外のときはエラー
  if (answerIndex < 0 || answerIndex >= answers.length) {
    throw new ApiError(400, 'answerIndex is out of answers index');
  }

  const query = insert('nora_question', {
    question_title: title,
    answers: JSON.stringify(answers),
    current_answer_index: answerIndex,
    score: score,
  }).toParams({placeholder: '?'});

  const id = await db.insert(query);

  return new NoraQuestion({
    id: id,
    question_title: title,
    answers: answers,
    current_answer_index: answerIndex,
    score: score,
  });
}

/**
 * IDを指定してNoraQuestionを更新sる
 *
 * @param {DBOperator} db - database
 * @param {number} id - 更新するNoraQuestionのID
 * @param {UpdateNoraQuestion} d - 更新する値
 */
export async function updateNoraQuestionByID(
  db: DBOperator,
  id: number,
  d: UpdateNoraQuestion
) {
  const q = await findNoraQuestionById(db, id);

  // 存在しない場合、そもそも更新はできないためエラーにする
  if (q === null) {
    throw new ApiError(
      500,
      'no update noraQuestion, because it does not exists'
    );
  }

  // 値が正しいかチェックする
  if (typeof d.current_answer_index === 'number' && d.answers) {
    if (
      d.current_answer_index < 0 ||
      d.current_answer_index >= d.answers.length
    )
      throw new ApiError(400, 'answerIndex is out of answers index');
  } else if (typeof d.current_answer_index === 'number') {
    if (
      d.current_answer_index < 0 ||
      d.current_answer_index >= q.answers.length
    )
      // answerIndexをしている場合、すでにテーブルに存在しているanswersをみて範囲内か判定する
      throw new ApiError(400, 'answerIndex is out of db answers index');
  } else if (d.answers) {
    if (q.current_answer_index >= d.answers.length)
      // answersを指定している場合、も上に同じ
      throw new ApiError(400, 'db answerIndex is out of answers index');
  }

  const _d: {[key: string]: Object | string | number} = {
    ...d,
  };

  // answersは文字列にする
  if (d.answers) {
    _d.answers = JSON.stringify(d.answers);
  }

  const query = update('nora_question')
    .set(_d)
    .where('id', id)
    .toParams({placeholder: '?'});

  await db.execute(query);
}

/**
 * 野良認証のクイズをidで引く
 *
 * @param {DBOperator} db - database
 * @param {number} id - nora question id
 */
export async function findNoraQuestionById(
  db: DBOperator,
  id: number
): Promise<NoraQuestion | null> {
  const query = select('*')
    .from('nora_question')
    .where('id', id)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new NoraQuestion(row);
}

/**
 *
 * @param {DBOperator} db - database
 * @param {number} limit - limit
 */
export async function findAllNoraQuestion(
  db: DBOperator,
  limit?: number
): Promise<NoraQuestion[]> {
  let q = select('*').from('nora_question');

  if (limit) {
    q = q.limit(limit);
  }

  const query = q.toParams({placeholder: '?'});

  const n = await db.multi(query);

  return n.map(v => new NoraQuestion(v));
}

/**
 * ランダムでNoraQuestionを取得する
 *
 * @param {DBOperator} db - database
 * @param {number} limit - 取得件数
 */
export async function findRandomNoraQuestion(
  db: DBOperator,
  limit: number
): Promise<NoraQuestion[]> {
  const query = select('*')
    .from('nora_question')
    .orderBy(sql('RAND()'))
    .limit(limit)
    .toParams({placeholder: '?'});

  const n = await db.multi(query);

  return n.map(v => new NoraQuestion(v));
}

/**
 * IDを指定してNoraQuestionを削除する
 *
 * @param {DBOperator} db - database
 * @param {number} id - 削除するid
 */
export async function deleteNoraQuestionByID(db: DBOperator, id: number) {
  const query = sql
    .delete('*')
    .from('nora_question')
    .where('id', id)
    .limit(1)
    .toParams({placeholder: '?'});

  await db.execute(query);
}
