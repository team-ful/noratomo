import AuthedBase from '../base/authedBase';
import {authHandlerWrapper} from '../base/handlerWrapper';
import {External, NumberOf} from '../models/numberOf';
import {findNumberOfByUserId} from '../services/numberOf';

/**
 * 統計を返す
 *
 * @param {AuthedBase} base - base
 */
async function numberOfHandler(base: AuthedBase<External>) {
  const numberOf = await findNumberOfByUserId(await base.db(), base.user.id);
  let m;

  if (numberOf === null) {
    m = new NumberOf({
      user_id: base.user.id,
      evaluations: 0,
      entry: 0,
      meet: 0,
      application: 0,
    });
  } else {
    m = numberOf;
  }

  base.sendJson(m.external());
}

export default authHandlerWrapper(numberOfHandler, 'GET');
