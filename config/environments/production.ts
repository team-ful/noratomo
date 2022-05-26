import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'production',

  host: new URL('http://localhost:3000'),

  twitterOauthEndpoint: new URL(''),
  twitterOauthClientId: '',
  twitterOauthClientSecret: '',
  googleOauthEndpoint: new URL(''),
  googleOauthClientId: '',
  googleOauthClientSecret: '',
  cateiruSSOEndpoint: new URL(''),
  cateiruSSOTokenEndpoint: new URL(''),
  cateiruSSOClientSecret: '',
  cateiruSSOClientId: '',

  db: {
    // TODO: 変える
    host: '127.0.0.1',
    user: 'docker',
    password: 'docker',
    database: 'noratomo',
  },
};

export default config;
