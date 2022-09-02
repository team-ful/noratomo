import {ApiError} from '../base/apiError';
import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {Application} from '../models/application';
import Entry from '../models/entry';
import {findApplicationById} from '../services/application';
import {findEntryById, matchedEntry} from '../services/entry';
import {createMeet} from '../services/meet';

/**
 * 自分で投稿した募集で、マッチさせる
 *
 * @param {AuthedBase} base - base
 */
async function matchPostHandler(base: AuthedBase<void>) {
  const entryId = await base.getPostFormFields('entry_id', true);
  const applicationId = await base.getPostFormFields('application_id', true);

  const numberEntryId = parseInt(entryId);
  if (isNaN(numberEntryId)) {
    throw new ApiError(400, 'entry_id is invalid type');
  }
  const numberApplicationId = parseInt(applicationId);
  if (isNaN(numberApplicationId)) {
    throw new ApiError(400, 'application_id is invalid type');
  }

  const entry = await findEntryById(await base.db(), numberEntryId);

  if (entry?.owner_user_id !== base.user.id) {
    throw new ApiError(400, 'you are not the owner of entry');
  }

  const application = await findApplicationById(
    await base.db(),
    numberApplicationId
  );

  if (application?.entry_id !== entry.id) {
    throw new ApiError(400, 'application does not belong to this entry');
  }

  await meet(base, entry, application);
}

/**
 * meetを作成する
 *
 * @param {AuthedBase} base - base
 * @param {Entry} entry - 募集
 * @param {Application} application - 対象のリクエスト
 */
async function meet(
  base: AuthedBase<void>,
  entry: Entry,
  application: Application
) {
  await createMeet(
    await base.db(),
    entry.id,
    base.user.id,
    application.user_id
  );

  await matchedEntry(await base.db(), entry.id);
}

export default authHandlerWrapper(matchPostHandler);
