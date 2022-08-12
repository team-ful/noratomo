import {URL} from 'url';
import type {StorageOptions} from '@google-cloud/storage';
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
  sessionTokenLen: number;
  sessionCookieName: string;
  sessionPeriodDay: number;
  sessionCookieOptions: () => CookieSerializeOptions;

  // refresh cookie
  refreshTokenLen: number;
  refreshCookieName: string;
  refreshPeriodDay: number;
  refreshCookieOptions: () => CookieSerializeOptions;

  // other information cookies
  // ログイン状態判定などに使用する
  otherCookieName: string;
  otherCookieOptions: () => CookieSerializeOptions;

  // DB
  db: ConnectionOptions;

  // Cloud Storage
  storageOptions?: StorageOptions;
  publicStorageHost: URL;
  bucketName: string;

  // hotpepper api
  hotpepperApiKey: string;
  hotpepperGourmetSearchEndpoint: URL;
  hotpepperShopSearchEndpoint: URL;

  // 店検索の検索件数
  searchCount: number;

  noraQuestionLimit: number;
  noraQuestionAllowScore: number;
}
