


import  { useState } from 'react'
import type ErrorModel from '../interfaces/error.interface';
import type ListCard from '../interfaces/listCard.interface';
import NuveiSdk from '../NuveiSdk';
import type { NuveiCard } from '../interfaces/listCard.interface';

const ListCardHook = (userId: string) => {

  const [cards, setCards] = useState<NuveiCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorModel['error'] | null>(null);

  
  
    const getCards = async () => {
      if (!userId) {
        setError({
          type: 'Invalid input',
          help: '',
          description: 'uid is required but is empty'
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
      setIsLoading(true);
      setError(null);

      const interceptor = NuveiSdk.createInterceptor(
         '/v2/card/list',
       'GET',
        {
          uid: userId
        }
      , false);
      try {
        await interceptor.init();
        const response = await interceptor.request<ListCard>();
        console.log(response)
        setCards(response.cards || [])
        
      } catch (err: any) {
        setError(err.error || {
          type: 'Invalid request',
          help: '',
          description: err.message || 'An unexpected error ocurrred'
        })
      }finally{
        setIsLoading(false);
      };


    };

    return {
      cards, isLoading, error, getCards
    }

}

export default ListCardHook
