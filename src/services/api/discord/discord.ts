import {userInfo} from 'os';
import {ApiError} from 'next/dist/server/api-utils';
import user from '../../../../pages/api/user';
import AuthedBase from '../../../base/authedBase';
import Base from '../../../base/base';

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
  color: number;
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

  constructor(category: string, text: string, mail: string) {
    this.sendData = {
      embeds: [
        {
          color: 16166229,
          title: 'お問い合わせ',
          description: 'noratomoより以下の問い合わせ。',
          fields: [
            {
              name: category,
              value: text,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
      content: 'userInfo{}',
      tts: false,
      email: mail,
    };
  }

  public addUserInfo(base: Base<void>) {
    //ユーザー、日ユーザー共通 端末の情報を調べる。
    this.sendData.embeds[0].fields;
    const ip = base.getIp();
    const device = base.getDevice();
    const os = base.getPlatform();
    const browser = base.getVender();
    const userAgent = device + '/' + os + '/' + browser;
    // #TODO: 各値をデータに入れる。
  }

  public addUserID(base: AuthedBase<void>) {
    const id = base.user.id;
    const avatarUrl = base.user.avatar_url;
    const userName = base.user.display_name;
    // #TODO : 各データを入れる
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
    );
    if (!res.ok) {
      console.error(await res.text());
      throw new ApiError(400, 'failed sed api');
    }
  }
}
