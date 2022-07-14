import Base from '../../../src/base/base';
import {handlerWrapper} from '../../../src/base/handlerWrapper';
import {CreateAccountByPassword} from '../../../src/user/createAccount';

/**
 * パスワードを使用してアカウントを新規作成する
 *
 * @param {Base<void>} base base
 */
async function handler(base: Base<void>) {
  // TODO: 野良認証の結果の検証を先にする

  const userName = base.getPostURLForm('user_name', true);
  const mail = base.getPostURLForm('mail', true);
  const password = base.getPostURLForm('password', true);
  const age = base.getPostURLForm('age', true);
  const gender = base.getPostURLForm('gender', true);

  const ca = new CreateAccountByPassword(userName, mail, password, age, gender);

  // フォーマットが正しいかどうかチェックする
  await ca.check(await base.db());

  const user = await ca.create(await base.db());

  await base.newLogin(user);
}

export default handlerWrapper(handler, 'POST');
