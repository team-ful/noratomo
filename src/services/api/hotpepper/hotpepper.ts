/**
 * ホットペッパー APIのラッパー
 *
 * https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */
import {URL} from 'url';
import config from '../../../../config';
import {ApiError} from '../../../base/apiError';
import {
  GourmetRequest,
  GourmetResponseLite,
  parse as gourmetParse,
  ShopLite,
} from '../../../models/api/hotpepper/gourmet';

export class HotPepper {
  private gourmetSearchEndpoint: URL;
  private shopSearchEndpoint: URL;
  private apiKey: string;

  constructor() {
    this.gourmetSearchEndpoint = config.hotpepperGourmetSearchEndpoint;
    this.shopSearchEndpoint = config.hotpepperShopSearchEndpoint;
    this.apiKey = config.hotpepperApiKey;
  }

  public async search(query: GourmetRequest): Promise<GourmetResponseLite> {
    // レスポンスフォーマットをjsonに上書き
    query.format = 'json';
    query.type = 'lite';

    const url = gourmetParse(this.gourmetSearchEndpoint, query);

    const res = await fetch(url, {
      method: 'GET',
    });

    if (!res.ok) {
      console.error(await res.text());
      throw new ApiError(400, 'failed get hotpepper api');
    }

    const resp = await res.json();

    if (resp['results']['error']) {
      console.error(resp['results']['error']);
      throw new ApiError(400, 'failed get hotpepper api');
    }

    return resp as GourmetResponseLite;
  }

  public async findShopByKeyword(
    keyword: string,
    count: number,
    start: number
  ): Promise<GourmetResponseLite> {
    const query: GourmetRequest = {
      key: this.apiKey,
      count: count,
      start: start,
      keyword: keyword,
    };

    return await this.search(query);
  }

  public async findShopByLatLon(
    lat: string,
    lon: string,
    range: 1 | 2 | 3 | 4 | 5,
    count: number,
    start: number
  ): Promise<GourmetResponseLite> {
    try {
      const parsedLat = parseFloat(lat);
      const parsedLon = parseFloat(lon);

      if (Number.isNaN(parsedLat) || Number.isNaN(parsedLon)) {
        throw new ApiError(400, 'lat or lon is parse failed');
      }
    } catch (e) {
      if (e instanceof ApiError) {
        throw e;
      }
      throw new ApiError(400, 'lat or lon is parse failed');
    }

    const query: GourmetRequest = {
      key: this.apiKey,
      count: count,
      start: start,
      lat: lat,
      lon: lon,
      range: range,
    };

    return await this.search(query);
  }

  public async findShopById(id: string): Promise<ShopLite> {
    const query: GourmetRequest = {
      key: this.apiKey,
      id: id,
      count: 1,
    };

    const res = await this.search(query);

    if (res.results.shop.length === 0) {
      throw new ApiError(400, 'no search shop');
    }

    return res.results.shop[0];
  }
}
