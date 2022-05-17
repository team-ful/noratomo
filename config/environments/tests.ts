import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'test',

  host: new URL('http://localhost:3000'),

  twitterOauthClientId: 'twitter-client-id',
  twitterOauthClientSecret: 'twitter-client-secret',
  googleOauthClientId: 'google-client-id',
  googleOauthClientSecrete: 'google-client-secret',
};

export default config;
