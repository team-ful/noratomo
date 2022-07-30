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
}
