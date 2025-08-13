import { useState } from 'react';
import type ErrorModel from '../../interfaces/error.interface';
import NuveiSdk from '../../NuveiSdk';
import type {
  DebitPaymentRequest,
  PaymentDebitResponse,
} from './payment.interface';

const PaymentHook = () => {
  const [payment, setPayment] = useState<PaymentDebitResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorModel['error'] | null>(null);

  const processPayment = async (request: DebitPaymentRequest) => {
    if (!request.card || !request.order || !request.user) {
      setError({
        type: 'Invalid input',
        help: '',
        description: 'Payment data is required but is empty',
      });
      return;
    }

    if (!NuveiSdk.isInitialized()) {
      setError({
        type: 'sdk_not_initialized',
        help: 'SDK not initialized',
        description: 'Nuvei SDK must be initialized before use',
      });
      return;
    }
    console.log('aquii');

    const interceptor = NuveiSdk.createInterceptor(
      '/v2/transaction/debit/',
      'POST',
      {},
      request,
      true
    );
    setIsLoading(true);
    setError(null);
    try {
      await interceptor.init();
      const response = await interceptor.request<PaymentDebitResponse>();
      console.log(response);
      setPayment(response);
    } catch (err: any) {
      setError(
        err.error || {
          type: 'Invalid request',
          help: '',
          description: err.message || 'An unexpected error ocurrred',
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    payment,
    error,
    processPayment,
  };
};

export default PaymentHook;
