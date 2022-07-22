import {ApiError} from 'next/dist/server/api-utils';
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
    let userIDN = NaN;
    try {
      userIDN = parseInt(userID);
    } catch (e) {
      throw new ApiError(400, 'userid is parse failed');
    }

    const user = await findUserByUserID(await base.db(), userIDN);

    base.sendJson(user);
    return;
  }

  const offset = base.getQuery('offset') || '0';
  const limit = base.getQuery('limit') || '50';

  let offsetInt = NaN;
  let limitInt = NaN;
  try {
    offsetInt = parseInt(offset);
  } catch (e) {
    throw new ApiError(400, 'offset is parse failed');
  }
  try {
    limitInt = parseInt(limit);
  } catch (e) {
    throw new ApiError(400, 'limit is parse failed');
  }

  const users = await allUsers(await base.db(), limitInt, offsetInt);

  base.sendJson(users);
}

export default authHandlerWrapper(handler);
