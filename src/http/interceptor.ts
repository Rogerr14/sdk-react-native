import { AxiosAdapter } from './adapters/axios.adapter';
import Environment from '../environment/environment';
import generateAuthToken from '../utils/NuveiUtils';
import type { ErrorModel } from '../interfaces';

export interface interceptorHttp {
  endpoint: string;
  methodHttp: string;
  queryParams?: {};
  secretCode: string;
  secretKey: string;
  body?: {};
}

export default class InterceptorHttp {
  endpoint: string;
  methodHttp: string;
  queryParams?: {};
  secretCode: string = '';
  secretKey: string = '';
  body?: {};
  private client!: AxiosAdapter;

  constructor({
    endpoint,
    methodHttp,
    queryParams,
    secretCode,
    secretKey,
    body,
  }: interceptorHttp) {
    this.endpoint = endpoint;
    this.methodHttp = methodHttp;
    this.secretKey = secretKey;
    this.secretCode = secretCode;
    this.queryParams = queryParams;
    this.body = body;
  }

  public async init(): Promise<void> {
    const token = await generateAuthToken(this.secretKey, this.secretCode);
    console.log(token);
    this.client = new AxiosAdapter({
      baseUrl: Environment.getInstance().baseConfig?.urlBase || '',
      headers: {
        'Auth-Token': token,
        'Content-Type': 'application/json',
      },
    });
  }

  public async request<T>(): Promise<T> {
    if (!this.client) {
      throw {
        error: {
          type: 'Client not initializated',
          help: '',
          description: 'Call init() before making a request',
        },
      } as ErrorModel;
    }

    try {
      switch (this.methodHttp) {
        case 'GET':
          return await this.client.get<T>(this.endpoint, {
            params: this.queryParams,
          });
        case 'POST':
          return await this.client.post<T>(
            this.endpoint,
            { params: this.queryParams },
            this.body
          );
        default:
          return await this.client.get<T>(this.endpoint, {
            params: this.queryParams,
          });
      }
    } catch (error: any) {
      throw error as ErrorModel;
    }
  }
}
