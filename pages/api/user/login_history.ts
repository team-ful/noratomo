import AuthedBase from '../../../src/base/authedBase';
import {authHandlerWrapper} from '../../../src/base/handlerWrapper';

/**
 * ログイン履歴を過去50件まで取得する
 *
 * @param {AuthedBase<void>} base base
 */
async function handler(base: AuthedBase<void>) {
  base.sendJson(base.getLoginHistory());
}

export default authHandlerWrapper(handler, 'GET');
