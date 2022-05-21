import UserModel from '../models/user';

/**
 * ユーザ関連の操作をするクラス
 */
class User {
  private user: UserModel;

  constructor(user: UserModel) {
    this.user = user;
  }
}

export default User;
