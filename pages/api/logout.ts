import AuthedBase from '../../src/base/authedBase';
import {authHandlerWrapper} from '../../src/base/handlerWrapper';

/**
 * パスワードを検証してログインする
 *
 * @param {AuthedBase<void>} base base
 */
async function handler(base: AuthedBase<void>) {
  await base.logout();
}

export default authHandlerWrapper(handler, 'GET');
