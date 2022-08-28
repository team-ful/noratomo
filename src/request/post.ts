import {ApiError} from '../base/apiError';
import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {
  createApplication,
  findApplicationByEntryIdAndUserId,
} from '../services/application';
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

  const application = await findApplicationByEntryIdAndUserId(
    await base.db(),
    base.user.id,
    numberId
  );
  if (application !== null) {
    throw new ApiError(400, 'application is already exists');
  }

  await createApplication(await base.db(), base.user.id, numberId);

  await insertNumberOf(await base.db(), base.user.id, 0, 0, 0, 1);
}

export default authHandlerWrapper(postRequestHandler);
