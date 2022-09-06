import AuthedBase from '../../base/authedBase';

/**
 * @param {AuthedBase} abase -authedbase
 */
export async function contactUserHandler(abase: AuthedBase<void>) {
  const body = await abase.getPostFormFields('text');
  const category = await abase.getPostFormFields('category');
  const mail = await abase.getPostFormFields('mail');
  const form = category + '\n' + body + '\n' + mail;

  const ip = abase.getIp();
  const device = abase.getDevice();
  const os = abase.getPlatform();
  const browser = abase.getVender();
  const userAgent = device + '/' + os + '/' + browser;
  const id = abase.user.id;
  const userInfo =
    'ユーザーID :' + id + '\n' + 'ipアドレス ' + ip + '\n' + userAgent;

  await fetch(`${process.env.NEXT_PUBLIC_DISCORD_CONTACT_URL}` || '', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({content: form + '\n' + userInfo}),

    // https://www.youtube.com/watch?v=-4Lid7tBr6Y
    //components/Admin/Notice.tsx
  });
}

// src/admin/notice.tsと同じ役割。discodeにフォームデータを送信する
// Contacts.tsx -> Contact.tsx(フォームデータを転送) -> contact.ts(pages/api:handler) -> sendContact.ts(src/service:データを整形してPOSTする) -> discode
