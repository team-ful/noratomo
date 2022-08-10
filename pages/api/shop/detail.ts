import {ApiError} from '../../../src/base/apiError';
import Base from '../../../src/base/base';
import {handlerWrapper} from '../../../src/base/handlerWrapper';
import {ShopLite} from '../../../src/models/api/hotpepper/gourmet';
import {HotPepper} from '../../../src/services/api/hotpepper/hotpepper';

/**
 * お店情報を取得する
 *
 * @param {Base} base - base
 */
async function handler(base: Base<ShopLite>) {
  const hotpepperId = base.getQuery('id', true);

  const hotpepper = new HotPepper();

  const shop = await hotpepper.findShopById(hotpepperId);

  if (shop === null) {
    throw new ApiError(400, 'shop not found');
  }

  base.sendJson(shop);
}

export default handlerWrapper(handler, 'GET');
