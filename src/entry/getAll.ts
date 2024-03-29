import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {ShopIncludedResponseEntry} from '../models/entry';
import {findAllEntries} from '../services/entry';
import {fillShopAndRequest} from './entry';

const LIMIT = 30;
const OFFSET = 0;

const DAY_SECOND = 86400;
const HOUR_SECOND = 3600;

/**
 * すべてのエントリを取得する
 *
 * @param {AuthedBase} base - base
 */
async function getAllEntriesHandler(
  base: AuthedBase<ShopIncludedResponseEntry[]>
) {
  const entries = await findAllEntries(
    await base.db(),
    base.user.id,
    LIMIT,
    OFFSET
  );

  const responseEntries = await fillShopAndRequest(
    await base.db(),
    entries,
    base.user.id
  );

  base.cache(DAY_SECOND, HOUR_SECOND);
  base.sendJson(responseEntries);
}

export default authHandlerWrapper(getAllEntriesHandler, 'GET');
