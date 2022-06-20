import sql, {insert, select, update} from 'mysql-bricks';
import type {Connection, ResultSetHeader, RowDataPacket} from 'mysql2/promise';
import {ApiError} from 'next/dist/server/api-utils';
import {
  NoraQuestion,
  NoraQuestionModel,
  NoraQuestionSelect,
} from '../models/noraQuestion';

export interface UpdateNoraQuestion {
  question_title?: string;
  answers?: NoraQuestionSelect[];
  current_answer_index?: number;
  score?: number;
}

/**
 * 野良認証のクイズを追加する
 *
 * @param {Connection} db - database
 * @param {string} title - 野良認証の問題タイトル
 * @param {NoraQuestionSelect[]} answers - 野良認証の回答リスト
 * @param {number} answerIndex - 野良認証の正解の回答インデックス
 * @param {number} score - その野良認証のスコア
 */
export async function createNoraQuestion(
  db: Connection,
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

  const [rows] = await db.query<ResultSetHeader>(query.text, query.values);

  const id = rows.insertId;

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
 * @param {Connection} db - database
 * @param {number} id - 更新するNoraQuestionのID
 * @param {UpdateNoraQuestion} d - 更新する値
 */
export async function updateNoraQuestionByID(
  db: Connection,
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

  await db.query(query.text, query.values);
}

/**
 * 野良認証のクイズをidで引く
 *
 * @param {Connection} db - database
 * @param {number} id - nora question id
 */
export async function findNoraQuestionById(
  db: Connection,
  id: number
): Promise<NoraQuestion | null> {
  const query = select('*')
    .from('nora_question')
    .where('id', id)
    .toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

  if (row.length === 0) {
    return null;
  }

  return new NoraQuestion(row[0] as NoraQuestionModel);
}

/**
 *
 * @param {Connection} db - database
 * @param {number} limit - limit
 */
export async function findAllNoraQuestion(
  db: Connection,
  limit?: number
): Promise<NoraQuestion[]> {
  let q = select('*').from('nora_question');

  if (limit) {
    q = q.limit(limit);
  }

  const query = q.toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

  const n = [];

  for (const r of row) {
    n.push(new NoraQuestion(r as NoraQuestionModel));
  }

  return n;
}

/**
 * ランダムでNoraQuestionを取得する
 *
 * @param {Connection} db - database
 * @param {number} limit - 取得件数
 */
export async function findRandomNoraQuestion(
  db: Connection,
  limit: number
): Promise<NoraQuestion[]> {
  const query = select('*')
    .from('nora_question')
    .orderBy(sql('RAND()'))
    .limit(limit)
    .toParams({placeholder: '?'});

  const [rows] = await db.query<RowDataPacket[]>(query.text, query.values);

  const n = [];

  for (const r of rows) {
    n.push(new NoraQuestion(r as NoraQuestionModel));
  }

  return n;
}

/**
 * IDを指定してNoraQuestionを削除する
 *
 * @param {Connection} db - database
 * @param {number} id - 削除するid
 */
export async function deleteNoraQuestionByID(db: Connection, id: number) {
  const query = sql
    .delete('*')
    .from('nora_question')
    .where('id', id)
    .limit(1)
    .toParams({placeholder: '?'});

  await db.query(query.text, query.values);
}
