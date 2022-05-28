import {Config} from '../../config/config';

describe('config', () => {
  beforeEach(() => {
    // requireのキャッシュ消す
    jest.resetModules();
  });

  const expectConfig = (name: string) => {
    const config: Config = require('../../config').default;

    expect(config.environment).toBe(name);
  };

  test('test', () => {
    process.env.ENVIRONMENT = 'test';

    expectConfig('test');
  });
});
