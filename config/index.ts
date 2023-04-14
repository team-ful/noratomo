import localConfig from './environments/local';
import piConfig from './environments/pi';
import productionConfig from './environments/production';
import testConfig from './environments/tests';

const config = () => {
  const environment = process.env.NODE_ENV;

  // pi mode
  const piMode = process.env.PI_MODE;
  if (typeof piMode !== 'undefined') {
    return piConfig;
  }

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
