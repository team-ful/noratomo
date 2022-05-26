import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'test',

  host: new URL('http://localhost:3000'),

  twitterOauthEndpoint: 'https://twitter.com',
  twitterOauthClientId: 'twitter-client-id',
  twitterOauthClientSecret: 'twitter-client-secret',
  googleOauthEndpoint: 'https://google.com',
  googleOauthClientId: 'google-client-id',
  googleOauthClientSecret: 'google-client-secret',
  cateiruSSOEndpoint: 'https://sso.cateiru.com',
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
