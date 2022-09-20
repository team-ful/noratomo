import fetchMock from 'fetch-mock-jest';
import config from '../../../../config';
import {
  DiscordSendData,
  Discord,
} from '../../../../src/services/api/discord/discord';

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
});
