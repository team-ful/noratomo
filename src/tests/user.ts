import {randomBytes} from 'crypto';
import argon2 from 'argon2';
import {serialize} from 'cookie';
import {Connection} from 'mysql2/promise';
import config from '../../config';
import {CertModel} from '../models/cret';
import {Session} from '../models/session';
import User, {UserModel} from '../models/user';
import {setCert} from '../services/cert';
import {createSession} from '../services/session';
import {createTestUser} from '../services/user';
import {randomText} from '../utils/random';
import {createUserModel} from './models';
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

  public async create(db: Connection) {
    this.user = await createTestUser(db, this.userModel);
  }

  public async loginFromCateiruSSO(db: Connection) {
    if (typeof this.user === 'undefined') {
      throw new Error('user is undefined');
    }

    this.certModel = createCertModel({
      user_id: this.user?.id,
      cateiru_sso_id: randomText(32),
    });

    await setCert(db, this.certModel);
  }

  public async loginFromPassword(db: Connection) {
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

  public async addSession(db: Connection) {
    if (typeof this.user === 'undefined') {
      throw new Error('user is undefined');
    }

    this.session = await createSession(db, this.user.id);
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
}
