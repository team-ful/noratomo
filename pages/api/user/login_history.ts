import {ApiError} from 'next/dist/server/api-utils';
import AuthedBase from '../../../src/base/authedBase';
import {authHandlerWrapper} from '../../../src/base/handlerWrapper';
import LoginHistory from '../../../src/models/loginHistory';
import {findLoginHistoriesByUserID} from '../../../src/services/loginHistory';

/**
 * ログイン履歴を過去50件まで取得する
 *
 * @param {AuthedBase<void>} base base
 */
async function handler(base: AuthedBase<LoginHistory>) {
  const limit = base.getQuery('limit');
  const loginHistory = await findLoginHistoriesByUserID(
    await base.db(),
    base.user.id,
    parseInt(limit || 'undefined')
  );
  if (loginHistory === null) {
    throw new ApiError(500, 'error');
  }
  const d = loginHistory.map(x => x.json());
  base.sendJson(d);
}

export default authHandlerWrapper(handler, 'GET');
