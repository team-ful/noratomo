import {ApiError} from 'next/dist/server/api-utils';
import {parseDate} from '../../../../utils/parse';
import AuthedBase from '../../../base/authedBase';

/**
 * @param {AuthedBase} base -authedbase
 */

interface DiscordSendData {
  username?: string; //ログインしているなら
  avatar_url?: string;
  content: string; //カテゴリ 必須
  embeds: DiscordEmbed[]; //こっちに問い合わせ本文 必須あり
  tts: boolean; //基本的にfalse
  email: string; //メール 必須
}

interface DiscordEmbed {
  color: string;
  title: string;
  description: string;
  fields: [
    {
      name: string;
      value: string;
      inline: boolean;
    }
  ];
  timestamp: string;
}

export class Discord {
  private sendData: DiscordSendData;

  constructor(base: AuthedBase<void>) {
    this.sendData = {
      content: 'category',
      embeds: [
        {
          color: '16166229',
          title: 'お問い合わせ',
          description: 'noratomoより以下の問い合わせ。',
          fields: [
            {
              name: 'name',
              value: 'text',
              inline: false,
            },
          ],
          timestamp: parseDate(new Date()),
        },
      ],
      tts: false,
      email: 'mail',
    };
  }

  public addUserMail(mail: string) {
    this.sendData.email = mail;
  }
  public addCategory(category: string) {
    this.sendData.content = category;
  }

  public addFormData(name: string, text: string) {
    this.sendData.embeds[0].fields[0] = {
      name: name,
      value: text,
      inline: false,
    };
  }

  //ディスコードに送る
  public async sendDiscord(): Promise<void> {
    const data = this.sendData;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DISCORD_CONTACT_URL}` || '',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      }
      // {
      //   method: 'POST',
      //   headers: {
      //     'content-type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     content: 'Hello, World!',
      //     tts: false,
      //     embeds: [
      //       {
      //         title: 'Hello, Embed!',
      //         description: 'This is an embedded message.',
      //       },
      //     ],
      //   }),
      // }
    );
    if (!res.ok) {
      console.error(await res.text());
      console.log(JSON.stringify({data}));
      throw new ApiError(400, 'failed sed api');
    }
  }
}
