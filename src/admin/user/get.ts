import {ApiError} from '../../base/apiError';
import AuthedBase from '../../base/authedBase';
import {authHandlerWrapper} from '../../base/handlerWrapper';
import {UserModel} from '../../models/user';
import {allUsers, findUserByUserID} from '../../services/user';

/**
 * ユーザを返す
 * 管理者のみ
 *
 * @param {AuthedBase} base - base
 */
async function handler(base: AuthedBase<UserModel | UserModel[]>) {
  // 管理者以外は403
  base.adminOnly();

  // 1件のみ取得する
  const userID = base.getQuery('user_id');
  if (userID) {
    const userIDN = parseInt(userID);
    if (Number.isNaN(userIDN)) {
      throw new ApiError(400, 'userid is parse failed');
    }

    const user = await findUserByUserID(await base.db(), userIDN);

    base.sendJson(user);
    return;
  }

  const offset = base.getQuery('offset') || '0';
  const limit = base.getQuery('limit') || '50';

  const offsetInt = parseInt(offset);
  if (Number.isNaN(offsetInt)) {
    throw new ApiError(400, 'offset is parse failed');
  }
  const limitInt = parseInt(limit);
  if (Number.isNaN(limitInt)) {
    throw new ApiError(400, 'limit is parse failed');
  }

  const users = await allUsers(await base.db(), limitInt, offsetInt);

  base.sendJson(users);
}

export default authHandlerWrapper(handler);
