import {Config} from '../../config/config';

describe('config', () => {
  beforeEach(() => {
    // requireのキャッシュ消す
    jest.resetModules();
  });

  afterAll(() => {
    process.env.ENVIRONMENT = '';
  });

  const expectConfig = (name: string) => {
    const config: Config = require('../../config').default;

    expect(config.environment).toBe(name);
  };

  test('local', () => {
    process.env.ENVIRONMENT = 'local';

    expectConfig('local');
  });

  test('production', () => {
    process.env.ENVIRONMENT = 'production';

    expectConfig('production');
  });

  test('test', () => {
    process.env.ENVIRONMENT = 'test';

    expectConfig('test');
  });

  test('other', () => {
    process.env.ENVIRONMENT = 'hoge';

    expectConfig('test');
  });
});
