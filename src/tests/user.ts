import {randomBytes, randomInt} from 'crypto';
import {Connection} from 'mysql2/promise';
import {CertModel} from '../models/cret';
import User, {UserModel} from '../models/user';
import {setCert} from '../services/cert';
import {createTestUser} from '../services/user';
import {createCertModel} from './cert';

/**
 * 参加日時を作成する
 *
 * @param {Date} d - date
 * @returns {Date} - 参加日時。YYYY-MM-DD HH:MM:SS形式である
 */
export function createJoinDate(d: Date): Date {
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
  const joinDate = createJoinDate(new Date(Date.now()));

  const newUser: UserModel = {
    id: option?.id || randomInt(10000), // 上書きされる
    display_name: option?.display_name || null,
    mail: option?.mail || `${randomBytes(32).toString('hex')}@example.com`,
    profile: option?.profile || null,
    user_name: option?.user_name || randomBytes(32).toString('hex'),
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

export class TestUser {
  private userModel: UserModel;
  public user?: User;

  private certModel?: CertModel;

  constructor(options?: Partial<UserModel>) {
    this.userModel = createUserModel(options);
  }

  public async create(db: Connection) {
    this.user = await createTestUser(db, this.userModel);
  }

  public async loginFromCateiruSSO(db: Connection) {
    if (typeof this.user === 'undefined') {
      throw new Error('user is undefined');
    }

    this.certModel = createCertModel({
      user_id: this.user?.id,
      cateiru_sso_id: randomBytes(32).toString('hex'),
    });

    await setCert(db, this.certModel);
  }

  get cateiruSSOId() {
    if (typeof this.certModel === 'undefined') {
      throw new Error('not login');
    }

    return this.certModel?.cateiru_sso_id;
  }

  get password() {
    if (typeof this.certModel === 'undefined') {
      throw new Error('not login');
    }

    return this.certModel?.password;
  }
}
