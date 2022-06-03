import config from '../../config';
import AuthedBase from '../../src/base/authedBase';
import {authHandlerWrapper} from '../../src/base/handlerWrapper';
import {deleteSessionBySessionToken} from '../../src/services/session';

/**
 * パスワードを検証してログインする
 *
 * @param {AuthedBase<void>} base base
 */
async function handler(base: AuthedBase<void>) {
  // session tokenをDBから削除
  await deleteSessionBySessionToken(await base.db(), base.sessionToken);

  base.clearCookie(config.sessionCookieName, config.sessionCookieOptions());
}

export default authHandlerWrapper(handler, 'GET');
