import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'production',

  host: new URL('http://localhost:3000'),

  twitterOauthClientId: '',
  twitterOauthClientSecret: '',
  googleOauthClientId: '',
  googleOauthClientSecrete: '',

  db: {
    host: 'db',
    user: 'docker',
    password: 'docker',
    database: 'noratomo',
  },
};

export default config;
