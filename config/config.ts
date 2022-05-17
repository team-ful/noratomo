import {URL} from 'url';

export interface Config {
  environment: string;

  // APIのURL
  host: URL;

  // OAuth関連
  twitterOauthClientId: string;
  twitterOauthClientSecret: string;
  googleOauthClientId: string;
  googleOauthClientSecrete: string;
}
