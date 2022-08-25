import {ApiError} from 'next/dist/server/api-utils';
import AuthedBase from '../../../src/base/authedBase';
import {authHandlerWrapper} from '../../../src/base/handlerWrapper';
import LoginHistory from '../../../src/models/loginHistory';
import {findLoginHistoriesByUserID} from '../../../src/services/loginHistory';

/**
 * ログイン履歴を引数limitで指定した分だけ取得する。
 * 引数を指定しない場合は、デフォルトで５０件まで。
 *
 * @param {AuthedBase<void>} base -base
 */
async function handler(base: AuthedBase<LoginHistory>) {
  const limit = base.getQuery('limit');
  if (limit) {
    const parseLimit = parseInt(limit);
    if (isNaN(parseLimit)) {
      new ApiError(400, 'bad argument');
    }
    const loginHistories = await findLoginHistoriesByUserID(
      await base.db(),
      base.user.id,
      parseLimit
    );
    const d = loginHistories.map(x => x.json());
    base.sendJson(d);
  } else {
    const loginHistories = await findLoginHistoriesByUserID(
      await base.db(),
      base.user.id
    );
    const d = loginHistories.map(x => x.json());
    base.sendJson(d);
  }
}

export default authHandlerWrapper(handler, 'GET');
