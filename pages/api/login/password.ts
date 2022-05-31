import {ApiError} from 'next/dist/server/api-utils';
import Base from '../../../src/base/base';
import {handlerWrapper} from '../../../src/base/handlerWrapper';
import User from '../../../src/models/user';
import {findCertByUserID} from '../../../src/services/cert';
import {findUserByMail, findUserByUserName} from '../../../src/services/user';

/**
 * パスワードを検証してログインする
 *
 * @param {Base<void>} base base
 */
async function handler(base: Base<void>) {
  const userName = base.getPostForm('user');
  const password = base.getPostForm('password');

  let user: User | null;

  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      userName
    )
  ) {
    user = await findUserByMail(await base.db(), userName);
  } else {
    user = await findUserByUserName(await base.db(), userName);
  }

  // ユーザが存在しない場合は400を返す
  if (!user) {
    throw new ApiError(400, 'not found user');
  }

  const cert = await findCertByUserID(await base.db(), user.id);

  // 認証情報がない場合（そんなことは存在しないはずだけど）は400を返す
  if (!cert) {
    throw new ApiError(400, 'not certification');
  }

  if (await cert.equalPassword(password)) {
    await base.newLogin(user);
  } else {
    throw new ApiError(403, 'The password is incorrect');
  }
}

export default handlerWrapper(handler, 'POST');
