import {URL} from 'url';
import {JwtPayload, verify, VerifyOptions} from 'jsonwebtoken';
import {ApiError} from 'next/dist/server/api-utils';
import config from '../../../config';

export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: string;
  id_token: string;
}

export interface JWTPublicKey {
  pkcs8: string;
}

export class JWT {
  private code: string;
  private redirect: URL;
  private option: VerifyOptions;

  constructor(code: string) {
    this.code = code;

    const redirect = config.host;
    redirect.pathname = '/api/oauth/login/cateirusso';

    this.redirect = redirect;

    this.option = {
      algorithms: ['RS256'],
    };
  }

  /**
   * JWTを復号する
   *
   * @returns {JwtPayload} - 復号したJWT
   */
  public async parse(): Promise<JwtPayload> {
    const jwtToken = await this.getJWT();
    const publicKey = await this.getPublicKey();

    let j: JwtPayload = {};

    verify(jwtToken, publicKey, this.option, (err, decoded) => {
      if (err) {
        throw new ApiError(400, 'no decryption jwt');
      } else {
        j = decoded as JwtPayload;
      }
    });

    return j;
  }

  /**
   * JWTを取得する
   *
   * @returns {string} JWT token
   */
  private async getJWT(): Promise<string> {
    const url = config.cateiruSSOTokenEndpoint;
    url.searchParams.set('grant_type', 'authorization_code');
    url.searchParams.set('code', this.code);
    url.searchParams.set('redirect_uri', this.redirect.toString());

    const req = await fetch(url.toString(), {
      headers: {
        Authorization: `Basic ${config.cateiruSSOClientSecret}`,
      },
    });

    if (req.status !== 200) {
      throw new ApiError(400, 'no connected cateirusso token endpoint');
    }

    const key = await req.json();

    if (this.isTokenResponse(key)) {
      return key.id_token;
    }
    return '';
  }

  /**
   * 変数がTokenResponse型かどうかを半手する
   *
   * @param {unknown} value - 判定する変数
   * @returns {boolean} 判定結果
   */
  private isTokenResponse(value: unknown): value is TokenResponse {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    return true;
  }

  /**
   * JWT復号用の公開鍵を取得する
   *
   * @returns {string} - JWT Public key
   */
  private async getPublicKey(): Promise<string> {
    const resp = await fetch(config.cateiruSSOPublicKeyEndpoint.toString());

    if (resp.status !== 200) {
      throw new ApiError(
        400,
        'no connected cateirusso JWT Public key endpoint'
      );
    }

    const key = await resp.json();

    if (this.isJWTPublicKey(key)) {
      return key.pkcs8;
    }

    return '';
  }

  /**
   * 変数がJWTPublicKey型かどうかを半手する
   *
   * @param {unknown} value - 判定する変数
   * @returns {boolean} 判定結果
   */
  private isJWTPublicKey(value: unknown): value is JWTPublicKey {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    return true;
  }
}
