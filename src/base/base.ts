import {ParsedUrlQuery} from 'querystring';
import {URL} from 'url';
import {ClientHints} from 'client-hints';
import {parse, ParsedMediaType} from 'content-type';
import {serialize, CookieSerializeOptions} from 'cookie';
import mysql from 'mysql2/promise';
import {NextApiRequest, NextApiResponse} from 'next';
import {ApiError} from 'next/dist/server/api-utils';
import {UAParser, UAParserInstance} from 'ua-parser-js';
import config from '../../config';
import DBOperator from '../db/operator';
import User from '../models/user';
import {createLoginHistory} from '../services/loginHistory';
import {createSession} from '../services/session';

export enum Device {
  Console = 'Console',
  Mobile = 'Mobile',
  Tablet = 'Tablet',
  Desktop = 'Desktop',
  SmartTV = 'SmartTV',
  Wearable = 'Wearable',
  Embedded = 'Embedded',
}

export interface UserAgent {
  vender: string;
  platform: string;
  device: Device;
}

class Base<T> {
  public req: NextApiRequest;
  public res: NextApiResponse;

  public status: number;

  private _db?: DBOperator;

  private contentType: ParsedMediaType;
  private ip: string;
  private userAgent: UserAgent;
  private cookies: string[];
  private postBody?: ParsedUrlQuery;

  protected sessionToken?: string;
  protected refreshToken?: string;

  constructor(req: NextApiRequest, res: NextApiResponse<T>) {
    this.req = req;
    this.res = res;

    this.contentType = parse(this.req.headers['content-type'] || 'text/plain');
    this.ip = this.parseIp();
    this.userAgent = this.parseUA();

    this.cookies = [];

    // デフォルトは200を返す
    // ApiErrorでthrowした場合は別
    this.status = 200;
  }

  /**
   * DB Connectionを返す
   *
   * @returns {DBOperator} - DBOperator
   */
  public async db() {
    if (typeof this._db !== 'undefined') {
      return this._db;
    }

    const connection = await mysql.createConnection(config.db);
    await connection.connect();

    this._db = new DBOperator(connection);

    return this._db;
  }

  public async end() {
    await this._db?.end();
  }

  /**
   * クエリパラメータを取得する
   * 例: https://example.com?hoge=huga の場合、
   * value = base.getQuery('hoge')
   * // value === 'huga'
   *
   * @param {string} name - クエリ名
   * @returns {string} クエリパラメータの値
   */
  public getQuery(name: string) {
    const query = this.req.query[name];

    if (typeof query === 'undefined') {
      return undefined;
    }

    if (typeof query === 'string') {
      return query;
    }

    return query.join('');
  }

  /**
   * Content-Type: application/x-www-form-urlencoded
   * のデータを取得する
   *
   * @param {string} key - key
   * @param {boolean} require - 必須かどうか。trueの場合は存在しない場合にエラーをスローする
   * @returns {string} - クエリの値
   */
  public getPostURLForm(key: string, require: true): string;
  public getPostURLForm(key: string): string | undefined;
  public getPostURLForm(key: string, require = false): string | undefined {
    let p: ParsedUrlQuery;

    if (typeof this.postBody === 'undefined') {
      if (!this.checkContentType('application/x-www-form-urlencoded')) {
        throw new ApiError(400, 'no application/x-www-form-urlencoded');
      }

      this.postBody = this.req.body;

      p = this.req.body;
    } else {
      p = this.postBody;
    }

    const value = p[key];

    if (typeof value === 'undefined') {
      if (require) {
        throw new ApiError(400, `Illegal form value ${key}`);
      }
      return undefined;
    }

    if (typeof value === 'string') {
      return value;
    }

    return value.join('');
  }

  /**
   * Content-Type: application/json
   * のデータを取得する
   *
   * @returns {object} json
   */
  public getPostJson<T extends Object>(): T {
    if (
      !this.checkContentType('application/json') &&
      !this.checkContentType('application/ld+json')
    ) {
      throw new ApiError(400, 'no application/(id+)?json');
    }

    return this.req.body as T;
  }

  /**
   * Content-typeのヘッダをチェックする
   *
   * 参考: https://github.com/vercel/next.js/blob/1c1a4de0e2d38090fcf95ef0a6f6790006aaa124/packages/next/server/api-utils.ts#L144
   *
   * @param {string} contentType - 判定するcontent-type
   * @returns {boolean} - 引数のcontent-typeと同じであればtrue、違えばfalse
   */
  public checkContentType(contentType: string): boolean {
    return this.contentType.type === contentType.toLowerCase();
  }

  /**
   * IPアドレスをパースする
   * 取得できな勝った場合はからの文字列を返す
   *
   * @returns {string} - IPアドレスを取得する
   */
  private parseIp(): string {
    if (this.req.headers['x-forwarded-for']) {
      const address = this.req.headers['x-forwarded-for'];
      if (typeof address === 'string') {
        return address;
      }
      // 要素はカンマ区切りで、一番最初にクライアントのIPが来る
      // ref. https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/X-Forwarded-For#%E6%A7%8B%E6%96%87
      return address[0];
    }

    if (this.req.socket && this.req.socket.remoteAddress) {
      return this.req.socket.remoteAddress;
    }

    return '';
  }

