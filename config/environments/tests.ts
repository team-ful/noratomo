import {URL} from 'url';
import {Config} from '../config';

const LOCAL_URL = process.env.URL || 'localhost';

const config: Config = {
  environment: 'test',

  host: new URL('http://localhost:3000'),

  cateiruSSOEndpoint: new URL('https://sso.cateiru.com'),
  cateiruSSOTokenEndpoint: new URL(
    'https://api.sso.cateiru.com/v1/oauth/token'
  ),
  cateiruSSOPublicKeyEndpoint: new URL(
    'https://api.sso.cateiru.com/v1/oauth/jwt/key'
  ),
  cateiruSSOClientSecret: 'cateiru-sso-client-id',
  cateiruSSOClientId: 'cateiru-sso-client-secret',

  sessionTokenLen: 64,
  sessionCookieName: 'noratomo-session',
  sessionPeriodDay: 1,
  sessionCookieOptions: () => {
    return {
      domain: 'localhost',
      sameSite: 'strict',
      secure: false, // テスト用であるためfalse
      httpOnly: true,
      path: '/',
    };
  },

  refreshTokenLen: 128,
  refreshCookieName: 'noratomo-refresh',
  refreshPeriodDay: 30,
  refreshCookieOptions: () => {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + config.refreshPeriodDay);

    return {
      domain: 'localhost',
      expires: date,
      maxAge: config.refreshPeriodDay * 86400,
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      path: '/',
    };
  },

  otherCookieName: 'noratomo-options',
  otherCookieOptions: () => {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + config.refreshPeriodDay);

    return {
      domain: 'localhost',
      expires: date,
      maxAge: config.refreshPeriodDay * 86400,
      sameSite: 'strict',
      secure: false,
      httpOnly: false,
      path: '/',
    };
  },

  db: {
    host: '127.0.0.1',
    user: 'docker',
    password: 'docker',
    database: 'test',
  },

  // Cloud Storage
  storageOptions: {
    apiEndpoint: 'http://localhost:4443',
    // projectId: 'test',
  },
  publicStorageHost: new URL(`http://${LOCAL_URL}:4443`),
  bucketName: 'noratomo',

  // hotpepper api
  hotpepperApiKey: 'api_key',
  hotpepperGourmetSearchEndpoint: new URL(
    'http://webservice.recruit.co.jp/hotpepper/gourmet/v1'
  ),
  hotpepperShopSearchEndpoint: new URL(
    'http://webservice.recruit.co.jp/hotpepper/shop/v1'
  ),

  searchCount: 20,

  noraQuestionLimit: 5,
  noraQuestionAllowScore: 300,

  discordWebhookURL: 'https://example.com',
};

export default config;
