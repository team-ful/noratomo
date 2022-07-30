import fs from 'fs';
import fetchMock from 'fetch-mock-jest';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../config';
import {handlerWrapper} from '../../src/base/handlerWrapper';
import {shopSearch} from '../../src/shop/search';

describe('shop', () => {
  const endpoint = config.hotpepperGourmetSearchEndpoint;
  const apiKey = config.hotpepperApiKey;
  const resp = fs.readFileSync(
    './tests/service/api/hotpepper/gourmet_response_sample.json'
  );

  test('keywordで検索できる', async () => {
    const keyword = 'カフェ レイクタウン';

    const url = endpoint;
    url.searchParams.set('key', apiKey);
    url.searchParams.set('keyword', keyword);
    url.searchParams.set('format', 'json');
    url.searchParams.set('type', 'lite');
    url.searchParams.set('count', '20');
    url.searchParams.set('start', '0');

    fetchMock.get(url.toString(), {
      body: resp.toString(),
      headers: {
        // 何故かjsなのである
        'content-type': 'text/javascript',
      },
    });

    const h = handlerWrapper(shopSearch);

    await testApiHandler({
      handler: h,
      url: `?keyword=${encodeURIComponent('カフェ レイクタウン')}`,
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);

        expect(fetchMock).toHaveLastFetched(url.toString());

        const body = await res.json();

        expect(body.results.api_version).toBe('1.26');
        expect(body.results.shop.length).toBe(2);

        expect(body.results.shop[0].name).toBe(
          'にゃにゃにゃ イオンレイクタウン店'
        );
      },
    });

    fetchMock.mockClear();
  });

  test('lat, lonで検索できる', async () => {
    const lat = 10;
    const lon = 20;

    const url = endpoint;
    url.searchParams.set('key', apiKey);
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
    url.searchParams.set('range', '3');
    url.searchParams.set('format', 'json');
    url.searchParams.set('type', 'lite');
    url.searchParams.set('count', '20');
    url.searchParams.set('start', '0');

    fetchMock.get(url.toString(), {
      body: resp.toString(),
      headers: {
        // 何故かjsなのである
        'content-type': 'text/javascript',
      },
    });

    const h = handlerWrapper(shopSearch);

    await testApiHandler({
      handler: h,
      url: `?lat=${lat}&lon=${lon}}`,
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);

        expect(fetchMock).toHaveLastFetched(url.toString());

        const body = await res.json();

        expect(body.results.api_version).toBe('1.26');
        expect(body.results.shop.length).toBe(2);

        expect(body.results.shop[0].name).toBe(
          'にゃにゃにゃ イオンレイクタウン店'
        );
      },
    });

    fetchMock.mockClear();
  });

  test('pageを指定できる', async () => {
    const keyword = 'カフェ レイクタウン';

    const url = endpoint;
    url.searchParams.set('key', apiKey);
    url.searchParams.set('keyword', keyword);
    url.searchParams.set('format', 'json');
    url.searchParams.set('type', 'lite');
    url.searchParams.set('count', '20');
    url.searchParams.set('start', '0');
    url.searchParams.set('start', '40'); // 20 * 2

    fetchMock.get(url.toString(), {
      body: resp.toString(),
      headers: {
        // 何故かjsなのである
        'content-type': 'text/javascript',
      },
    });

    const h = handlerWrapper(shopSearch);

    await testApiHandler({
      handler: h,
      url: `?keyword=${encodeURIComponent('カフェ レイクタウン')}&page=2`,
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);

        expect(fetchMock).toHaveLastFetched(url.toString());

        const body = await res.json();

        expect(body.results.api_version).toBe('1.26');
        expect(body.results.shop.length).toBe(2);

        expect(body.results.shop[0].name).toBe(
          'にゃにゃにゃ イオンレイクタウン店'
        );
      },
    });

    fetchMock.mockClear();
  });
});
