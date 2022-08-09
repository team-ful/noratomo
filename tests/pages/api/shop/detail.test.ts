import fs from 'fs';
import fetchMock from 'fetch-mock-jest';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../../../config';
import h from '../../../../pages/api/shop/detail';

describe('detail', () => {
  test('ok', async () => {
    const id = 'j1234';

    const url = config.hotpepperGourmetSearchEndpoint;
    url.searchParams.set('key', config.hotpepperApiKey);
    url.searchParams.set('id', id);
    url.searchParams.set('format', 'json');
    url.searchParams.set('type', 'lite');
    url.searchParams.set('count', '1');
    url.searchParams.set('start', '0');

    const resp = fs.readFileSync(
      './tests/service/api/hotpepper/gourmet_response_sample2.json'
    );

    fetchMock.get(url.toString(), {
      body: resp.toString(),
      headers: {
        // 何故かjsなのである
        'content-type': 'text/javascript',
      },
    });

    await testApiHandler({
      handler: h,
      url: `?id=${id}`,
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);

        expect(fetchMock).toHaveLastFetched(url.toString());

        const body = await res.json();

        expect(body.name).toBe('にゃにゃにゃ イオンレイクタウン店');
      },
    });
  });
});
