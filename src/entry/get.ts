import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {ShopIncludedResponseEntry} from '../models/entry';
import {findEntryByUserId} from '../services/entry';
import {fillShop} from './entry';

/**
 * 自分が投稿した募集を取得する
 *
 * @param {AuthedBase} base - base
 */
async function getEntryHandler(base: AuthedBase<ShopIncludedResponseEntry[]>) {
  const entries = await findEntryByUserId(await base.db(), base.user.id);

  const responseEntries = await fillShop(await base.db(), entries);

  base.sendJson(responseEntries);
}

export default authHandlerWrapper(getEntryHandler);
