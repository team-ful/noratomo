import config from '../../../config';
import Base from '../../../src/base/base';
import {handlerWrapper} from '../../../src/base/handlerWrapper';
import {loginURL} from '../../../src/oauth/url';

/**
 * Cateiru SSOのログインリンクへリダイレクトする
 *
 * @param {Base<void>} base base
 */
async function handler(base: Base<void>) {
  const redirect = config.host;
  redirect.pathname = '/api/oauth/login/cateirusso';

  const url = loginURL(
    config.cateiruSSOEndpoint,
    config.cateiruSSOClientId,
    redirect.toString()
  );

  base.res.redirect(url);
}

export default handlerWrapper(handler);
