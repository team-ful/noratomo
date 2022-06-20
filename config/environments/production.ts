import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'production',

  host: new URL('http://localhost:3000'),

  cateiruSSOEndpoint: new URL('http://localhost:3000'),
  cateiruSSOTokenEndpoint: new URL('http://localhost:3000'),
  cateiruSSOPublicKeyEndpoint: new URL('http://localhost:3000'),
  cateiruSSOClientSecret: '',
  cateiruSSOClientId: '',

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
      secure: false, // TODO: httpsにしてtrueにしたい
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
    host: 'db',
    user: 'docker',
    password: 'docker',
    database: 'noratomo',
  },
};

export default config;
