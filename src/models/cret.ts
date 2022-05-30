export interface CertModel {
  user_id: number;
  password?: string;
  cateiru_sso_id?: string;
}

class Cert implements CertModel {
  readonly user_id: number;
  readonly password?: string;
  readonly cateiru_sso_id?: string;

  constructor(init: CertModel) {
    this.user_id = init.user_id;
    this.password = init.password;
    this.cateiru_sso_id = init.cateiru_sso_id;
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
   * パスワードを比較する
   *
   * @param {string} pw - パスワード
   * @returns {boolean} - パスワードが同じ場合はtrue
   */
  public equalPassword(pw: string) {
    return this.password === pw;
  }
}

export default Cert;
