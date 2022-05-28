import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'production',

  host: new URL('http://localhost:3000'),

  twitterOauthEndpoint: new URL('http://localhost:3000'),
  twitterOauthClientId: '',
  twitterOauthClientSecret: '',
  googleOauthEndpoint: new URL('http://localhost:3000'),
  googleOauthClientId: '',
  googleOauthClientSecret: '',
  cateiruSSOEndpoint: new URL('http://localhost:3000'),
  cateiruSSOTokenEndpoint: new URL('http://localhost:3000'),
  cateiruSSOPublicKeyEndpoint: new URL('http://localhost:3000'),
  cateiruSSOClientSecret: '',
  cateiruSSOClientId: '',

  db: {
    host: 'db',
    user: 'docker',
    password: 'docker',
    database: 'noratomo',
  },
};

export default config;
