import localConfig from './environments/local';
import productionConfig from './environments/production';
import testConfig from './environments/tests';

const config = () => {
  const environment = process.env.ENVIRONMENT;

  switch (environment) {
    case 'local':
      return localConfig;
    case 'production':
      return productionConfig;
    case 'test':
      return testConfig;
    default:
      // とりあえずproductionにしておく
      // 根拠はない
      return productionConfig;
  }
};

export default config();
