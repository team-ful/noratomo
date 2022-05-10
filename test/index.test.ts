import {testA, sample} from '../src';

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

describe('sampleのテスト', () => {
  test('正解する', () => {
    const i = 10;
    expect(sample(i)).toEqual(100);
  });
});
