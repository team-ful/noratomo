import {ApiError} from '../../base/apiError';
import AuthedBase from '../../base/authedBase';
import {authHandlerWrapper} from '../../base/handlerWrapper';
import {read} from '../../services/notice';

/**
 * 特定の通知を既読に変更する
 *
 * @param {AuthedBase} base - base
 */
async function readNoticeHandler(base: AuthedBase<void>) {
  const noticeId = base.getPostURLForm('id', true);

  const noticeIdNum = parseInt(noticeId);

  if (Number.isNaN(noticeIdNum)) {
    throw new ApiError(400, 'invalid id');
  }

  await read(await base.db(), noticeIdNum);
}

export default authHandlerWrapper(readNoticeHandler);
