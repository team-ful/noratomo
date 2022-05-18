import {URL} from 'url';
import {ConnectionOptions} from 'mysql2';

export interface Config {
  environment: string;

  // APIのURL
  host: URL;

  // OAuth関連
  twitterOauthClientId: string;
  twitterOauthClientSecret: string;
  googleOauthClientId: string;
  googleOauthClientSecrete: string;

  // DB
  db: ConnectionOptions;
}