  /**
   * IPアドレスを取得する
   * もし、どんな方法を使用してもIPアドレスが取得できない場合は空の文字列が返る
   *
   * @returns {string} - IPアドレスを取得する
   */
  public getIp(): string {
    return this.ip;
  }

  private parseUA(): UserAgent {
    const hints = new ClientHints(this.req.headers);
    const ua = new UAParser(this.req.headers['user-agent']);

    const vender = hints.vendorName ?? ua.getBrowser().name;
    let platform = hints.platform;
    if (hints.platform === '' || typeof hints.platform === 'undefined') {
      platform = ua.getOS().name || 'Unknown';
    }

    let device: Device;
    if (hints.mobile) {
      device = Device.Mobile;
    } else {
      device = this.parseDeviceUA(ua);
    }

    return {
      vender: vender,
      platform: platform,
      device: device,
    };
  }

  private parseDeviceUA(ua: UAParserInstance): Device {
    const deviceType = ua.getDevice().type;

    switch (deviceType) {
      case 'mobile':
        return Device.Mobile;
      case 'tablet':
        return Device.Tablet;
      case 'console':
        return Device.Console;
      case 'smarttv':
        return Device.SmartTV;
      case 'wearable':
        return Device.Wearable;
      case 'embedded':
        return Device.Embedded;
      default:
        return Device.Desktop;
    }
  }

  /**
   * ブラウザ名を取得する
   *
   * @returns {string} vernder
   */
  public getVender(): string {
    return this.userAgent.vender;
  }

  /**
   * OS名を取得する
   *
   * @returns {string} platform
   */
  public getPlatform(): string {
    return this.userAgent.platform;
  }

  /**
   * デバイスを取得する
   *
   * @returns {Device} デバイス名
   */
  public getDevice(): Device {
    return this.userAgent.device;
  }

  /**
   * Json形式で返す
   *
   * @param {object} body - json bodt
   */
  public sendJson<T extends Object>(body: T) {
    this.res.json(body);
  }

  /**
   * 引数のURLとRefererのホストが同じかどうかを判定する
   *
   * @param {URL} url - 対象のURL
   * @returns {boolean} 同じ場合、true。違う場合はfalse
   */
  public checkReferer(url: URL): boolean {
    const referer = this.req.headers['referer'];

    if (typeof referer === 'undefined') {
      return false;
    }

    let refererURL: URL;
    try {
      refererURL = new URL(referer);
    } catch (e) {
      throw new ApiError(400, 'no parse referer url');
    }

    return refererURL.hostname === url.hostname;
  }

  /**
   * Cookieを設定する
   *
   * @param {string} name - cookie name
   * @param {string} value - cookie value
   * @param {CookieSerializeOptions} options - cookie options
   */
  public setCookie(
    name: string,
    value: string,
    options?: CookieSerializeOptions
  ) {
    this.cookies.push(serialize(name, value, options));

    this.res.setHeader('Set-Cookie', this.cookies);
  }

  /**
   * Cookieを削除する
   *
   * @param {string} name - cookie name
   * @param {CookieSerializeOptions} options - cookie options
   */
  public clearCookie(name: string, options?: CookieSerializeOptions) {
    const d = new Date(Date.now());
    d.setHours(d.getHours() - 1);

    this.cookies.push(
      serialize(name, '', {
        ...options,
        expires: d,
        maxAge: -1,
      })
    );

    this.res.setHeader('Set-Cookie', this.cookies);
  }

  /**
   * Cookieを取得する
   *
   * @param {string} name - cookie name
   * @returns {string | undefined} cookie value 存在しない場合はundefined
   */
  public getCookie(name: string): string | undefined {
    return this.req.cookies[name];
  }

  /**
   * 新規にログインする
   *
   * @param {User} user - user
   */
  public async newLogin(user: User) {
    const session = await createSession(await this.db(), user.id);

    if (typeof session.refresh_token === 'undefined') {
      throw new ApiError(500, 'refresh_token is empty');
    }

    await this.saveLoginHistory(user.id);

    this.sessionToken = session.session_token;
    this.refreshToken = session.refresh_token;

    this.setCookie(
      config.sessionCookieName,
      session.session_token,
      config.sessionCookieOptions()
    );

    this.setCookie(
      config.refreshCookieName,
      session.refresh_token,
      config.refreshCookieOptions()
    );

    const options = 'true';

    this.setCookie(
      config.otherCookieName,
      options,
      config.otherCookieOptions()
    );
  }

  /**
   * ログイン履歴を保存する
   *
   * @param {number} userID - ユーザID
   */
  private async saveLoginHistory(userID: number) {
    const deviceName = this.getDevice();
    const os = this.getPlatform();
    const isPhone = deviceName === Device.Mobile;
    const isTablet = deviceName === Device.Tablet;
    const isDesktop = deviceName === Device.Desktop;
    const browserName = this.getVender();

    await createLoginHistory(
      await this.db(),
      userID,
      this.ip,
      deviceName,
      os,
      isPhone,
      isTablet,
      isDesktop,
      browserName
    );
  }

  /**
   * methodを判定する
   *
   * @param {string} m - 判定するmethod
   */
  public checkMethod(m: string) {
    const _m = this.req.method;

    if (typeof m !== 'string' || _m?.toLocaleLowerCase() !== m.toLowerCase()) {
      throw new ApiError(400, 'That HTTP method is not supported');
    }
  }
}

export default Base;
