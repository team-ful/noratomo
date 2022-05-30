import {JwtPayload} from 'jsonwebtoken';
import {Connection} from 'mysql2/promise';
import {Gender} from './models/common';
import User from './models/user';
import {setCert} from './services/cert';
import {
  createUserSSO,
  findUserByCateiruSSO,
  findUserByUserID,
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
