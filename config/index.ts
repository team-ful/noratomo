import localConfig from './environments/local';
import productionConfig from './environments/production';
import testConfig from './environments/tests';

const config = () => {
  const environment = process.env.NODE_ENV;

  console.log(`ENV: ${environment}`);

  switch (environment) {
    case 'development':
      return localConfig;
    case 'production':
      return productionConfig;
    default:
      return testConfig;
  }
};

export default config();
