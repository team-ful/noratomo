import {object, string, number, array} from '@mojotech/json-type-validation';
import Base from '../../../src/base/base';
import {handlerWrapper} from '../../../src/base/handlerWrapper';
import {CreateAccountByPassword} from '../../../src/user/createAccount';

export const jsonForm = object({
  user_name: string(),
  mail: string(),
  password: string(),
  age: number(),
  gender: number(),

  token: string(),
  answers: array(
    object({
      id: number(),
      answer_index: number(),
    })
  ),
});

/**
 * パスワードを使用してアカウントを新規作成する
 *
 * @param {Base<void>} base base
 */
async function handler(base: Base<void>) {
  const form = base.getPostJson(jsonForm);

  const ca = new CreateAccountByPassword(
    form.user_name,
    form.mail,
    form.password,
    form.age,
    form.gender
  );

  // フォーマットが正しいかどうかチェックする
  await ca.check(await base.db());

  const user = await ca.create(await base.db());

  await base.newLogin(user);
}

export default handlerWrapper(handler, 'POST');
