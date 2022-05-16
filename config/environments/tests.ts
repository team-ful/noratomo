import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'test',
  host: new URL('http://localhost:3000'),
};

export default config;
