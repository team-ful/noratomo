/**
 * ホットペッパー APIのラッパー
 *
 * https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */
import {URL} from 'url';
import config from '../../../config';
import {
  GourmetRequest,
  GourmetResponseLite,
  parse as gourmetParse,
} from './gourmet';

export class HotPepper {
  private apiKey: string;
  private gourmetSearchEndpoint: URL;
  private shopSearchEndpoint: URL;

  constructor() {
    this.apiKey = config.hotpepperApiKey;
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

    return (await res.json()) as GourmetResponseLite;
  }
}
