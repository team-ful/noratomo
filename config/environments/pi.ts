import {URL} from 'url';
import {Config} from '../config';

const CONNECT_URL = process.env.URL || 'localhost';

const config: Config = {
  environment: 'production-pi',

  host: new URL(`http://${CONNECT_URL}`),

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
      domain: CONNECT_URL,
      sameSite: 'strict',
      secure: false, // httpで接続するためfalse
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
      domain: CONNECT_URL,
      expires: date,
      maxAge: config.refreshPeriodDay * 86400,
      sameSite: 'strict',
      secure: false, // httpで接続するためfalse
      httpOnly: true,
      path: '/',
    };
  },

  otherCookieName: 'noratomo-options',
  otherCookieOptions: () => {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + config.refreshPeriodDay);

    return {
      domain: CONNECT_URL,
      expires: date,
      maxAge: config.refreshPeriodDay * 86400,
      sameSite: 'strict',
      secure: false, // httpで接続するためfalse
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
  publicStorageHost: new URL(`http://${CONNECT_URL}:4443`),
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
  noraQuestionAllowScore: 300,

  discordWebhookURL: process.env.DISCORD_CONTACT_URL || '',
};

export default config;
