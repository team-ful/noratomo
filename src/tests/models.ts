import {randomBytes, randomInt} from 'crypto';
import {Device} from '../base/base';
import {CertModel} from '../models/cret';
import {EntryModel} from '../models/entry';
import {LoginHistoryModel} from '../models/loginHistory';
import {NoticeModel} from '../models/notice';
import {SessionModel} from '../models/session';
import {ShopModel} from '../models/shop';
import {UserModel} from '../models/user';
import {randomText} from '../utils/random';

/**
 * 参加日時を作成する
 *
 * @param {Date} d - date
 * @returns {Date} - 参加日時。YYYY-MM-DD HH:MM:SS形式である
 */
export function dbDate(d: Date): Date {
  d.setMilliseconds(0); // MySQLのDATETIMEはYYYY-MM-DD HH:MM:SSでありmilisecondは含まれない

  return d;
}

/**
 * ユーザIDを作成する
 *
 * @returns {number} - ユーザID
 */
export const createUserID = () => randomInt(100000);

/**
 * テスト用のダミーUserModelを作成する
 *
 * @param {Partial<UserModel>} option -カスタムするUserModel
 * @returns {UserModel} - 作成されたダミーのUserModelオブジェクト
 */
export function createUserModel(option?: Partial<UserModel>): UserModel {
  const joinDate = dbDate(new Date(Date.now()));

  const newUser: UserModel = {
    id: option?.id || createUserID(), // 上書きされる
    display_name: option?.display_name || null,
    mail: option?.mail || `${randomText(32)}@example.com`,
    profile: option?.profile || null,
    user_name:
      option?.user_name ||
      randomBytes(16).reduce((p, i) => p + (i % 36).toString(36), ''),
    age: option?.age || null,
    gender: option?.gender || 1,
    is_ban: option?.is_ban || null,
    is_penalty: option?.is_penalty || null,
    is_admin: option?.is_admin || null,
    join_date: option?.join_date || joinDate,
    avatar_url: option?.avatar_url || null,
  };

  return newUser;
}
/**
 * ダミーのSessionModelを作成する
 *
 * @param {Partial<SessionModel>} options - option
 * @returns {SessionModel} session model
 */
export const createSessionModel = (
  options?: Partial<SessionModel>
): SessionModel => {
  const now = dbDate(new Date(Date.now()));
  const period = dbDate(new Date(Date.now()));
  period.setDate(period.getDate() + 7);

  return {
    session_token: options?.session_token || randomText(128),
    refresh_token: options?.refresh_token,
    date: options?.date || now,
    period_date: options?.period_date || period,
    user_id: options?.user_id || randomInt(100000),
  };
};

/**
 * ダミーのCertオブジェクトを作成する
 *
 * @param {Partial<CertModel>} options - オプション
 * @returns {CertModel} cert
 */
export const createCertModel = (options?: Partial<CertModel>): CertModel => ({
  user_id: options?.user_id || createUserID(),
  cateiru_sso_id: options?.cateiru_sso_id || null,
  password: options?.password || null,
});

/**
 * ダミーのログイン履歴オブジェクトを作成する
 *
 * @param {Partial<LoginHistoryModel>} options - オプション
 * @returns {LoginHistoryModel} ログイン履歴
 */
export const createLoginHistoryModel = (
  options?: Partial<LoginHistoryModel>
): LoginHistoryModel => {
  const loginDate = dbDate(new Date(Date.now()));

  return {
    id: options?.id || randomInt(1000000),
    user_id: options?.user_id || createUserID(),
    ip_address: options?.ip_address || '203.0.113.0', // 203.0.113.0はテスト用のIPアドレス
    device_name: options?.device_name || Device.Desktop,
    os: options?.os || 'Windows',
    is_phone: options?.is_phone || false,
    is_tablet: options?.is_tablet || false,
    is_desktop: options?.is_desktop || true,
    browser_name: options?.browser_name || 'Chrome',
    login_date: options?.login_date || loginDate,
    'INET6_NTOA(ip_address)': options?.ip_address || '203.0.113.0', // 203.0.113.0はテスト用のIPアドレス
  };
};

/**
 * ダミーのショップオブジェクトを作成する
 *
 * @param {Partial<ShopModel>} options - オプション
 * @returns {ShopModel} ショップモデル
 */
export const createShopModel = (options?: Partial<ShopModel>): ShopModel => {
  return {
    id: options?.id || randomInt(1000000),
    name: options?.name || randomText(10),
    address: options?.address || randomText(20),
    lat: options?.lat || randomInt(50),
    lon: options?.lon || randomInt(50),
    genre_name: options?.genre_name || randomText(10),
    genre_catch: options?.genre_catch || null,
    gender: options?.gender || false,
    site_url: options?.site_url || randomText(20),
    photo_url: options?.photo_url || null,
    hotpepper_id: options?.hotpepper_id || randomText(20),
  };
};

/**
 * ダミーのentryオブジェクトを作成する
 *
 * @param {Partial<EntryModel>} options - オプション
 * @returns {EntryModel} entry model
 */
export const createEntryModel = (options?: Partial<EntryModel>): EntryModel => {
  return {
    id: options?.id || randomInt(1000000),
    owner_user_id: options?.owner_user_id || randomInt(1000000),
    title: options?.title || randomText(20),
    shop_id: options?.shop_id || randomInt(1000000),
    number_of_people: options?.number_of_people || 1, // 設計上1になる
    date: options?.date || dbDate(new Date(Date.now())),
    body: options?.body || randomText(30),
    is_closed: options?.is_closed || false,
  };
};

export const createNoticeModel = (
  options?: Partial<NoticeModel>
): NoticeModel => {
  return {
    id: options?.id || randomInt(1000000),
    user_id: options?.user_id || randomInt(1000000),
    title: options?.title || randomText(10),
    text: options?.text || null,
    url: options?.url || null,
    is_read: options?.is_read || false,
  };
};
