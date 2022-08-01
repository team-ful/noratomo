import {DefaultObject} from '../db/operator';

export interface ShopModel {
  id: number;

  // 店名
  name: string;

  // 住所
  address: string;

  lat: number;
  lon: number;

  // ジャンル: 大分類
  genre_name: string;
  // ジャンル
  genre_catch: string | null;

  gender: boolean;

  // 店のHP or ホットペッパーのURL
  site_url: string;
  // 店名画像URL
  photo_url: string | null;

  // ホットペッパーのお店ID
  hotpepper_id: string;
}

class Shop implements ShopModel {
  readonly id: number;
  readonly name: string;
  readonly address: string;
  readonly lat: number;
  readonly lon: number;
  readonly genre_name: string;
  readonly genre_catch: string | null;
  readonly gender: boolean;
  readonly site_url: string;
  readonly photo_url: string | null;
  readonly hotpepper_id: string;

  constructor(init: DefaultObject | ShopModel) {
    this.id = init.id as number;
    this.name = init.name as string;
    this.address = init.address as string;

    if (typeof init.lat === 'string') {
      this.lat = parseFloat(init.lat);
    } else {
      this.lat = init.lat as number;
    }

    if (typeof init.lon === 'string') {
      this.lon = parseFloat(init.lon);
    } else {
      this.lon = init.lon as number;
    }

    this.genre_name = init.genre_name as string;
    this.genre_catch = init.genre_catch as string | null;

    this.gender = Boolean(init.gender);

    this.site_url = init.site_url as string;
    this.photo_url = init.photo_url as string | null;
    this.hotpepper_id = init.hotpepper_id as string;
  }
}

export default Shop;
