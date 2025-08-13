import { useState } from 'react';
import type ErrorModel from '../../interfaces/error.interface';
import type { AddCardRequest, AddCardResponse } from './addCard.interface';
import NuveiSdk from '../../NuveiSdk';

const AddCardHook = () => {
  const [isLoadingAddCard, setIsLoadingAddCard] = useState<boolean>(false);
  const [errorAddCard, setErrorAddCard] = useState<ErrorModel['error'] | null>(
    null
  );
  const [addCard, setAddCard] = useState<AddCardResponse>();

  const addCardProcess = async (request: AddCardRequest) => {
    if (!request.card || !request.user) {
      setErrorAddCard({
        type: 'Invalid input',
        help: '',
        description: 'Parameters is required but is empty',
      });
      return;
    }

    if (!NuveiSdk.isInitialized()) {
      setErrorAddCard({
        type: 'sdk_not_initialized',
        help: 'SDK not initialized',
        description: 'Nuvei SDK must be initialized before use',
      });
      return;
    }

    setIsLoadingAddCard(true);
    setErrorAddCard(null);

    const interceptor = NuveiSdk.createInterceptor(
      '/v2/card/add',
      'POST',
      {},
      request,
      false
    );

    try {
      await interceptor.init();
      const response = await interceptor.request<AddCardResponse>();
      console.log('status',response.card.status === 'rejected');
      if(response.card.status === 'rejected'){
        console.log('aqui')
        setErrorAddCard(
          {
            type:'Error',
            help:'',
            description: 'Card rejected'
          }
        )
        return;
      }else{
        console.log('aqui tambien')
        setAddCard(response);
      }
    } catch (err: any) {
      setAddCard(
        err.error || {
          type: 'Invalid request',
          help: '',
          description: err.message || 'An unexpected error ocurrred',
        }
      );
    } finally {
      setIsLoadingAddCard(false);
    }
  };

  return {
    addCard,
    isLoadingAddCard,
    errorAddCard,
    addCardProcess,
  };
};

export default AddCardHook;
