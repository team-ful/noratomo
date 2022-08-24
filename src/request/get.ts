import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {fillShop} from '../entry/entry';
import {ShopIncludedResponseEntry} from '../models/entry';
import {findApplicationsByUserId} from '../services/application';
import {findEntriesByIds} from '../services/entry';

const LIMIT = 30;

/**
 * 自分がいいねしたエントリを取得する
 *
 * @param {AuthedBase} base - base
 */
async function getRequestEntriesHandler(
  base: AuthedBase<ShopIncludedResponseEntry[]>
) {
  const requests = await findApplicationsByUserId(
    await base.db(),
    base.user.id,
    {limit: LIMIT}
  );

  if (requests.length === 0) {
    base.sendJson([]);
    return;
  }

  const entryIds = requests.map(v => v.entry_id);
  const entries = await findEntriesByIds(await base.db(), entryIds);

  const responseEntries = await fillShop(await base.db(), entries);

  base.sendJson(responseEntries);
}

export default authHandlerWrapper(getRequestEntriesHandler);
