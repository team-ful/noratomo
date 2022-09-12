import {ApiError} from 'next/dist/server/api-utils';
import AuthedBase from '../../../base/authedBase';
import Base from '../../../base/base';

/**
 * @param {AuthedBase} base -authedbase
 */

interface DiscordSendData {
  username?: string;
  avatar_url?: string;
  embeds: DiscordEmbed[];
  tts: boolean;
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

  constructor(category: string, text: string) {
    this.sendData = {
      embeds: [
        {
          color: 16166229,
          title: 'お問い合わせ',
          description: 'noratomoより以下の問い合わせ。',
          fields: [
            {
              name: 'カテゴリ：' + this.switchCategories(category),
              value: text,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
      tts: false,
    };
  }

  private switchCategories(category: string) {
    switch (category) {
      case '1':
        return '機能の追加・要望';
      case '2':
        return 'マッチングについて';
      case '3':
        return '募集について';
      case '4':
        return 'サービスについて';
      case '5':
        return 'エラー・バグの報告';
      case '6':
        return 'その他';
      default:
        break;
    }
  }

  public addAuthorInfo(base: Base<void>, mail: string) {
    const ip = base.getIp();
    const device = base.getDevice();
    const os = base.getPlatform();
    const browser = base.getVender();
    const userInfo =
      device + '/' + os + '/' + browser + '\n IPアドレス  \n' + ip;

    this.sendData.embeds[0].fields.push({
      name: '投稿者情報',
      value: userInfo + '\n メールアドレス \n' + mail,
      inline: false,
    });
  }

  public addUserInfo(base: AuthedBase<void>, mail: string) {
    this.addAuthorInfo(base, mail);

    const id = base.user.id;
    const avatarUrl = base.user.avatar_url;
    const userName = base.user.display_name;
    const userInfo = 'UserID#' + id + ' ' + userName;

    this.sendData.username = userInfo ?? '不明';
    this.sendData.avatar_url = avatarUrl ?? '不明';
  }

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
