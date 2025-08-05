import { ConfigBase } from "./base_config";



export default class ProdEnv extends ConfigBase{
    environment: string = 'PROD';
    urlBase: string = 'https://ccapi.paymentez.com';

}