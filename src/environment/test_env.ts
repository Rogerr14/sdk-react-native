import { ConfigBase } from './base_config';

export default class TestEnv extends ConfigBase {
  environment: string = 'DEV';
  urlBase: string = 'https://ccapi-stg.paymentez.com';
}
