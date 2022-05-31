import argon2 from 'argon2';
import {JwtPayload} from 'jsonwebtoken';
import {Connection} from 'mysql2/promise';
import {ApiError} from 'next/dist/server/api-utils';
import {Gender, gender as pg} from './models/common';
import {CertModel} from './models/cret';
import User from './models/user';
import {setCert} from './services/cert';
import {
  createUserPW,
  createUserSSO,
  findUserByCateiruSSO,
  findUserByMail,
  findUserByUserID,
  findUserByUserName,
} from './services/user';

export class CreateAccountBySSO {
  private displayName: string;
  private userName: string;
  private mail: string;
  private isAdmin: boolean;
  private avatarURL: string;
  private ssoId: string;

  private db: Connection;

  constructor(db: Connection, data: JwtPayload) {
    this.displayName = data['name'];
    this.userName = data['preferred_username'];
    this.mail = data['email'];
    // CateiruSSOのロールに`noratomo`がある場合は管理者
    this.isAdmin = (data['role'] as string).split(' ').includes('noratomo');
    this.avatarURL = data['picture'];
    this.ssoId = data['id'];

    this.db = db;
  }

  /**
   * Cateiru SSOでログインする
   * もし、新規ログインの場合はアカウントを新しく作成する
   *
   * @returns {User} user
   */
  async login(): Promise<User> {
    const user = await findUserByCateiruSSO(this.db, this.ssoId);

    if (user) {
      return user;
    }

    return await this.createUser();
  }

  /**
   * SSOで新規にログインしたユーザのアカウントを作成する
   *
   * @returns {User} - user
   */
  private async createUser(): Promise<User> {
    const userId = await createUserSSO(
      this.db,
      this.displayName,
      this.mail,
      this.userName,
      Gender.NotNone,
      this.isAdmin,
      this.avatarURL
    );

    await setCert(this.db, {
      user_id: userId,
      cateiru_sso_id: this.ssoId,
      password: null,
    });

    return await findUserByUserID(this.db, userId);
  }
}

export class CreateAccountByPassword {
  private userName: string;
  private mail: string;
  private password: string;
  private age: number;
  private gender: Gender;

  constructor(
    userName: string,
    mail: string,
    password: string,
    age: string,
    gender: string
  ) {
    this.userName = userName;
    this.mail = mail;
    this.password = password;

    try {
      this.age = parseInt(age);
    } catch (e) {
      throw new ApiError(400, 'parse failed age');
    }

    try {
      this.gender = pg(parseInt(gender));
    } catch (e) {
      throw new ApiError(400, 'parse failed aender');
    }
  }

  /**
   * フォーマットが正しいか、ユーザ名やメールアドレスがすでに存在していないかどうかをチェックする
   *
   * @param {Connection} db - database
   */
  public async check(db: Connection) {
    // ユーザ名は3文字以上63文字以下
    const userNameLen = this.userName.length;
    if (userNameLen < 3 || userNameLen >= 64) {
      throw new ApiError(400, 'user name is 3 <= x < 64');
    }

    // ログイン時に同じフォーム内でメールアドレスとユーザ名を入れるので
    // ユーザ名にメールアドレスとお同じフォーマットで来られると困る
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        this.userName
      )
    ) {
      throw new ApiError(400, 'not user name format');
    }

    // メールアドレスが正しいフォーマットかどうかを判定する
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        this.mail
      )
    ) {
      throw new ApiError(400, 'not email format');
    }

    // 年齢は0以下はありえない
    // また、2022年現在150歳の人間はいない
    if (this.age < 0 || this.age >= 150) {
      throw new ApiError(400, 'not age format');
    }

    // パスワードは10文字異常127文字以下
    const passwordLen = this.password.length;
    if (passwordLen >= 10 && passwordLen < 128) {
      throw new ApiError(400, 'password is 10 <= x < 128');
    }

    // TODO: ここSQLで WHERE user_id = ? AND mail = ? ってしたい
    const userNameUser = await findUserByUserName(db, this.userName);
    if (userNameUser !== null) {
      throw new ApiError(400, 'user name is already exist');
    }

    // 何故かこのメソッドをfindUserByUserNameの前に持ってくると、
    // `Can't add new command when connection is in closed state` エラーが起きる
    // TODO: 原因究明
    const mailUser = await findUserByMail(db, this.mail);
    if (mailUser !== null) {
      throw new ApiError(400, 'mail is already exist');
    }
  }

  /**
   * パスワード認証でユーザを新規作成する
   *
   * @param {Connection} db - database
   * @returns {User} - ユーザ
   */
  public async create(db: Connection): Promise<User> {
    const userID = await createUserPW(
      db,
      this.mail,
      this.userName,
      this.gender,
      this.age
    );

    const hashPW = await argon2.hash(this.password);

    const c: CertModel = {
      user_id: userID,
      password: hashPW,
      cateiru_sso_id: null,
    };

    await setCert(db, c);

    return await findUserByUserID(db, userID);
  }
}
