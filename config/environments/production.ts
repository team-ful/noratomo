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
      maxAge: config.sessionPeriodDay * 86400,
      sameSite: 'strict',
      secure: false, // TODO: httpsにしてtrueにしたい
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
    host: 'db',
    user: 'docker',
    password: 'docker',
    database: 'noratomo',
  },
};

export default config;
