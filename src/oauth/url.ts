import {URL} from 'url';

/**
 * OAuthログイン用のURLを生成します
 *
 * @param {string} endpoint - ログインするエンドポイント
 * @param {string} clientId - OAuth Client ID
 * @param {string} redirect - リダイレクトのURL
 * @returns {string} URL
 */
export function loginURL(
  endpoint: string,
  clientId: string,
  redirect: string
): string {
  const url = new URL(endpoint);

  url.searchParams.set('scope', 'openid');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirect);
  url.searchParams.set('prompt', 'consent');

  return url.toString();
}
