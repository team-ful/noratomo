import config from '../../../../../config';
import {Device} from '../../../../base/base';
import User from '../../../../models/user';
import {
  Discord,
  DiscordSendData,
  DiscordEmbed,
  DiscordEmbedFields,
} from '../discord';

export class ContactDiscordBuilder {
  private mail: string;
  private category: string;
  private body: string;

  private details: {[key: string]: string};

  private user: User | undefined;

  constructor(mail: string, category: string, body: string) {
    this.mail = mail;
    this.category = this.switchCategories(category);
    this.body = body;

    this.details = {};
  }

  private switchCategories(category: string): string {
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
        return '不明';
    }
  }

  public addUser(user: User) {
    this.user = user;
    return this;
  }

  public addDevice(device: Device) {
    this.details['デバイス'] = device;
    return this;
  }

  public addIp(ip: string) {
    this.details['IPアドレス'] = ip;
    return this;
  }

  public addOS(os: string) {
    this.details['OS'] = os;
    return this;
  }

  public addBrowser(browser: string) {
    this.details['ブラウザ'] = browser;
    return this;
  }

  public build(): Discord {
    const fields: DiscordEmbedFields[] = [];

    for (const name of Object.keys(this.details)) {
      fields.push({
        name: name,
        value: this.details[name],
        inline: false,
      });
    }

    const embed: DiscordEmbed = {
      color: 16166229,
      title: 'お問い合わせ',
      description: this.body,
      fields: [
        {
          name: 'カテゴリ',
          value: this.category,
          inline: false,
        },
        {
          name: 'メールアドレス',
          value: this.mail,
          inline: false,
        },

        ...fields,
      ],
      timestamp: new Date().toISOString(),
      url:
        typeof this.user !== 'undefined'
          ? `${config.host.toString()}/admin/user?id=${this.user.id}`
          : '',
    };

    const data: DiscordSendData = {
      embeds: [embed],
    };

    if (typeof this.user !== 'undefined') {
      data.avatar_url = this.user.avatar_url ?? '';
      data.username = this.user.display_name || this.user.user_name;
    }

    return new Discord(data);
  }
}
