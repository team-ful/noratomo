import AuthedBase from '../base/authedBase';
import Base from '../base/base';

/**
 *
 * @param {AuthedBase} abase -authedbase
 * @param {Base} base -base
 */
export async function contactHandler(base: Base<void>) {
  const body = await base.getPostFormFields('text');
  const url = await base.getPostFormFields('url');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DISCORD_CONTACT_URL}` || '',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({content: body}),
      // # TODO: フロント→バック→Discodeで串刺にすること。(HOTpepper参考)
      // https://www.youtube.com/watch?v=-4Lid7tBr6Y
      //components/Admin/Notice.tsx
    }
  );
}

// src/admin/notice.tsと同じ役割。discodeにフォームデータを送信する
// Contacts.tsx -> Contact.tsx(フォームデータを転送) -> contact.ts(pages/api:handler) -> sendContact.ts(src/service:データを整形してPOSTする) -> discode
