import {ApiError} from 'next/dist/server/api-utils';
import AuthedBase from '../../base/authedBase';
import {authHandlerWrapper} from '../../base/handlerWrapper';
import {NoraQuestionModel} from '../../models/noraQuestion';
import {createNoraQuestion} from '../../services/noraQuestion';

interface NoraQuestion {
  // 問題のタイトル
  question_title: string;

  // 答えの選択肢
  answers: string[];

  // 答えの回答インデックス
  current_answer_index: number;

  // この問題の重み
  score: number;
}

/**
 * 野良認証の問題を新規追加する
 * 管理者のみ
 *
 * @param {AuthedBase} base - base
 */
async function handler(base: AuthedBase<NoraQuestionModel>) {
  // 管理者以外は403
  base.adminOnly();

  const question = base.getPostJson<NoraQuestion>();

  if (
    !(
      question.answers &&
      typeof question.current_answer_index === 'number' &&
      typeof question.question_title === 'string' &&
      typeof question.score === 'number'
    )
  ) {
    throw new ApiError(400, 'Incorrect json');
  }

  const insertedQuestion = await createNoraQuestion(
    await base.db(),
    question.question_title,
    question.answers.map((v, i) => {
      return {
        index: i,
        answerText: v,
      };
    }),
    question.current_answer_index,
    question.score
  );

  base.sendJson(insertedQuestion.model);
}

export default authHandlerWrapper(handler);
