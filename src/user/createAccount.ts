import argon2 from 'argon2';
import {JwtPayload} from 'jsonwebtoken';
import {Connection} from 'mysql2/promise';
import {ApiError} from 'next/dist/server/api-utils';
import DBOperator from '../db/operator';
import {Gender, gender as pg} from './../models/common';
import {CertModel} from './../models/cret';
import User from './../models/user';
import {setCert} from './../services/cert';
import {
  createUserPW,
  createUserSSO,
  findUserByCateiruSSO,
  findUserByUserID,
  findUserByUserNameAndMail,
  UpdateOption,
  updateUser,
} from './../services/user';
import * as check from './../syntax/check';

export class CreateAccountBySSO {
  private displayName: string;
  private userName: string;
  private mail: string;
  private isAdmin: boolean;
  private avatarURL: string;
  private ssoId: string;

  private db: DBOperator;

  constructor(db: DBOperator, data: JwtPayload) {
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
      return await this.update(user.id);
    }

    return await this.createUser();
  }

  /**
   * ユーザを更新する
   *
   * @param {number} id - user id
   * @returns {Promise<User>} - user
   */
  private async update(id: number): Promise<User> {
    const option: UpdateOption = {};

    // 設定で更新できるようになったのでログインごとに上書きされてほしくない
    // if (this.displayName) {
    //   option['display_name'] = this.displayName;
    // }
    // if (this.mail) {
    //   option['mail'] = this.mail;
    // }
    if (this.isAdmin) {
      option['is_admin'] = this.isAdmin;
    }
    // if (this.avatarURL) {
    //   option['avatar_url'] = this.avatarURL;
    // }

    await updateUser(this.db, id, option);

    return await findUserByUserID(this.db, id);
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
   * @param {DBOperator} db - database
   */
  public async check(db: DBOperator) {
    check.checkUserName(this.userName);
    check.checkMail(this.mail);
    check.checkAge(this.age);
    check.checkPW(this.password);

    if (
      (await findUserByUserNameAndMail(db, this.userName, this.mail)) !== null
    ) {
      throw new ApiError(400, 'user is already exists');
    }
  }

  /**
   * パスワード認証でユーザを新規作成する
   *
   * @param {Connection} db - database
   * @returns {User} - ユーザ
   */
  public async create(db: DBOperator): Promise<User> {
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
