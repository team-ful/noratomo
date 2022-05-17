import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'test',

  host: new URL('http://localhost:3000'),

  twitterOauthClientId: 'twitter-client-id',
  twitterOauthClientSecret: 'twitter-client-secret',
  googleOauthClientId: 'google-client-id',
  googleOauthClientSecrete: 'google-client-secret',

  db: {
    host: '127.0.0.1',
    user: 'docker',
    password: 'docker',
    database: 'noratomo',
  },
};

export default config;
