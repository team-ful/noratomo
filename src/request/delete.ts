import {ApiError} from '../base/apiError';
import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {deleteApplicationByUserIdAndEntryId} from '../services/application';
import {updateNumberOf} from '../services/numberOf';

/**
 * meetリクエストを削除する
 *
 * @param {AuthedBase} base - base
 */
async function deleteRequestHandler(base: AuthedBase<void>) {
  const id = base.getQuery('id', true);
  const numberId = parseInt(id);
  if (isNaN(numberId)) {
    throw new ApiError(400, 'id is failed');
  }

  await deleteApplicationByUserIdAndEntryId(
    await base.db(),
    numberId,
    base.user.id
  );

  await updateNumberOf(await base.db(), base.user.id, 0, 0, 0, -1);
}

export default authHandlerWrapper(deleteRequestHandler);
