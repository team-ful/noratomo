import Base from '../base/base';
import {ContactDiscordBuilder} from '../services/api/discord/builder/contactBuilder';

/**
 *
 * @param {Base} base -base
 */
export async function contactHandler(base: Base<void>) {
  const body = await base.getPostFormFields('text', true);
  const category = await base.getPostFormFields('category', true);
  const mail = await base.getPostFormFields('mail', true);

  const discordBuilder = new ContactDiscordBuilder(mail, category, body);
  const discord = discordBuilder
    .addDevice(base.getDevice())
    .addBrowser(base.getVender())
    .addIp(base.getIp())
    .addOS(base.getPlatform())
    .build();

  await discord.send();
}
