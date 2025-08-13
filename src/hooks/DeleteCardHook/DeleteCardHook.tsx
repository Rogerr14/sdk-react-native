import { useState } from 'react';
import NuveiSdk from '../../NuveiSdk';
import type ErrorModel from '../../interfaces/error.interface';
import type { DeleteCardResponse, DeleteRequest } from '.';

const DeleteCardHook = () => {
  const [messageDelete, setMessageDelete] = useState<DeleteCardResponse>();
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [errorDelete, setErrorDelete] = useState<ErrorModel['error'] | null>(
    null
  );

  const deletCard = async (request: DeleteRequest) => {
    if (!request.card || !request.user) {
      setErrorDelete({
        type: 'Invalid input',
        help: '',
        description: 'Parameters is required but is empty',
      });
      return;
    }

    if (!NuveiSdk.isInitialized()) {
      setErrorDelete({
        type: 'sdk_not_initialized',
        help: 'SDK not initialized',
        description: 'Nuvei SDK must be initialized before use',
      });
      return;
    }

    setIsLoadingDelete(true);
    setErrorDelete(null);

    const interceptor = NuveiSdk.createInterceptor(
      '/v2/card/delete',
      'POST',
      {},
      request,
      true
    );

    try {
      await interceptor.init();
      const response = await interceptor.request<DeleteCardResponse>();
      console.log(response);
      setMessageDelete(response);
    } catch (err: any) {
      setErrorDelete(
        err.error || {
          type: 'Invalid request',
          help: '',
          description: err.message || 'An unexpected error ocurrred',
        }
      );
    } finally {
      setIsLoadingDelete(false);
    }
  };

  return {
    messageDelete,
    isLoadingDelete,
    errorDelete,
    deletCard,
  };
};

export default DeleteCardHook;
