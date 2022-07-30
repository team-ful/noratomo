import {URL} from 'url';

/**
 * ホットペッパーグルメサーチAPIのリクエストクエリ
 */
export interface GourmetRequest extends HotpepperRequestApi {
  // お店ID
  id?: string;
  // 掲載店名
  name?: string;
  // 掲載店名かな
  name_kana?: string;
  // 掲載店名 or かな
  name_any?: string;
  // 電話番号 ハイフンなしの半角数字
  tel?: string;
  // 住所
  address?: string;

  /**
   * 特集別
   * 特集マスタAPIから取得
   */
  // 特集
  special?: string;
  // 特集2
  special_or?: string;
  // 特集カテゴリ
  special_category?: string;
  // 特集カテゴリ2
  special_category_or?: string;

  /**
   * エリアに割り当てられたコード番号で検索。
   * コード番号についてはエリアマスタAPI参照
   */
  // 大サービスエリアコード
  large_service_area?: string;
  // サービスエリアコード
  service_area?: string;
  // 大エリアコード
  large_area?: string;
  // 中エリアコード
  middle_area?: string;
  // 小エリアコード
  small_area?: string;

  keyword?: string;

  // 位置
  lat?: number;
  lon?: number;
  // lat, lonからの検索範囲を指定する
  // 1: 300m, 2: 500m, 3: 1000m(default), 4: 2000m, 5: 3000m
  range?: 1 | 2 | 3 | 4 | 5;
  // 測地系 world: 世界測地系(default), tokyo: 旧日本測地系
  datum?: 'world' | 'tokyo';

  /**
   * カテゴリ別絞り込み
   */
  // 携帯クーポン掲載 初期値false
  ktai_coupon?: boolean;
  // お店ジャンルコード
  genre?: string;
  // 検索用ディナー予算コード
  budget?: string;
  // 宴会収容人数
  party_capacity?: number;
  // wifiの有無 初期値false
  wifi?: boolean;
  // ウェディング二次会等
  wedding?: boolean;
  // コースあり
  course?: boolean;
  // 飲み放題
  free_drink?: boolean;
  // 食べ放題
  free_food?: boolean;
  // 個室あり
  private_room?: boolean;
  // 掘りごたつあり
  horigotatsu?: boolean;
  // 座敷あり
  tatami?: boolean;
  // カクテル充実
  cocktail?: boolean;
  // 焼酎充実
  shochu?: boolean;
  // 日本酒重質
  sake?: boolean;
  // ワイン充実
  wine?: boolean;
  // カード可
  card?: boolean;
  // 禁煙席
  non_smoking?: boolean;
  // 貸し切り
  charter?: boolean;
  // 携帯電話OK
  ktai?: boolean;
  // 駐車場あり
  parking?: boolean;
  // バリアフリー
  barrier_free?: boolean;
  // ソムリエがいる
  sommelier?: boolean;
  // 夜景がきれい
  night_view?: boolean;
  // オープンエア
  open_air?: boolean;
  // ライブ・ショーあり
  show?: boolean;
  // エンタメ設備
  equipment?: boolean;
  // カラオケあり
  karaoke?: boolean;
  // バンド演奏可
  band?: boolean;
  // TV・プロジェクター
  tv?: boolean;
  // ランチあり
  lunch?: boolean;
  // 23時以降も営業
  midnight?: boolean;
  // 23時以降食事OK
  midnight_meal?: boolean;
  // 英語メニューあり
  english?: boolean;
  // ペット可
  pet?: boolean;
  // お子様連れOK
  child?: boolean;

  // クレジットカードの種類ごとに絞り込み
  // → クレジットカードマスタAPI参照
  credit_card?: boolean;

  // 出力タイプ
  // - lite: 主要項目のみ
  // - credit_card: クレジットカードをレスポンスに付加
  // - special: 特集をレスポンスに付加
  // - 指定なし: すべて
  type?: 'lite' | 'credit_card' | 'special';

  // ソート順序
  // - 1: 店名かな順
  // - 2: ジャンルコード順
  // - 3: 少エリアコード順
  // - 4: オススメ順(default)
  order?: 1 | 2 | 3 | 4;
  // 検索結果の何件目から出力するか。offset
  start?: number;
  // 取得数 1 <= x <= 100
  count?: number;
  // レスポンス形式
  format?: 'xml' | 'json' | 'jsonp';
}

export interface HotpepperRequestApi {
  key: string;
}

export interface GourmetResponseLite {
  results: {
    api_version: string;

    // 検索結果の全件数
    results_available: number;
    // 返される結果の件数
    results_returned: string;
    // 検索結果の開始位置
    results_start: number;

    shop: ShopLite[];
  };
}

export interface ShopLite {
  // お店ID
  id: string;

  // 掲載店名
  name: string;
  address: string;

  // 位置
  lat: number;
  lon: number;

  // 料金備考
  budget_memo: string;
  // その他設備
  other_memo: string;
  // 備考
  shop_detail_memo: string;
  photo: {
    pc: {
      l: string;
      m: string;
      s: string;
    };
  };

  // ジャンル
  genre: {
    // ジャンル名
    name: string;
    // ジャンルキャッチ
    catch: string;
  };
  // キャッチ
  catch: string;
  // 交通アクセス
  access: string;
  // 店舗URL
  urls: {
    // PC向け
    pc: {
      l: string;
      m: string;
      s: string;
    };
  };
}

/**
 * ホットペッパーグルメサーチAPIのリクエストURLを作成する
 *
 * @param {URL} endpoint - グルメサーチAPIのエンドポイント
 * @param {GourmetRequest} q - リクエストするクエリ
 * @returns {URL} リクエストURL
 */
export function parse(endpoint: URL, q: GourmetRequest): URL {
  const e = endpoint;

  // require
  e.searchParams.set('key', q.key);

  for (const key of Object.keys(q)) {
    set(key as keyof GourmetRequest, e, q);
  }

  return e;
}

/**
 * セットする
 *
 * @param {string} key - 対象key
 * @param {URL} u - url
 * @param {GourmetRequest} q - クエリ
 */
function set(key: keyof GourmetRequest, u: URL, q: GourmetRequest) {
  const value = q[key];
  if (typeof value !== 'undefined') {
    if (typeof value === 'boolean') {
      u.searchParams.set(key, String(Number(value)));
      return;
    }

    u.searchParams.set(key, String(value));
  }
}
