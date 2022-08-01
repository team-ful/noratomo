import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';

/**
 * 募集を作成する
 *
 * @param {AuthedBase} base - base
 */
async function entryPostHandler(base: AuthedBase<void>) {
  const hotpepperId = await base.getPostFormFields('hotppepper');

  // 独自に店を追加することができる
  // genre_catch は追加しない（ホットペッパーAPIのみ）
  if (typeof hotpepperId === 'undefined') {
    const shopName = await base.getPostFormFields('shop_name', true);
    const shopAddress = await base.getPostFormFields('shop_address', true);
    const lat = await base.getPostFormFields('lat', true);
    const lon = await base.getPostFormFields('lon', true);
    const genreName = await base.getPostFormFields('genre_name', true);
    const siteURL = await base.getPostFormFields('site_url', true);
    const photo_url = await base.getPostFormFields('photo'); // optional
  }
}

export default authHandlerWrapper(entryPostHandler);
