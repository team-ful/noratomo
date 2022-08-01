import fs from 'fs';
import fetchMock from 'fetch-mock-jest';
import config from '../../../../config';
import {GourmetRequest} from '../../../../src/models/api/hotpepper/gourmet';
import {HotPepper} from '../../../../src/services/api/hotpepper/hotpepper';
import {randomText} from '../../../../src/utils/random';

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
      './tests/service/api/hotpepper/gourmet_response_sample.json'
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

  test('apiの接続で失敗する（200以外が返ってくる', async () => {
    const url = endpoint;
    url.searchParams.set('key', apiKey);
    url.searchParams.set('keyword', 'かふぇええええ');
    url.searchParams.set('format', 'json');
    url.searchParams.set('type', 'lite');

    fetchMock.get(url.toString(), {
      status: 400,
      body: 'ああああ',
    });

    const hotpepper = new HotPepper();

    const query: GourmetRequest = {
      key: apiKey,
      keyword: 'かふぇええええ',
      type: 'lite',
    };

    await expect(hotpepper.search(query)).rejects.toThrow(
      'failed get hotpepper api'
    );

    expect(fetchMock).toHaveLastFetched(url.toString());

    fetchMock.mockClear();
  });

  test('apiの接続で失敗する（200で返ってくる', async () => {
    const url = endpoint;
    url.searchParams.set('key', '');
    url.searchParams.set('keyword', 'カフェ レイクタウン');
    url.searchParams.set('format', 'json');
    url.searchParams.set('type', 'lite');

    fetchMock.get(url.toString(), {
      status: 200,
      body: '{"results":{"api_version":"1.26","error":[{"code":2000,"message":"APIキーが正しくありません"}]}}',
    });

    const hotpepper = new HotPepper();

    const query: GourmetRequest = {
      key: '',
      keyword: 'カフェ レイクタウン',
      type: 'lite',
    };

    await expect(hotpepper.search(query)).rejects.toThrow(
      'failed get hotpepper api'
    );

    expect(fetchMock).toHaveLastFetched(url.toString());

    fetchMock.mockClear();
  });
});

describe('findShopByKeyword', () => {
  const endpoint = config.hotpepperGourmetSearchEndpoint;
  const apiKey = config.hotpepperApiKey;

  test('ok', async () => {
    const url = endpoint;
    url.searchParams.set('key', apiKey);
    url.searchParams.set('keyword', '猫');
    url.searchParams.set('format', 'json');
    url.searchParams.set('type', 'lite');
    url.searchParams.set('count', '20');
    url.searchParams.set('start', '0');

    const resp = fs.readFileSync(
      './tests/service/api/hotpepper/gourmet_response_sample.json'
    );

    fetchMock.get(url.toString(), {
      body: resp.toString(),
      headers: {
        // 何故かjsなのである
        'content-type': 'text/javascript',
      },
    });

    const hotpepper = new HotPepper();

    const result = await hotpepper.findShopByKeyword('猫', 20, 0);

    expect(fetchMock).toHaveLastFetched(url.toString());

    expect(result.results.api_version).toBe('1.26');
    expect(result.results.shop.length).toBe(2);

    expect(result.results.shop[0].name).toBe(
      'にゃにゃにゃ イオンレイクタウン店'
    );

    fetchMock.mockClear();
  });
});

describe('findShopByLatLon', () => {
  const endpoint = config.hotpepperGourmetSearchEndpoint;
  const apiKey = config.hotpepperApiKey;

  test('ok', async () => {
    const lat = '1000.000';
    const lon = '10000.00';

    const url = endpoint;
    url.searchParams.set('key', apiKey);
    url.searchParams.set('lat', lat);
    url.searchParams.set('lon', lon);
    url.searchParams.set('range', '3');
    url.searchParams.set('format', 'json');
    url.searchParams.set('type', 'lite');
    url.searchParams.set('count', '20');
    url.searchParams.set('start', '0');

    const resp = fs.readFileSync(
      './tests/service/api/hotpepper/gourmet_response_sample.json'
    );

    fetchMock.get(url.toString(), {
      body: resp.toString(),
      headers: {
        // 何故かjsなのである
        'content-type': 'text/javascript',
      },
    });

    const hotpepper = new HotPepper();

    const result = await hotpepper.findShopByLatLon(lat, lon, 3, 20, 0);

    expect(fetchMock).toHaveLastFetched(url.toString());

    expect(result.results.api_version).toBe('1.26');
    expect(result.results.shop.length).toBe(2);

    expect(result.results.shop[0].name).toBe(
      'にゃにゃにゃ イオンレイクタウン店'
    );

    fetchMock.mockClear();
  });

  test('lat lonの形式が不正の場合はエラー', async () => {
    const lat = '10.00000';
    const lon = 'hello';

    const hotpepper = new HotPepper();

    await expect(
      hotpepper.findShopByLatLon(lat, lon, 3, 20, 0)
    ).rejects.toThrow('lat or lon is parse failed');
  });
});

describe('findShopById', () => {
  const endpoint = config.hotpepperGourmetSearchEndpoint;
  const apiKey = config.hotpepperApiKey;

  test('ok', async () => {
    const id = 'j1234';

    const url = endpoint;
    url.searchParams.set('key', apiKey);
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

    const hotpepper = new HotPepper();

    const result = await hotpepper.findShopById(id);

    expect(fetchMock).toHaveLastFetched(url.toString());

    expect(result.name).toBe('にゃにゃにゃ イオンレイクタウン店');

    fetchMock.mockClear();
  });
});
