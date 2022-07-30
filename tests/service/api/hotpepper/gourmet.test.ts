import {URL} from 'url';
import {
  GourmetRequest,
  parse,
} from '../../../../src/services/api/hotpepper/gourmet';

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
});
