import argon2 from 'argon2';
import {serialize} from 'cookie';
import config from '../../config';
import {Device} from '../base/base';
import DBOperator from '../db/operator';
import {CertModel} from '../models/cret';
import {Session} from '../models/session';
import User, {UserModel} from '../models/user';
import {setCert} from '../services/cert';
import {createLoginHistory} from '../services/loginHistory';
import {createNotice} from '../services/notice';
import {createSession} from '../services/session';
import {createTestUser} from '../services/user';
import {randomText} from '../utils/random';
import {createLoginHistoryModel, createUserModel} from './models';
import {createCertModel} from './models';

export class TestUser {
  private userModel: UserModel;
  public user?: User;

  private certModel?: CertModel;
  public session?: Session;
  public password?: string;

  constructor(options?: Partial<UserModel>) {
    this.userModel = createUserModel(options);
  }

  public async create(db: DBOperator) {
    this.user = await createTestUser(db, this.userModel);
  }

  public async loginFromCateiruSSO(db: DBOperator) {
    if (typeof this.user === 'undefined') {
      throw new Error('user is undefined');
    }

    this.certModel = createCertModel({
      user_id: this.user?.id,
      cateiru_sso_id: randomText(32),
    });

    await setCert(db, this.certModel);
  }

  public async loginFromPassword(db: DBOperator) {
    if (typeof this.user === 'undefined') {
      throw new Error('user is undefined');
    }

    this.password = randomText(32);

    this.certModel = createCertModel({
      user_id: this.user?.id,
      password: await argon2.hash(this.password),
    });

    await setCert(db, this.certModel);
  }

  public async addSession(db: DBOperator) {
    if (typeof this.user === 'undefined') {
      throw new Error('user is undefined');
    }

    this.session = await createSession(db, this.user.id);

    const d = createLoginHistoryModel();
    await createLoginHistory(
      db,
      this.user.id,
      d.ip_address,
      d.device_name || Device.Desktop,
      d.os || '',
      d.is_phone || false,
      d.is_tablet || false,
      d.is_desktop || false,
      d.browser_name || 'Chrome'
    );
  }

  async notice(
    db: DBOperator,
    title: string,
    body?: string,
    url?: string
  ): Promise<number> {
    if (typeof this.user === 'undefined') {
      throw new Error('user is undefined');
    }

    return await createNotice(db, this.user.id, title, body, url);
  }

  get cateiruSSOId() {
    if (typeof this.certModel === 'undefined') {
      throw new Error('not login');
    }

    return this.certModel?.cateiru_sso_id;
  }

  get ePassword() {
    if (typeof this.certModel === 'undefined') {
      throw new Error('not login');
    }

    return this.certModel?.password;
  }

  get sessionCookie() {
    if (!this.session) {
      throw new Error('no session');
    }

    return serialize(config.sessionCookieName, this.session.session_token);
  }

  get refreshCookie() {
    if (!this.session || typeof this.session.refresh_token === 'undefined') {
      throw new Error('no session');
    }

    return serialize(config.refreshCookieName, this.session.refresh_token);
  }

  get cookie() {
    return `${this.sessionCookie}; ${this.refreshCookie}`;
  }
}
