import DBOperator from '../db/operator';
import Entry, {
  ShopIdAndRequestDataIncludedResponseEntry,
  ShopIncludedResponseEntry,
} from '../models/entry';
import {ShopModel} from '../models/shop';
import {findApplicationsByUserId} from '../services/application';

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

/**
 * エントリに店情報を突っ込んで、色々する
 *
 * @param {DBOperator} db - database
 * @param {Entry[]} entries - entry
 * @param {number} userId - user id
 */
export async function fillShopAndRequest(
  db: DBOperator,
  entries: Entry[],
  userId: number
) {
  const shops: {[id: string]: ShopModel} = {};
  const responseEntries: ShopIdAndRequestDataIncludedResponseEntry[] = [];
  const myRequestEntries = await findApplicationsByUserId(db, userId, {
    is_met: false,
    is_closed: false,
  });

  for (const entry of entries) {
    // 自分がリクエストつけたものはスルーする
    if (myRequestEntries.find(v => v.entry_id === entry.id)) {
      continue;
    }

    let newE: Partial<ShopIdAndRequestDataIncludedResponseEntry>;

    // shopを代入する
    const shop = shops[entry.shop_id];
    if (shop) {
      newE = {
        ...entry.json(),
        shop: shop,
      };
    } else {
      const e = await entry.jsonShopIncluded(db);
      shops[e.shop_id] = e.shop;
      newE = {
        ...e,
      };
    }

    newE.is_owner = entry.owner_user_id === userId;
    responseEntries.push(newE as ShopIdAndRequestDataIncludedResponseEntry);
  }

  return responseEntries;
}
