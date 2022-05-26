import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'test',

  host: new URL('http://localhost:3000'),

  twitterOauthEndpoint: new URL('https://twitter.com'),
  twitterOauthClientId: 'twitter-client-id',
  twitterOauthClientSecret: 'twitter-client-secret',
  googleOauthEndpoint: new URL('https://google.com'),
  googleOauthClientId: 'google-client-id',
  googleOauthClientSecret: 'google-client-secret',
  cateiruSSOEndpoint: new URL('https://sso.cateiru.com'),
  cateiruSSOTokenEndpoint: new URL('https://api.sso.cateiru.com/oauth/token'),
  cateiruSSOPublicKeyEndpoint: new URL(
    'https://api.sso.cateiru.com/oauth/jwt/key'
  ),
  cateiruSSOClientSecret: 'cateiru-sso-client-id',
  cateiruSSOClientId: 'cateiru-sso-client-secret',

  db: {
    host: '127.0.0.1',
    user: 'docker',
    password: 'docker',
    database: 'noratomo',
  },
};

export default config;
