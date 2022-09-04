import AuthedBase from '../base/authedBase';
import {createNoticeAllUser} from '../services/notice';

/**
 * 全ユーザーに通知を送信する管理者限定機能
 *
 * @param {AuthedBase} base - base
 */
export async function contactHandler(base: AuthedBase<void>) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DISCORD_CONTACT_URL}` || '',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({content: test}),
      // # TODO: フロント→バック→Discodeで串刺にすること。(HOTpepper参考)
      // https://www.youtube.com/watch?v=-4Lid7tBr6Y
      //components/Admin/Notice.tsx
    }
  );

  //   if (res.ok) {
  //     toast({
  //       title: '送信完了 お問合せありがとうございます。',
  //       status: 'info',
  //     });

  //     setUser(u);
  //   } else {
  //     toast({
  //       title: await res.text(),
  //       status: 'error',
  //     });
  //   }
  base.adminOnly();

  const title = await base.getPostFormFields('title', true);
  const body = await base.getPostFormFields('body');
  const url = await base.getPostFormFields('url');

  await createNoticeAllUser(await base.db(), title, body, url);
}

// src/admin/notice.tsと同じ役割。discodeにフォームデータを送信する
// Contacts.tsx -> Contact.tsx(フォームデータを転送) -> contact.ts(pages/api:handler) -> sendContact.ts(src/service:データを整形してPOSTする) -> discode
