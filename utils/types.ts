export interface User {
  display_name: string;
  mail: string;
  profile: string;
  user_name: string;
  age: number;
  gender: number;
  is_admin: boolean;
  avatar_url: string;
  join_date: Date;
  notice: Notice[];
}

export interface Notice {
  id: number;
  title: string;
  is_read: boolean;
  created: Date;
  text?: string;
  url?: string;
}

export interface Question {
  id: number;
  question_title: string;
  answers: {index: number; answerText: string}[];
  current_answer_index: number;
  score: number;
}

export interface AdminUser extends User {
  id: number;
  is_ban: boolean;
  is_penalty: boolean;
}

export interface Shop {
  // お店ID
  id: string;

  // 掲載店名
  name: string;
  address: string;

  // 位置
  lat: number;
  lng: number;

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
    pc: string;
  };
}

export interface Shops {
  results: {
    api_version: string;

    // 検索結果の全件数
    results_available: number;
    // 返される結果の件数
    results_returned: string;
    // 検索結果の開始位置
    results_start: number;

    shop: Shop[];
  };
}

export interface Entry {
  id: number;

  title: string;
  body: string | null;
  date: Date;
  number_of_people: number;
  is_closed: boolean;
  shop_id: number;
  request_people: number;

  shop: {
    address: string;
    gender: boolean;
    genre_catch: string | null;
    genre_name: string;
    hotpepper_id: string | null;
    id: number;
    lat: number;
    lon: number;
    name: string;
    photo_url: string | null;
    site_url: string;
  };
}

export interface HomeEntry extends Entry {
  is_owner: boolean;
}

export enum Device {
  Console = 'Console',
  Mobile = 'Mobile',
  Tablet = 'Tablet',
  Desktop = 'Desktop',
  SmartTV = 'SmartTV',
  Wearable = 'Wearable',
  Embedded = 'Embedded',
}

export interface LoginHistoryUserElements {
  id: number;
  ip_address: string;
  device_name: Device | null;
  os: string | null;
  is_phone: boolean | null;
  is_desktop: boolean | null;
  is_tablet: boolean | null;
  browser_name: string | null;
  login_date: Date;
}

export interface NoraSession {
  token: string;
  question_ids: number[];
}

export interface NoraQuestionExternal {
  id: number;

  // 問題のタイトル
  question_title: string;

  // 答えの選択肢
  answers: NoraQuestionSelect[];
}

export interface NoraQuestionSelect {
  index: number;
  answerText: string;
}

export interface NoraQuestionAnswer {
  id: number;
  answer_index: number;
}

export interface CreateAccountPostForm {
  user_name: string;
  mail: string;
  password: string;
  age: number;
  gender: number;

  token: string;
  answers: NoraQuestionAnswer[];
}

export interface NumberOf {
  evaluations: number;
  entry: number;
  meet: number;
  application: number;
}
