import AuthedBase from '../base/authedBase';
import {createNoticeAllUser} from '../services/notice';

/**
 * 全ユーザーに通知を送信する管理者限定機能
 *
 * @param {AuthedBase} base - base
 */
export async function noticeAllUserHandler(base: AuthedBase<void>) {
  base.adminOnly();

  const title = await base.getPostFormFields('title', true);
  const body = await base.getPostFormFields('body');
  const url = await base.getPostFormFields('url');

  await createNoticeAllUser(await base.db(), title, body, url);
}
