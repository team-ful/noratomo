import AuthedBase from '../../base/authedBase';
import {Discord} from '../api/discord/discord';

/**
 * @param {AuthedBase} base -authedbase
 */
export async function contactUserHandler(base: AuthedBase<void>) {
  const body = await base.getPostFormFields('text', true);
  const category = await base.getPostFormFields('category', true);
  const mail = await base.getPostFormFields('mail', true);

  //フォームないのデータを入れる
  const data = new Discord(category, body, mail);
  //IPなどのユーザー情報を入れる。
  data.addUserInfo(base);
  data.sendDiscord();
}
