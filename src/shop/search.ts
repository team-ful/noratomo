import config from '../../config';
import {ApiError} from '../base/apiError';
import Base from '../base/base';
import {
  GourmetRequest,
  GourmetResponseLite,
} from '../models/api/hotpepper/gourmet';
import {HotPepper} from '../services/api/hotpepper/hotpepper';

/**
 *
 * @param {Base} base - base
 */
export async function shopSearch(base: Base<GourmetResponseLite>) {
  const page = parseInt(base.getQuery('page') || '0') || 0;

  const count = config.searchCount;
  const start = config.searchCount * page;

  let data: GourmetResponseLite;

  const hotpepper = new HotPepper();

  // 検索キーワード
  const keyword = base.getQuery('keyword');
  if (typeof keyword === 'undefined') {
    // keywordが設定されていない場合はlat, lonを求める（必須）
    const lat = base.getQuery('lat', true);
    const lon = base.getQuery('lon', true);

    const range = base.getQuery('range') || '3';
    const parsedRange = (((parseInt(range) - 1) % 5) + 1) as 1 | 2 | 3 | 4 | 5;

    data = await hotpepper.findShopByLatLon(
      lat,
      lon,
      parsedRange,
      count,
      start
    );
  } else {
    data = await hotpepper.findShopByKeyword(keyword, count, start);
  }

  base.sendJson(data);
}
