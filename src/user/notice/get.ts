import AuthedBase from '../../base/authedBase';
import {authHandlerWrapper} from '../../base/handlerWrapper';
import {ExternalNotice} from '../../models/notice';
import {findNoReadNoticeByUserId} from '../../services/notice';

/**
 * 全通知を取得する
 *
 * @param {AuthedBase} base - base
 */
async function getNoticeHandler(base: AuthedBase<ExternalNotice[]>) {
  const notices = await findNoReadNoticeByUserId(
    await base.db(),
    base.user.id,
    50
  );

  base.sendJson(notices.map(v => v.external()));
}

export default authHandlerWrapper(getNoticeHandler);
