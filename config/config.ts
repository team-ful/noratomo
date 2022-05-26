import {URL} from 'url';
import {ConnectionOptions} from 'mysql2';

export interface Config {
  environment: string;

  // APIのURL
  host: URL;

  // OAuth関連
  twitterOauthEndpoint: URL;
  twitterOauthClientId: string;
  twitterOauthClientSecret: string;

  googleOauthEndpoint: URL;
  googleOauthClientId: string;
  googleOauthClientSecret: string;

  cateiruSSOEndpoint: URL;
  cateiruSSOTokenEndpoint: URL;
  cateiruSSOClientId: string;
  cateiruSSOClientSecret: string;

  // DB
  db: ConnectionOptions;
}
