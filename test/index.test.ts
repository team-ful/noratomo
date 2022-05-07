import {testA} from '../src';

describe('testAのテスト', () => {
  test('huga', () => {
    const a = 10;
    expect(testA(a)).toEqual('huga');
  });

  test('hoge', () => {
    const a = 0;
    expect(testA(a)).toEqual('hoge');
  });
});
