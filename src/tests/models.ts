import {randomBytes, randomInt} from 'crypto';
import {Device} from '../base/base';
import {CertModel} from '../models/cret';
import {LoginHistoryModel} from '../models/loginHistory';
import {SessionModel} from '../models/session';
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
 * テスト用のダミーUserModelを作成する
 *
 * @param {Partial<UserModel>} option -カスタムするUserModel
 * @returns {UserModel} - 作成されたダミーのUserModelオブジェクト
 */
export function createUserModel(option?: Partial<UserModel>): UserModel {
  const joinDate = dbDate(new Date(Date.now()));

  const newUser: UserModel = {
    id: option?.id || randomInt(10000), // 上書きされる
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
  user_id: options?.user_id || randomInt(1000000),
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
    user_id: options?.user_id || randomInt(1000000),
    ip_address: options?.ip_address || '203.0.113.0', // 203.0.113.0はテスト用のIPアドレス
    device_name: options?.device_name || Device.Desktop,
    os: options?.os || 'Windows',
    is_phone: options?.is_phone || false,
    is_tablet: options?.is_tablet || false,
    is_desktop: options?.is_desktop || true,
    blowser_name: options?.blowser_name || 'Chrome',
    login_date: options?.login_date || loginDate,
  };
};
