import AuthedBase from '../../base/authedBase';
import {Discord} from '../api/discord/discord';

/**
 * @param {AuthedBase} base -authedbase
 */
export async function contactUserHandler(base: AuthedBase<void>) {
  const body = await base.getPostFormFields('text', true);
  const category = await base.getPostFormFields('category', true);
  const mail = await base.getPostFormFields('mail', true);

  const data = new Discord(category, body);
  data.addUserInfo(base, mail);
  data.sendDiscord();
}
