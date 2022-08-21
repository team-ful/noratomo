import {ApiError} from '../base/apiError';
import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {createApplication} from '../services/application';
import {updateRequestPeople} from '../services/entry';
import {insertNumberOf} from '../services/numberOf';

/**
 * meetリクエストをする
 *
 * @param {AuthedBase} base - base
 */
async function postRequestHandler(base: AuthedBase<void>) {
  const id = base.getQuery('id', true);
  const numberId = parseInt(id);
  if (isNaN(numberId)) {
    throw new ApiError(400, 'id is failed');
  }

  try {
    await updateRequestPeople(await base.db(), numberId, 1);
  } catch (e) {
    throw new ApiError(400, 'entry is not found');
  }

  await createApplication(await base.db(), base.user.id, numberId);

  await insertNumberOf(await base.db(), base.user.id, 0, 0, 0, 1);
}

export default authHandlerWrapper(postRequestHandler);
