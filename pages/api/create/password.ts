import {object, string, number, array} from '@mojotech/json-type-validation';
import config from '../../../config';
import {ApiError} from '../../../src/base/apiError';
import Base from '../../../src/base/base';
import {handlerWrapper} from '../../../src/base/handlerWrapper';
import {validateNoraQuestion} from '../../../src/question/validate';
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

  const score = await validateNoraQuestion(
    await base.db(),
    form.token,
    form.answers
  );

  // 野良認証の回答がしきい値以下の場合はエラー
  if (score < config.noraQuestionAllowScore) {
    throw new ApiError(403, 'failed nora question');
  }

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
