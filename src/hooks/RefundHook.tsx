


import { useState } from 'react'
import type ErrorModel from '../interfaces/error.interface';
import type TransactionResponse from '../interfaces/refund.interface'
import type RefundRequest from '../interfaces/refund.interface';
import NuveiSdk from '../NuveiSdk';
const RefundHook = ({transaction, order, more_info}: RefundRequest,) => {
  
  const[refund, setRefund] = useState<TransactionResponse>()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorModel['error'] | null>(null);

 
  const processRefund = async()=>{
    
    if(!transaction){
      setError({
        type: 'Invalid input',
        help: '',
        description: 'Transaction data is required but is empty'
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

    const body : RefundRequest = {
      transaction,
      order,
      more_info

      };

    

    const interceptor = NuveiSdk.createInterceptor(
      '/v2/transaction/refund/',
      'POST',
      body,
      true
      )
      setIsLoading(true);
        setError(null);
      try {
        const response = await interceptor.request<TransactionResponse>();
        console.log(response)
        setRefund(response)
      } catch (err:any) {
        setError(err.error || {
          type: 'Invalid request',
          help: '',
          description: err.message || 'An unexpected error ocurrred'
        })
      }finally{
        setIsLoading(false)
      }
    
  }

  return {isLoading, refund, error, processRefund}
}

export default RefundHook
