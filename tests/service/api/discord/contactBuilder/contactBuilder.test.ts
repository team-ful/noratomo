import config from '../../../../../config';
import {ContactDiscordBuilder} from '../../../../../src/services/api/discord/builder/contactBuilder';
import {
  DiscordSendData,
  Discord,
  DiscordEmbed,
} from '../../../../../src/services/api/discord/discord';
import {createTestUser} from '../../../../../src/services/user';
import TestBase from '../../../../../src/tests/base';
import {createUserModel} from '../../../../../src/tests/models';
import {Device} from '../../../../../utils/types';

describe('discord builder', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('生成できる(非ユーザー)', () => {
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

  test('生成できる(ユーザー)', async () => {
    const dummy = await createTestUser(base.db, createUserModel());

    const mail = 'test@mail.test';
    const category = '1';
    const body = 'test \n test';

    const discordBuilder = new ContactDiscordBuilder(mail, category, body);
    const discord = discordBuilder
      .addDevice(Device.Desktop)
      .addBrowser('Safari')
      .addIp('::1')
      .addOS('Mac OS')
      .addUser(dummy)
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
      url: `${config.host.toString()}/admin/user?id=${dummy.id}`,
    };
    const testUserData: DiscordSendData = {
      embeds: [testEmbed],
    };
    if (typeof dummy !== 'undefined') {
      testUserData.avatar_url = dummy.avatar_url ?? '';
      testUserData.username = dummy.display_name || dummy.user_name;
    }

    const testSendUserData = new Discord(testUserData);
    expect(discord).toMatchObject(testSendUserData);
  });
});
