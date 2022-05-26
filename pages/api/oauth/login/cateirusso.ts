import {ApiError} from 'next/dist/server/api-utils';
import config from '../../../../config';
import Base from '../../../../src/base/base';
import {handlerWrapper} from '../../../../src/base/handlerWrapper';
import {JWT} from '../../../../src/oauth/cateirusso/jwt';

/**
 * Cateiru SSOのログインリンクへリダイレクトする
 *
 * @param {Base<void>} base base
 */
async function handler(base: Base<void>) {
  if (!base.checkReferer(config.cateiruSSOEndpoint)) {
    throw new ApiError(400, 'Illegal referer');
  }

  const code = base.getQuery('code');
  if (typeof code === 'undefined') {
    throw new ApiError(400, 'code is not found');
  }
  const jwt = new JWT(code);

  const data = await jwt.parse();

  // TODO
  console.log(data);
}

export default handlerWrapper(handler);
