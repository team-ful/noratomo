import Base from '../../base/base';
import {Discord} from '../api/discord/discord';

/**
 *
 * @param {Base} base -base
 */
export async function contactHandler(base: Base<void>) {
  const body = await base.getPostFormFields('text', true);
  const category = await base.getPostFormFields('category', true);
  const mail = await base.getPostFormFields('mail', true);
  const data = new Discord(category, body);

  data.addAuthorInfo(base, mail);
  data.sendDiscord();
}
