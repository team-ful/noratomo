import AuthedBase from '../base/authedBase';

/**
 * meetリクエストをする
 *
 * @param {AuthedBase} base - base
 */
function postRequestHandler(base: AuthedBase<void>) {
  const id = base.getPostURLForm('id', true);
}
