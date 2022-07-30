import fs from 'fs';
import fetchMock from 'fetch-mock-jest';
import config from '../../../config';
import {GourmetRequest} from '../../../src/api/hotpepper/gourmet';
import {HotPepper} from '../../../src/api/hotpepper/hotpepper';
import {randomText} from '../../../src/utils/random';

describe('search', () => {
  const endpoint = config.hotpepperGourmetSearchEndpoint;
  const apiKey = randomText(10);

  test('正しく取得できる', async () => {
    const url = endpoint;
    url.searchParams.set('key', apiKey);
    url.searchParams.set('keyword', 'カフェ レイクタウン');
    url.searchParams.set('format', 'json');
    url.searchParams.set('type', 'lite');

    const resp = fs.readFileSync(
      './tests/api/hotpepper/gourmet_response_sample.json'
    );

    fetchMock.get(url.toString(), {
      body: resp.toString(),
      headers: {
        // 何故かjsなのである
        'content-type': 'text/javascript',
      },
    });

    const hotpepper = new HotPepper();

    const query: GourmetRequest = {
      key: apiKey,
      keyword: 'カフェ レイクタウン',
      type: 'lite',
    };

    const r = await hotpepper.search(query);

    expect(fetchMock).toHaveLastFetched(url.toString());

    expect(r.results.api_version).toBe('1.26');
    expect(r.results.shop.length).toBe(2);

    expect(r.results.shop[0].name).toBe('にゃにゃにゃ イオンレイクタウン店');

    fetchMock.mockClear();
  });
});
