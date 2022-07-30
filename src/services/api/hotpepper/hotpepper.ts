/**
 * ホットペッパー APIのラッパー
 *
 * https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */
import {URL} from 'url';
import {ApiError} from 'next/dist/server/api-utils';
import config from '../../../../config';
import {
  GourmetRequest,
  GourmetResponseLite,
  parse as gourmetParse,
} from './gourmet';

export class HotPepper {
  private gourmetSearchEndpoint: URL;
  private shopSearchEndpoint: URL;

  constructor() {
    this.gourmetSearchEndpoint = config.hotpepperGourmetSearchEndpoint;
    this.shopSearchEndpoint = config.hotpepperShopSearchEndpoint;
  }

  public async search(query: GourmetRequest) {
    // レスポンスフォーマットをjsonに上書き
    query.format = 'json';

    const url = gourmetParse(this.gourmetSearchEndpoint, query);

    const res = await fetch(url, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new ApiError(400, await res.text());
    }

    const resp = await res.json();

    if (resp['results']['error']) {
      throw new ApiError(400, JSON.stringify(resp['results']['error']));
    }

    return resp as GourmetResponseLite;
  }
}
