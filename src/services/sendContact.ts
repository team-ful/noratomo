import AuthedBase from '../base/authedBase';
import Base from '../base/base';

/**
 *
 * @param {AuthedBase} abase -authedbase
 * @param {Base} base -base
 */
export async function contactHandler(base: Base<void>) {
  const body = await base.getPostFormFields('text');
  const category = await base.getPostFormFields('category');
  const mail = await base.getPostFormFields('mail');

  const form = category + '\n' + body + '\n' + mail;
  const ip = base.getIp;
  const userAgent = base.getDevice;

  // #TODO:userIDをどうするか。 主にログインの判断

  base.status;

  await fetch(`${process.env.NEXT_PUBLIC_DISCORD_CONTACT_URL}` || '', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({content: form}),
    // # TODO: フロント→バック→Discodeで串刺にすること。(HOTpepper参考)
    // https://www.youtube.com/watch?v=-4Lid7tBr6Y
    //components/Admin/Notice.tsx
  });
}

// src/admin/notice.tsと同じ役割。discodeにフォームデータを送信する
// Contacts.tsx -> Contact.tsx(フォームデータを転送) -> contact.ts(pages/api:handler) -> sendContact.ts(src/service:データを整形してPOSTする) -> discode
