import {ApiError} from '../base/apiError';
import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {deleteApplicationByUserIdAndEntryId} from '../services/application';
import {findEntryById} from '../services/entry';
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

  const entry = await findEntryById(await base.db(), numberId);
  if (entry?.is_closed) {
    throw new ApiError(400, 'entry is already closed');
  }

  await deleteApplicationByUserIdAndEntryId(
    await base.db(),
    numberId,
    base.user.id
  );

  await updateNumberOf(await base.db(), base.user.id, 0, 0, 0, -1);
}

export default authHandlerWrapper(deleteRequestHandler);
