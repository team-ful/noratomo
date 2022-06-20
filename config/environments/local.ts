import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'local',

  host: new URL('http://localhost:3000'),

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
  sessionPeriodDay: 7,
  sessionCookieOptions: () => {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + config.sessionPeriodDay);

    return {
      domain: 'localhost',
      expires: date,
      maxAge: config.sessionPeriodDay * 24,
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
    date.setDate(date.getDate() + config.sessionPeriodDay);

    return {
      domain: 'localhost',
      expires: date,
      maxAge: config.sessionPeriodDay * 24,
      sameSite: 'strict',
      secure: false, // テスト用であるためfalse
      httpOnly: true,
      path: '/',
    };
  },

  otherCookieName: 'noratomo-options',
  otherCookieOptions: () => {
    return {
      domain: 'localhost',
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
};

export default config;
