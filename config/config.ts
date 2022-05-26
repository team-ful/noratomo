import {URL} from 'url';
import {ConnectionOptions} from 'mysql2';

export interface Config {
  environment: string;

  // APIのURL
  host: URL;

  // OAuth関連
  twitterOauthEndpoint: string;
  twitterOauthClientId: string;
  twitterOauthClientSecret: string;

  googleOauthEndpoint: string;
  googleOauthClientId: string;
  googleOauthClientSecret: string;

  cateiruSSOEndpoint: string;
  cateiruSSOClientId: string;
  cateiruSSOClientSecret: string;

  // DB
  db: ConnectionOptions;
}
