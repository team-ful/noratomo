import Base from '../../../src/base/base';
import {handlerWrapper} from '../../../src/base/handlerWrapper';
import {CreateAccountByPassword} from '../../../src/createAccount';

/**
 * パスワードを使用してアカウントを新規作成する
 *
 * @param {Base<void>} base base
 */
async function handler(base: Base<void>) {
  // TODO: 野良認証の結果の検証を先にする

  const userName = base.getPostForm('user_name');
  const mail = base.getPostForm('mail');
  const password = base.getPostForm('password');
  const age = base.getPostForm('age');
  const gender = base.getPostForm('gender');

  const ca = new CreateAccountByPassword(userName, mail, password, age, gender);

  // フォーマットが正しいかどうかチェックする
  await ca.check(await base.db());

  const user = await ca.create(await base.db());

  await base.newLogin(user);
}

export default handlerWrapper(handler, 'POST');
