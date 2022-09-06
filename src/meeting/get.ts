import {ApiError} from '../base/apiError';
import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {ShopIdAndRequestDataIncludedResponseEntry} from '../models/entry';
import {ExternalPublicUser} from '../models/user';
import {findEntryById} from '../services/entry';
import {findMeetByEntryId} from '../services/meet';

interface MatchEntry extends ShopIdAndRequestDataIncludedResponseEntry {
  partner: ExternalPublicUser;
  find_id: string;
}

/**
 * meet済みの情報を返す
 *
 * @param {AuthedBase} base - base
 */
async function getMeetingHandler(base: AuthedBase<MatchEntry>) {
  const entryId = base.getQuery('entry_id', true);
  const numberEntryId = parseInt(entryId);
  if (isNaN(numberEntryId)) {
    throw new ApiError(400, 'entry id is valid type');
  }

  const entry = await findEntryById(await base.db(), numberEntryId);
  if (entry === null) {
    throw new ApiError(400, 'entry is not found');
  }

  const meet = await findMeetByEntryId(await base.db(), entry.id);
  if (meet === null) {
    throw new ApiError(400, 'this entry has not yet been matched');
  }
  if (!meet.isConcernedUser(base.user.id)) {
    throw new ApiError(400, 'you are not affiliated with this match');
  }

  const shopIncludeEntry = await entry.jsonShopAndPositionIncluded(
    await base.db()
  );

  const partner = await meet.getPartner(await base.db(), base.user.id);

  base.sendJson({
    ...shopIncludeEntry,
    partner: partner,
    find_id: meet.find_id,
  });
}

export default authHandlerWrapper(getMeetingHandler);
