import {URL} from 'url';
import {ConnectionOptions} from 'mysql2';
import {CookieSerializeOptions} from 'next/dist/server/web/types';

export interface Config {
  environment: string;

  // APIのURL
  host: URL;

  // OAuth関連
  cateiruSSOEndpoint: URL;
  cateiruSSOTokenEndpoint: URL;
  cateiruSSOPublicKeyEndpoint: URL;
  cateiruSSOClientId: string;
  cateiruSSOClientSecret: string;

  // session cookie
  sessionCookieName: string;
  sessionPeriodDay: number;
  sessionCookieOptions: () => CookieSerializeOptions;

  // DB
  db: ConnectionOptions;
}
