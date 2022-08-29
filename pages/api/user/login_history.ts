import {ApiError} from 'next/dist/server/api-utils';
import AuthedBase from '../../../src/base/authedBase';
import {authHandlerWrapper} from '../../../src/base/handlerWrapper';
import LoginHistory from '../../../src/models/loginHistory';
import {findLoginHistoriesByUserID} from '../../../src/services/loginHistory';

/**
 * ログイン履歴を引数limitで指定した分だけ取得する。
 * 引数を指定しない場合は、デフォルトで50件まで。
 *
 * @param {AuthedBase<void>} base -base
 */
async function handler(base: AuthedBase<LoginHistory>) {
  const limit = base.getQuery('limit');
  let loginHistories;
  if (typeof limit !== 'undefined') {
    const parseLimit = parseInt(limit);
    if (isNaN(parseLimit) || parseLimit < 1) {
      throw new ApiError(400, 'bad argument');
    } else {
      loginHistories = await findLoginHistoriesByUserID(
        await base.db(),
        base.user.id,
        parseLimit
      );
    }
  } else {
    loginHistories = await findLoginHistoriesByUserID(
      await base.db(),
      base.user.id
    );
  }
  const d = loginHistories.map(x => x.json());
  base.sendJson(d);
}

export default authHandlerWrapper(handler, 'GET');
