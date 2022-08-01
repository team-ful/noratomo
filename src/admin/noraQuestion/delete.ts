import {ApiError} from '../../base/apiError';
import AuthedBase from '../../base/authedBase';
import {authHandlerWrapper} from '../../base/handlerWrapper';
import {deleteNoraQuestionByID} from '../../services/noraQuestion';

/**
 * 野良認証の問題を削除する
 * 管理者のみ
 *
 * @param {AuthedBase} base - base
 */
async function handler(base: AuthedBase<void>) {
  // 管理者以外は403
  base.adminOnly();

  const _id = base.getQuery('id');

  if (typeof _id === 'undefined') {
    throw new ApiError(400, 'id require');
  }

  const id = parseInt(_id);
  if (Number.isNaN(id)) {
    throw new ApiError(400, 'id is not number');
  }

  await deleteNoraQuestionByID(await base.db(), id);
}

export default authHandlerWrapper(handler);
