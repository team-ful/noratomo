import argon2 from 'argon2';
import {DefaultObject} from '../db/operator';

export interface CertModel {
  user_id: number;
  password: string | null;
  cateiru_sso_id: string | null;
}

class Cert implements CertModel {
  readonly user_id: number;
  readonly password: string | null;
  readonly cateiru_sso_id: string | null;

  constructor(init: DefaultObject) {
    this.user_id = init.user_id as number;
    this.password = init.password as string | null;
    this.cateiru_sso_id = init.cateiru_sso_id as string | null;
  }

  /**
   * CateiruSSOを比較する
   *
   * @param {string} id - CateiruSSOのUser ID
   * @returns {boolean} - IDが同じ場合はtrue
   */
  public equalCateiruSSO(id: string) {
    return this.cateiru_sso_id === id;
  }

  /**
   * Argoin2のパスワードを検証する
   *
   * @param {string} pw - パスワード
   * @returns {boolean} - パスワードが同じ場合はtrue
   */
  public async equalPassword(pw: string) {
    if (!this.password) {
      return false;
    }

    return await argon2.verify(this.password, pw);
  }
}

export default Cert;
