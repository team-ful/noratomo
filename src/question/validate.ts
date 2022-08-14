import {ApiError} from '../base/apiError';
import DBOperator from '../db/operator';
import {findNoraSessionByToken} from '../services/noraSession';

/**
 * 野良認証問題が正しいかどうかをチェックします
 *
 * @param {DBOperator} db - database
 * @param {string} token - nora session token
 * @param {{id: number; answer_index: number}[]} answers - 野良認証問題の回答
 * @returns {boolean} - 回答の合計スコア数を返す
 */
export async function validateNoraQuestion(
  db: DBOperator,
  token: string,
  answers: {id: number; answer_index: number}[]
): Promise<number> {
  const session = await findNoraSessionByToken(db, token);

  if (session === null) {
    throw new ApiError(400, 'nora question is not found');
  }

  const questions = await session.noraQuestions(db);

  let score = 0;
  for (const answer of answers) {
    const question = questions.find(v => v.id === answer.id);

    if (typeof question !== 'undefined') {
      if (question.current_answer_index === answer.answer_index) {
        score += question.score;
      }
    }
  }

  return score;
}
