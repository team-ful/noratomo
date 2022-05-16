import {URL} from 'url';
import {Config} from '../config';

const config: Config = {
  environment: 'local',
  host: new URL('http://localhost:3000'),
};

export default config;
