import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'local',

  host: new URL('http://localhost:3000'),

  twitterOauthClientId: '',
  twitterOauthClientSecret: '',
  googleOauthClientId: '',
  googleOauthClientSecrete: '',

  db: {
    host: '127.0.0.1',
    user: 'docker',
    password: 'docker',
    database: 'noratomo',
  },
};

export default config;
