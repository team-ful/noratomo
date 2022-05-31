import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'test',

  host: new URL('http://localhost:3000'),

  cateiruSSOEndpoint: new URL('https://sso.cateiru.com'),
  cateiruSSOTokenEndpoint: new URL('https://api.sso.cateiru.com/oauth/token'),
  cateiruSSOPublicKeyEndpoint: new URL(
    'https://api.sso.cateiru.com/oauth/jwt/key'
  ),
  cateiruSSOClientSecret: 'cateiru-sso-client-id',
  cateiruSSOClientId: 'cateiru-sso-client-secret',

  sessionCookieName: 'noratomo-session',
  sessionPeriodDay: 7,
  sessionCookieOptions: () => {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + config.sessionPeriodDay);

    return {
      domain: 'localhost:3000',
      expires: date,
      maxAge: config.sessionPeriodDay * 24,
      sameSite: 'strict',
      secure: false, // テスト用であるためfalse
      httpOnly: false, // クライアント側でcookieを読みたいためfalse
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
