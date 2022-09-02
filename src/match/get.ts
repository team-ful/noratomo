import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {fillShop} from '../entry/entry';
import {ShopIncludedResponseEntry} from '../models/entry';
import {findEntriesByIds} from '../services/entry';
import {findMeetsByApplyUserId} from '../services/meet';

/**
 * 自分がリクエストしてマッチされたエントリを返す
 *
 * @param {AuthedBase} base - base
 */
async function getMatchedEntries(
  base: AuthedBase<ShopIncludedResponseEntry[]>
) {
  const meets = await findMeetsByApplyUserId(await base.db(), base.user.id);

  if (meets.length === 0) {
    base.sendJson([]);
    return;
  }

  const entryIds = meets.map(v => v.entry_id);
  const entries = await findEntriesByIds(await base.db(), entryIds);

  const responseEntries = await fillShop(await base.db(), entries);

  base.sendJson(responseEntries);
}

export default authHandlerWrapper(getMatchedEntries);
