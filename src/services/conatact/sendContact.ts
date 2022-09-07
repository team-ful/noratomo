import Base from '../../base/base';

/**
 *
 * @param {Base} base -base
 */
export async function contactHandler(base: Base<void>) {
  const body = 'お問合せ内容 : ' + (await base.getPostFormFields('text'));
  const category =
    'お問合せカテゴリ : ' + (await base.getPostFormFields('category'));
  const mail =
    'お客様メールアドレス : ' + (await base.getPostFormFields('mail'));
  const form = category + '\n' + body + '\n' + mail;

  const ip = base.getIp();
  const device = base.getDevice();
  const os = base.getPlatform();
  const browser = base.getVender();
  const userAgent = device + '/' + os + '/' + browser;

  const userInfo =
    '未ログインユーザー' + '\n' + 'ipアドレス ' + ip + '\n' + userAgent;

  await fetch(`${process.env.NEXT_PUBLIC_DISCORD_CONTACT_URL}` || '', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({content: form + userInfo}),
    // https://www.youtube.com/watch?v=-4Lid7tBr6Y
  });
}
