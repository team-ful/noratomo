import {URL} from 'url';
import {
  GourmetRequest,
  parse,
} from '../../../../src/models/api/hotpepper/gourmet';

describe('gourmet', () => {
  const endpoint = new URL(
    'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/'
  );

  test('parse', () => {
    const sample1: GourmetRequest = {
      key: 'aaaa',
      name: 'hogehoge',

      order: 2,
      start: 0,
      count: 20,
    };

    const parsed = parse(endpoint, sample1);

    expect(parsed.searchParams.get('key')).toBe(sample1.key);
    expect(parsed.searchParams.get('name')).toBe(sample1.name);

    expect(parsed.searchParams.get('order')).toBe(String(sample1.order));
    expect(parsed.searchParams.get('start')).toBe(String(sample1.start));
    expect(parsed.searchParams.get('count')).toBe(String(sample1.count));

    expect(parsed.searchParams.get('child')).toBeNull();
  });

  test('エンコードされる', () => {
    const query: GourmetRequest = {
      key: 'aaaa',
      keyword: '日本語の文章',
    };

    const parsed = parse(endpoint, query);

    expect(parsed.toString()).not.toEqual(
      expect.stringMatching(/日本語の文章/)
    );

    expect(parsed.toString()).toEqual(
      expect.stringMatching(
        /%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AE%E6%96%87%E7%AB%A0/
      )
    );
  });
});
