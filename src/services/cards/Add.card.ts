import NuveiSdk from "../../NuveiSdk";
import type { AddCardRequest, AddCardResponse } from "../interfaces/addCard.interface";




export async function addCard(request: AddCardRequest): Promise<AddCardResponse>{
    if (!request) {
        throw {
          error: {
            type: 'Invalid input',
            help: '',
            description: 'uid is required but is empty',
          },
        };
      }
      if (!NuveiSdk.isInitialized()) {
        throw {
          error: {
            type: 'sdk_not_initialized',
            help: 'SDK not initialized',
            description: 'Nuvei SDK must be initialized before use',
          },
        };
      }
      const interceptor = NuveiSdk.createInterceptor(
        '/v2/card/add',
        'POST',
        {},
        request,
        false
      );
  
      // try {
        await interceptor.init();
        const response = await interceptor.request<AddCardResponse>();
        console.log('response', response)
        return response;
}