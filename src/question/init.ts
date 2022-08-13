import config from '../../config';
import Base from '../base/base';
import {NoraSessionJson} from '../models/noraSession';
import {findRandomNoraQuestion} from '../services/noraQuestion';
import {createNoraSession} from '../services/noraSession';

/**
 * 野良認証をトークンと一緒に取得する
 *
 * @param {Base} base - base
 */
export async function initNoraQuestionHandler(base: Base<NoraSessionJson>) {
  const questions = await findRandomNoraQuestion(
    await base.db(),
    config.noraQuestionLimit
  );

  const ids = questions.map(v => v.id);

  const token = await createNoraSession(await base.db(), ids);

  base.sendJson({
    token: token,
    question_ids: ids,
  });
}
