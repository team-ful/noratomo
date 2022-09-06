import {ApiError} from '../base/apiError';
import DBOperator, {DefaultObject} from '../db/operator';
import {findShopById} from '../services/shop';
import {ShopModel} from './shop';

export interface EntryModel {
  id: number;

  // 作成者
  owner_user_id: number;

  title: string;

  // shopのID
  shop_id: number;

  // 基本1
  number_of_people: number;

  date: Date;

  body: string | null;

  is_closed: boolean;

  is_matched: boolean;

  request_people?: number;

  meeting_lat: number;
  meeting_lon: number;
  meet_date: Date;
}

export interface ResponseEntry {
  id: number;

  title: string;
  body: string | null;
  date: Date;
  number_of_people: number;
  is_closed: boolean;
  shop_id: number;
  is_matched: boolean;
  request_people: number;
}

export interface ShopIncludedResponseEntry extends ResponseEntry {
  shop: ShopModel;
}

export interface ShopIdAndRequestDataIncludedResponseEntry
  extends ShopIncludedResponseEntry {
  is_owner: boolean;
}

class Entry implements EntryModel {
  readonly id: number;
  readonly owner_user_id: number;
  readonly title: string;
  readonly shop_id: number;
  readonly number_of_people: number;
  readonly date: Date;
  readonly body: string | null;
  readonly is_closed: boolean;
  readonly is_matched: boolean;
  readonly request_people: number | undefined;
  readonly meeting_lat: number;
  readonly meeting_lon: number;
  readonly meet_date: Date;

  constructor(init: DefaultObject | EntryModel) {
    this.id = init.id as number;
    this.owner_user_id = init.owner_user_id as number;
    this.title = init.title as string;
    this.shop_id = init.shop_id as number;
    this.number_of_people = init.number_of_people as number;
    this.date = new Date(init.date as Date | string);
    this.body = init.body as string | null;
    this.is_closed = Boolean(init.is_closed);
    this.is_matched = Boolean(init.is_matched);

    if (typeof init.request_people === 'number') {
      this.request_people = init.request_people;
    }

    this.meeting_lat = init.meeting_lat as number;
    this.meeting_lon = init.meeting_lon as number;
    this.meet_date = new Date(init.meet_date as string);
  }

  public json(): ResponseEntry {
    return {
      id: this.id,
      title: this.title,
      body: this.body,
      date: this.date,
      number_of_people: this.number_of_people,
      is_closed: this.is_closed,
      is_matched: this.is_matched,
      shop_id: this.shop_id,
      request_people: this.request_people ?? 0, // とりあえず0にする
    };
  }

  public async jsonShopIncluded(
    db: DBOperator
  ): Promise<ShopIncludedResponseEntry> {
    const entry = this.json();

    const shop = await findShopById(db, this.shop_id);

    if (shop === null) {
      throw new ApiError(500, 'shop is not found');
    }

    return {
      ...entry,
      shop: shop,
    };
  }
}

export default Entry;
