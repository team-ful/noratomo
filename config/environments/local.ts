import {URL} from 'url';
import {Config} from '../config';

const LOCAL_URL = process.env.URL || 'localhost';

const config: Config = {
  environment: 'local',

  host: new URL(`http://${LOCAL_URL}:3000`),

  // テスト用であるため公開している
  cateiruSSOEndpoint: new URL('https://sso.cateiru.com/sso/login'),
  cateiruSSOTokenEndpoint: new URL(
    'https://api.sso.cateiru.com/v1/oauth/token'
  ),
  cateiruSSOPublicKeyEndpoint: new URL(
    'https://api.sso.cateiru.com/v1/oauth/jwt/key'
  ),
  cateiruSSOClientId: '51757e0429fbc3ff1788770ee0d95d',
  cateiruSSOClientSecret:
    '0910c801ca06504e3d5d8db5b8adf81c123a40863e6749ac468e8b9f980024b0',

  sessionTokenLen: 64,
  sessionCookieName: 'noratomo-session',
  sessionPeriodDay: 1,
  sessionCookieOptions: () => {
    return {
      domain: LOCAL_URL,
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
      domain: LOCAL_URL,
      expires: date,
      maxAge: config.refreshPeriodDay * 86400,
      sameSite: 'strict',
      secure: false, // テスト用であるためfalse
      httpOnly: true,
      path: '/',
    };
  },

  otherCookieName: 'noratomo-options',
  otherCookieOptions: () => {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + config.refreshPeriodDay);

    return {
      domain: LOCAL_URL,
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
    database: 'noratomo',
  },

  // Cloud Storage
  storageOptions: {
    apiEndpoint: 'http://localhost:4443',
    projectId: 'local',
  },
  publicStorageHost: new URL(`http://${LOCAL_URL}:4443`),
  bucketName: 'noratomo',

  // hotpepper api
  hotpepperApiKey: process.env.HOTPEPPER_API_KEY || '',
  hotpepperGourmetSearchEndpoint: new URL(
    'http://webservice.recruit.co.jp/hotpepper/gourmet/v1'
  ),
  hotpepperShopSearchEndpoint: new URL(
    'http://webservice.recruit.co.jp/hotpepper/shop/v1'
  ),

  searchCount: 20,

  noraQuestionLimit: 5,
};

export default config;
