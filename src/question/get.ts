import {ApiError} from '../base/apiError';
import Base from '../base/base';
import {NoraQuestionExternal} from '../models/noraQuestion';
import {findNoraQuestionById} from '../services/noraQuestion';

/**
 * 野良認証問題を取得する
 *
 * @param {Base} base - base
 */
export async function getNoraQuestionHandler(base: Base<NoraQuestionExternal>) {
  const idStr = base.getQuery('id', true);

  const id = parseInt(idStr);
  if (Number.isNaN(id)) {
    throw new ApiError(400, 'id must be a number');
  }

  const question = await findNoraQuestionById(await base.db(), id);

  if (question === null) {
    throw new ApiError(400, 'nora question is not found');
  }

  base.sendJson(question.external);
}
