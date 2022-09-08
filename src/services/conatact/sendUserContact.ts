import AuthedBase from '../../base/authedBase';
import {Discord} from '../api/discord/discord';

/**
 * @param {AuthedBase} base -authedbase
 */
export async function contactUserHandler(base: AuthedBase<void>) {
  const body = await base.getPostFormFields('text', true);
  const category = await base.getPostFormFields('category', true);
  const mail = await base.getPostFormFields('mail', true);

  const data = new Discord(base);
  data.addCategory(category);
  data.addFormData(category, body);

  // const form = category + '\n' + body + '\n' + mail;
  // const ip = base.getIp();
  // const device = base.getDevice();
  // const os = base.getPlatform();
  // const browser = base.getVender();
  // const userAgent = device + '/' + os + '/' + browser;
  // const id = base.user.id;
  // const userInfo =
  //   'ユーザーID :' + id + '\n' + 'ipアドレス ' + ip + '\n' + userAgent;

  data.sendDiscord();
}
