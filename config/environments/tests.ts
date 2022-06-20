import {URL} from 'url';
import {Config} from '../config';

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
      httpOnly: false, // クライアント側でcookieを読みたいためfalse
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
      httpOnly: false, // クライアント側でcookieを読みたいためfalse
      path: '/',
    };
  },

  db: {
    host: '127.0.0.1',
    user: 'docker',
    password: 'docker',
    database: 'test',
  },
};

export default config;
