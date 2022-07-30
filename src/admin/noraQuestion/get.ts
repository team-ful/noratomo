import {ApiError} from '../../base/apiError';
import AuthedBase from '../../base/authedBase';
import {authHandlerWrapper} from '../../base/handlerWrapper';
import {NoraQuestionModel} from '../../models/noraQuestion';
import {findAllNoraQuestion} from '../../services/noraQuestion';

/**
 * 野良認証の問題を返す
 * `?limit`を指定することでその件数文取得可能
 * 管理者のみ
 *
 * @param {AuthedBase} base - base
 */
async function handler(base: AuthedBase<NoraQuestionModel[]>) {
  // 管理者以外は403
  base.adminOnly();

  const _limit = base.getQuery('limit');
  let limit;
  if (_limit) {
    try {
      limit = parseInt(_limit);
    } catch (e) {
      if (e instanceof Error) {
        // パースに失敗したら400を返す
        throw new ApiError(400, e.message);
      }
    }
  }

  const questions = await findAllNoraQuestion(await base.db(), limit);

  const qJson = questions.map(v => v.model);

  base.sendJson(qJson);
}

export default authHandlerWrapper(handler);
