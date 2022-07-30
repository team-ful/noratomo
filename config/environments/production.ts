import {URL} from 'url';
import {Config} from '../config';

const DB_SOCKET_PATH = process.env.DB_SOCKET_PATH || '/cloudsql';

const config: Config = {
  environment: 'production',

  host: new URL('https://noratomo.tdu.app'),

  cateiruSSOEndpoint: new URL('https://sso.cateiru.com/sso/login'),
  cateiruSSOTokenEndpoint: new URL(
    'https://api.sso.cateiru.com/v1/oauth/token'
  ),
  cateiruSSOPublicKeyEndpoint: new URL(
    'https://api.sso.cateiru.com/v1/oauth/jwt/key'
  ),
  cateiruSSOClientSecret: process.env.CATEIRU_SSO_CLIENT_SECRET || '',
  cateiruSSOClientId: process.env.CATEIRU_SSO_CLIENT_ID || '',

  sessionTokenLen: 64,
  sessionCookieName: 'noratomo-session',
  sessionPeriodDay: 1,
  sessionCookieOptions: () => {
    return {
      domain: 'noratomo.tdu.app',
      sameSite: 'strict',
      secure: true,
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
      domain: 'noratomo.tdu.app',
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
      domain: 'noratomo.tdu.app',
      expires: date,
      maxAge: config.refreshPeriodDay * 86400,
      sameSite: 'strict',
      secure: true,
      httpOnly: false,
      path: '/',
    };
  },

  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'noratomo',
    socketPath: `${DB_SOCKET_PATH}/${process.env.INSTANCE_CONNECTION_NAME}`,
  },

  // Cloud Storage
  publicStorageHost: new URL(' https://storage.googleapis.com'),
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
};

export default config;
