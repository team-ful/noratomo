import {ApiError} from '../base/apiError';
import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {ResponseEntry} from '../models/entry';
import {HotPepper} from '../services/api/hotpepper/hotpepper';
import {createEntryRow, findEntryById} from '../services/entry';
import {insertNumberOf} from '../services/numberOf';
import {
  createShop,
  createShopUserDefined,
  findShopByHotpepperID,
} from '../services/shop';

/**
 * 募集を作成する
 *
 * @param {AuthedBase} base - base
 */
async function entryPostHandler(base: AuthedBase<ResponseEntry>) {
  const title = await base.getPostFormFields('title', true);
  const body = await base.getPostFormFields('body');
  const meetingLat = await base.getPostFormFields('meeting_lat', true);
  const meetingLon = await base.getPostFormFields('meeting_lon', true);
  const meetDate = await base.getPostFormFields('meet_date', true);

  const parsedMeetingLat = parseFloat(meetingLat);
  const parsedMeetingLon = parseFloat(meetingLon);
  if (isNaN(parsedMeetingLat) || isNaN(parsedMeetingLon)) {
    throw new ApiError(400, 'lat or lon is parse failed');
  }

  const hotpepperId = await base.getPostFormFields('hotppepper');
  let shopId: number;

  // 独自に店を追加することができる
  // genre_catch は追加しない（ホットペッパーAPIのみ）
  if (typeof hotpepperId === 'undefined') {
    // ホットペッパーのお店IDを指定しない場合はユーザが独自に店情報を追加する
    const shopName = await base.getPostFormFields('shop_name', true);
    const shopAddress = await base.getPostFormFields('shop_address', true);
    const lat = await base.getPostFormFields('lat', true);
    const lon = await base.getPostFormFields('lon', true);
    const genreName = await base.getPostFormFields('genre_name', true);
    const gender = await base.getPostFormFields('gender', true); // `true` or `false`
    const siteURL = await base.getPostFormFields('site_url', true);
    const photo_url = await base.getPostFormFields('photo'); // optional

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
      throw new ApiError(400, 'lat or lon is float');
    }

    shopId = await createShopUserDefined(
      await base.db(),
      shopName,
      shopAddress,
      latNum,
      lonNum,
      genreName,
      gender === 'true',
      siteURL,
      photo_url
    );
  } else {
    // shopテーブル内に該当の店がない場合、ホットペッパーAPI経由で店情報を取得する
    // それ以外は、テーブルのものを使用する
    const shop = await findShopByHotpepperID(await base.db(), hotpepperId);
    if (shop === null) {
      const hotpepper = new HotPepper();

      const shop = await hotpepper.findShopById(hotpepperId);

      shopId = await createShop(
        await base.db(),
        shop.name,
        shop.address,
        shop.lat,
        shop.lng,
        shop.genre.name,
        shop.genre.catch,
        false,
        shop.urls.pc,
        shop.photo.pc.l,
        shop.id
      );
    } else {
      shopId = shop.id;
    }
  }

  const entryId = await createEntryRow(
    await base.db(),
    base.user.id,
    shopId,
    title,
    body || '',
    parsedMeetingLat,
    parsedMeetingLon,
    new Date(meetDate)
  );

  // entry++ する
  await insertNumberOf(await base.db(), base.user.id, 0, 1);

  const entry = await findEntryById(await base.db(), entryId);
  if (entry === null) {
    throw new ApiError(500, 'failed create entry');
  }

  base.sendJson(entry.json());
}

export default authHandlerWrapper(entryPostHandler);
