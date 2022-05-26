import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'local',

  host: new URL('http://localhost:3000'),

  twitterOauthEndpoint: new URL(''),
  twitterOauthClientId: '',
  twitterOauthClientSecret: '',
  googleOauthEndpoint: new URL(''),
  googleOauthClientId: '',
  googleOauthClientSecret: '',
  // テスト用であるため公開している
  cateiruSSOEndpoint: new URL('https://sso.cateiru.com/sso/login'),
  cateiruSSOTokenEndpoint: new URL('https://sso.cateiru.com/oauth/token'),
  cateiruSSOPublicKeyEndpoint: new URL(
    'https://api.sso.cateiru.com/oauth/jwt/key'
  ),
  cateiruSSOClientId: '51757e0429fbc3ff1788770ee0d95d',
  cateiruSSOClientSecret:
    '0910c801ca06504e3d5d8db5b8adf81c123a40863e6749ac468e8b9f980024b0',

  db: {
    host: '127.0.0.1',
    user: 'docker',
    password: 'docker',
    database: 'noratomo',
  },
};

export default config;
