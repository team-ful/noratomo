import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {ShopIncludedResponseEntry} from '../models/entry';
import {ShopModel} from '../models/shop';
import {findEntryByUserId} from '../services/entry';

/**
 * 自分が投稿した募集を取得する
 *
 * @param {AuthedBase} base - base
 */
async function getEntryHandler(base: AuthedBase<ShopIncludedResponseEntry[]>) {
  const entries = await findEntryByUserId(await base.db(), base.user.id);

  const shops: {[id: string]: ShopModel} = {};
  const responseEntries: ShopIncludedResponseEntry[] = [];

  // 各entryにshopを突っ込む
  for (const entry of entries) {
    const shop = shops[entry.shop_id];
    if (shop) {
      responseEntries.push({
        ...entry.json(),
        shop: shop,
      });
    } else {
      const e = await entry.jsonShopIncluded(await base.db());
      shops[e.shop_id] = e.shop;
      responseEntries.push(e);
    }
  }

  base.sendJson(responseEntries);
}

export default authHandlerWrapper(getEntryHandler);
