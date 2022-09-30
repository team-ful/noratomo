import AuthedBase from '../base/authedBase';
import {ContactDiscordBuilder} from '../services/api/discord/builder/contactBuilder';

/**
 * @param {AuthedBase} base -authedbase
 */
export async function contactUserHandler(base: AuthedBase<void>) {
  const body = await base.getPostFormFields('text', true);
  const category = await base.getPostFormFields('category', true);
  const mail = await base.getPostFormFields('mail', true);

  const discordBuilder = new ContactDiscordBuilder(mail, category, body);
  const discord = discordBuilder
    .addUser(base.user)
    .addDevice(base.getDevice())
    .addBrowser(base.getVender())
    .addIp(base.getIp())
    .addOS(base.getPlatform())
    .build();

  await discord.send();
}
