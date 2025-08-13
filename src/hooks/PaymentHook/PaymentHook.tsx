import { useState } from 'react';
import type ErrorModel from '../../interfaces/error.interface';
import NuveiSdk from '../../NuveiSdk';
import type {
  DebitPaymentRequest,
  PaymentDebitResponse,
} from './payment.interface';

const PaymentHook = () => {
  const [payment, setPayment] = useState<PaymentDebitResponse>();
  const [isLoadingPayment, setIsLoadingPayment] = useState<boolean>(false);
  const [errorPayment, setErrorPayment] = useState<ErrorModel['error'] | null>(null);

  const processPayment = async (request: DebitPaymentRequest) => {
    if (!request.card || !request.order || !request.user) {
      setErrorPayment({
        type: 'Invalid input',
        help: '',
        description: 'Payment data is required but is empty',
      });
      return;
    }

    if (!NuveiSdk.isInitialized()) {
      setErrorPayment({
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
    setIsLoadingPayment(true);
    setErrorPayment(null);
    try {
      await interceptor.init();
      const response = await interceptor.request<PaymentDebitResponse>();
      console.log(response);
      setPayment(response);
    } catch (err: any) {
      setErrorPayment(
        err.error || {
          type: 'Invalid request',
          help: '',
          description: err.message || 'An unexpected error ocurrred',
        }
      );
    } finally {
      setIsLoadingPayment(false);
    }
  };

  return {
    isLoadingPayment,
    payment,
    errorPayment,
    processPayment,
  };
};

export default PaymentHook;
