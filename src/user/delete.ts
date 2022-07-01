import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {deleteCertById} from '../services/cert';
import {deleteUserByID} from '../services/user';

/**
 * ユーザを削除する
 *
 * @param {AuthedBase} base - base
 */
async function userDeleteHandler(base: AuthedBase<void>) {
  // sessionを削除する
  await base.logout();

  await deleteCertById(await base.db(), base.user.id);
  await deleteUserByID(await base.db(), base.user.id);
}

export default authHandlerWrapper(userDeleteHandler);
