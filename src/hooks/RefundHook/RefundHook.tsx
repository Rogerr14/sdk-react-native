import { useState } from 'react';
import type ErrorModel from '../../interfaces/error.interface';
import NuveiSdk from '../../NuveiSdk';
import type { RefundRequest, RefundResponse } from './refund.interface';
const RefundHook = () => {
  const [refund, setRefund] = useState<RefundResponse>();
  const [isLoadingRefund, setIsLoadingRefund] = useState<boolean>(false);
  const [errorRefund, setErrorRefund] = useState<ErrorModel['error'] | null>(null);

  const processRefund = async (request: RefundRequest) => {
    if (!request.transaction) {
      setErrorRefund({
        type: 'Invalid input',
        help: '',
        description: 'Transaction data is required but is empty',
      });
      return;
    }

    if (!NuveiSdk.isInitialized()) {
      setErrorRefund({
        type: 'sdk_not_initialized',
        help: 'SDK not initialized',
        description: 'Nuvei SDK must be initialized before use',
      });
      return;
    }

    const interceptor = NuveiSdk.createInterceptor(
      '/v2/transaction/refund/',
      'POST',
      {},
      request,
      true
    );
    setIsLoadingRefund(true);
    setErrorRefund(null);
    try {
      await interceptor.init()
      const response = await interceptor.request<RefundResponse>();
      console.log(response);
      setRefund(response);
    } catch (err: any) {
      setErrorRefund(
        err.error || {
          type: 'Invalid request',
          help: '',
          description: err.message || 'An unexpected error ocurrred',
        }
      );
    } finally {
      setIsLoadingRefund(false);
    }
  };

  return { isLoadingRefund, refund, errorRefund, processRefund };
};

export default RefundHook;
