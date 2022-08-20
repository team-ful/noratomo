import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {ShopIncludedResponseEntry} from '../models/entry';
import {findAllEntries} from '../services/entry';
import {fillShop} from './entry';

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
  const entries = await findAllEntries(await base.db(), LIMIT, OFFSET);

  const responseEntries = await fillShop(await base.db(), entries);

  base.cache(DAY_SECOND, HOUR_SECOND);
  base.sendJson(responseEntries);
}

export default authHandlerWrapper(getAllEntriesHandler, 'GET');
