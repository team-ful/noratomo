import sql from 'mysql-bricks';
import DBOperator from '../db/operator';
import Shop from '../models/shop';

/**
 * ホットペッパーのお店IDで検索する
 *
 * @param {DBOperator} db - database
 * @param {string} id - hotpepper id
 */
export async function findShopByHotpepperID(db: DBOperator, id: string) {
  const query = sql
    .select('*')
    .from('shop')
    .where('hotpepper_id', id)
    .limit(1)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new Shop(row);
}

/**
 * ShopID でshopを検索する
 *
 * @param {DBOperator} db - database
 * @param {string} id - shop id
 */
export async function findShopById(db: DBOperator, id: number) {
  const query = sql
    .select('*')
    .from('shop')
    .where('id', id)
    .limit(1)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new Shop(row);
}

/**
 * ホットペッパーAPIから店情報を作成する
 *
 * @param {DBOperator} db - database
 * @param {string} name - 店名
 * @param {string} address - 住所
 * @param {number} lat - 緯度
 * @param {number} lon - 軽度
 * @param {string} genreName - ジャンル
 * @param {string} genreCatch - ジャンルキャッチ
 * @param {boolean} gender - 性別で入場制限があるか
 * @param {string} siteUrl - site url
 * @param {string} photoUrl - 店舗イメージurl
 * @param {string} hotpepperId - ホットペッパーお店ID
 */
export async function createShop(
  db: DBOperator,
  name: string,
  address: string,
  lat: number,
  lon: number,
  genreName: string,
  genreCatch: string,
  gender: boolean,
  siteUrl: string,
  photoUrl: string,
  hotpepperId: string
): Promise<number> {
  const query = sql
    .insert('shop', {
      name: name,
      address: address,
      lat: lat,
      lon: lon,
      genre_name: genreName,
      genre_catch: genreCatch,
      gender: gender,
      site_url: siteUrl,
      photo_url: photoUrl,
      hotpepper_id: hotpepperId,
    })
    .toParams({placeholder: '?'});

  return await db.insert(query);
}

/**
 * ユーザ定義で店情報を作成する
 *
 * @param {DBOperator} db - database
 * @param {string} name - 店名
 * @param {string} address - 住所
 * @param {number} lat - 緯度
 * @param {number} lon - 軽度
 * @param {string} genreName - ジャンル
 * @param {boolean} gender - 性別で入場制限があるか
 * @param {string} siteUrl - site url
 * @param {string} photoUrl - 店舗イメージurl
 */
export async function createShopUserDefined(
  db: DBOperator,
  name: string,
  address: string,
  lat: number,
  lon: number,
  genreName: string,
  gender: boolean,
  siteUrl: string,
  photoUrl?: string
): Promise<number> {
  const data: {[key: string]: string | number | boolean} = {
    name: name,
    address: address,
    lat: lat,
    lon: lon,
    genre_name: genreName,
    gender: gender,
    site_url: siteUrl,
  };

  if (typeof photoUrl !== 'undefined') {
    data['photo_url'] = photoUrl;
  }

  const query = sql.insert('shop', data).toParams({placeholder: '?'});

  return await db.insert(query);
}
