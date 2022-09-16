import {ApiError} from 'next/dist/server/api-utils';
import config from '../../../../config';
import AuthedBase from '../../../base/authedBase';

/**
 * @param {AuthedBase} base -authedbase
 */

export interface DiscordSendData {
  username?: string;
  avatar_url?: string;
  embeds: DiscordEmbed[];
}

export interface DiscordEmbed {
  color: number;
  title: string;
  description: string;
  fields: DiscordEmbedFields[];
  timestamp: string;
  url?: string;
}

export interface DiscordEmbedFields {
  name: string;
  value: string;
  inline: boolean;
}

export class Discord {
  private sendData: DiscordSendData;

  constructor(data: DiscordSendData) {
    this.sendData = data;
  }

  public async send(): Promise<void> {
    const res = await fetch(config.discordWebhookURL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(this.sendData),
    });
    if (!res.ok) {
      throw new ApiError(400, 'failed send api');
    }
  }
}
