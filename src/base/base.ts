import {ParsedUrlQuery} from 'querystring';
import {ClientHints} from 'client-hints';
import {parse, ParsedMediaType} from 'content-type';
import mysql from 'mysql2/promise';
import {NextApiRequest, NextApiResponse} from 'next';
import {UAParser, UAParserInstance} from 'ua-parser-js';
import config from '../../config';

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

  private contentType: ParsedMediaType;
  private ip: string;
  private userAgent: UserAgent;

  constructor(req: NextApiRequest, res: NextApiResponse<T>) {
    this.req = req;
    this.res = res;

    this.contentType = parse(this.req.headers['content-type'] || 'text/plain');
    this.ip = this.parseIp();
    this.userAgent = this.parseUA();
  }

  /**
   * DB Connectionを返す
   *
   * @returns {mysql.Connection} DB Connection
   */
  public async connectionDB() {
    const connection = await mysql.createConnection(config.db);
    await connection.connect();

    return connection;
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
   * @returns {ParsedUrlQuery} - クエリの値
   */
  public getPostForm(): ParsedUrlQuery {
    if (!this.checkContentType('application/x-www-form-urlencoded')) {
      throw new Error('no application/x-www-form-urlencoded');
    }

    return this.req.body;
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
      throw new Error('no application/(id+)?json');
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
}

export default Base;
