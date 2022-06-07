import AuthedBase from '../../../src/base/authedBase';
import {authHandlerWrapper} from '../../../src/base/handlerWrapper';

/**
 * ユーザ情報を取得する
 *
 * @param {AuthedBase<void>} base base
 */
async function handler(base: AuthedBase<void>) {
  base.sendJson(base.getPublicUserData());
}

export default authHandlerWrapper(handler, 'GET');
