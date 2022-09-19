import fetchMock from 'fetch-mock-jest';
import config from '../../../../config';
import {ContactDiscordBuilder} from '../../../../src/services/api/discord/builder/contactBuilder';
import {
  DiscordSendData,
  Discord,
  DiscordEmbed,
} from '../../../../src/services/api/discord/discord';
import {Device} from '../../../../utils/types';

describe('discord', () => {
  const endpoint = config.discordWebhookURL;

  test('取得できる', async () => {
    fetchMock.post(endpoint, {
      status: 200,
    });

    const sendData: DiscordSendData = {
      username: '',
      avatar_url: '',
      embeds: [],
    };

    const discord = new Discord(sendData);

    await expect(discord.send()).resolves.not.toThrow();

    expect(fetchMock).toHaveLastFetched(endpoint);
  });

  test('生成できる', () => {
    const mail = 'test@mail.test';
    const category = '1';
    const body = 'test \n test';

    const discordBuilder = new ContactDiscordBuilder(mail, category, body);
    const discord = discordBuilder
      .addDevice(Device.Desktop)
      .addBrowser('Safari')
      .addIp('::1')
      .addOS('Mac OS')
      .build();

    const testEmbed: DiscordEmbed = {
      color: 16166229,
      title: 'お問い合わせ',
      description: 'test \n test',
      fields: [
        {
          name: 'カテゴリ',
          value: '機能の追加・要望',
          inline: false,
        },
        {
          name: 'メールアドレス',
          value: 'test@mail.test',
          inline: false,
        },
        {
          name: 'デバイス',
          value: 'Desktop',
          inline: false,
        },
        {
          name: 'ブラウザ',
          value: 'Safari',
          inline: false,
        },
        {
          name: 'IPアドレス',
          value: '::1',
          inline: false,
        },
        {
          name: 'OS',
          value: 'Mac OS',
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
      url: '',
    };
    const testData: DiscordSendData = {
      embeds: [testEmbed],
    };
    const testSendData = new Discord(testData);

    expect(discord).toMatchObject(testSendData);
  });
});
