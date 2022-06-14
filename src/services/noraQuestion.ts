import {insert, select} from 'mysql-bricks';
import type {Connection, ResultSetHeader, RowDataPacket} from 'mysql2/promise';
import {ApiError} from 'next/dist/server/api-utils';
import {
  NoraQuestion,
  NoraQuestionModel,
  NoraQuestionSelect,
} from '../models/noraQuestion';

/**
 * 野良認証のクイズを追加する
 *
 * @param db
 * @param title
 * @param answers
 * @param answerIndex
 * @param score
 */
export async function createNoraQuestion(
  db: Connection,
  title: string,
  answers: NoraQuestionSelect[],
  answerIndex: number,
  score: number
) {
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
 * 野良認証のクイズをidで引く
 *
 * @param db
 * @param id
 */
export async function findNoraQuestionById(db: Connection, id: number) {
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
 * @param db
 */
export async function findAllNoraQuestion(db: Connection) {
  const query = select('*').from('nora_question').toParams({placeholder: '?'});

  const [row] = await db.query<RowDataPacket[]>(query.text, query.values);

  const n = [];

  for (const r of row) {
    n.push(new NoraQuestion(r as NoraQuestionModel));
  }

  return n;
}
