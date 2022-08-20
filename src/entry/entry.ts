import DBOperator from '../db/operator';
import Entry, {ShopIncludedResponseEntry} from '../models/entry';
import {ShopModel} from '../models/shop';

/**
 * エントリに店情報を突っ込む
 *
 * @param {DBOperator} db - database
 * @param {Entry[]} entries - エントリ
 */
export async function fillShop(
  db: DBOperator,
  entries: Entry[]
): Promise<ShopIncludedResponseEntry[]> {
  const shops: {[id: string]: ShopModel} = {};
  const responseEntries: ShopIncludedResponseEntry[] = [];

  for (const entry of entries) {
    const shop = shops[entry.shop_id];
    if (shop) {
      responseEntries.push({
        ...entry.json(),
        shop: shop,
      });
    } else {
      const e = await entry.jsonShopIncluded(db);
      shops[e.shop_id] = e.shop;
      responseEntries.push(e);
    }
  }

  return responseEntries;
}
