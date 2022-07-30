import {ApiError} from '../../base/apiError';
import AuthedBase from '../../base/authedBase';
import {authHandlerWrapper} from '../../base/handlerWrapper';
import {
  updateNoraQuestionByID,
  UpdateNoraQuestion,
} from '../../services/noraQuestion';

interface NoraQuestion {
  id: number;

  // 問題のタイトル
  question_title?: string;

  // 答えの選択肢
  answers?: string[];

  // 答えの回答インデックス
  current_answer_index?: number;

  // この問題の重み
  score?: number;
}

/**
 * 野良認証の問題を更新する
 * 管理者のみ
 *
 * @param {AuthedBase} base - base
 */
async function handler(base: AuthedBase<void>) {
  // 管理者以外は403
  base.adminOnly();

  const question = base.getPostJson<NoraQuestion>();

  if (typeof question.id !== 'number') {
    throw new ApiError(400, 'Incorrect json');
  }

  const q: UpdateNoraQuestion = {};

  if (question.question_title) {
    q['question_title'] = question.question_title;
  }
  if (question.answers) {
    q['answers'] = question.answers.map((v, i) => ({
      index: i,
      answerText: v,
    }));
  }
  if (typeof question.current_answer_index === 'number') {
    q['current_answer_index'] = question.current_answer_index;
  }
  if (question.score) {
    q['score'] = question.score;
  }

  await updateNoraQuestionByID(await base.db(), question.id, q);
}

export default authHandlerWrapper(handler);
