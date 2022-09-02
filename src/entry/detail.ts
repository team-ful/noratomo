import {ApiError} from '../base/apiError';
import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {FillUserApplication} from '../models/application';
import {ShopIncludedResponseEntry} from '../models/entry';
import {findApplicationsByEntryId} from '../services/application';
import {findEntryById} from '../services/entry';

interface DetailsEntry extends ShopIncludedResponseEntry {
  applications: FillUserApplication[];
}

/**
 * entryの詳細（application）を返す
 *
 * @param {AuthedBase} base - base
 */
async function detailEntryHandler(base: AuthedBase<DetailsEntry>) {
  const entryId = base.getQuery('entry_id', true);
  const numberEntryId = parseInt(entryId);
  if (isNaN(numberEntryId)) {
    throw new ApiError(400, 'entry id is valid type');
  }

  const entry = await findEntryById(await base.db(), numberEntryId);
  if (entry === null) {
    throw new ApiError(400, 'entry is not found');
  }
  if (entry.owner_user_id !== base.user.id) {
    throw new ApiError(400, 'you are not the owner of the entry');
  }

  const shopIncludeEntry = await entry.jsonShopIncluded(await base.db());

  const applications = await findApplicationsByEntryId(
    await base.db(),
    entry.id
  );
  const userIncludeApplication = [];
  for (const application of applications) {
    userIncludeApplication.push(
      await application.jsonFillUser(await base.db())
    );
  }

  base.sendJson({
    ...shopIncludeEntry,
    applications: userIncludeApplication,
  });
}

export default authHandlerWrapper(detailEntryHandler);
