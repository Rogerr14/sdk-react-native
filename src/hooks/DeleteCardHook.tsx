


import  { useState } from 'react'
import NuveiSdk from '../NuveiSdk';
import type ErrorModel from '../interfaces/error.interface';

const DeleteCardHook = (userId: string, tokenCard: string) => {
    
    const [message, setMessage] = useState<DeleteCard>()
    const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorModel['error'] | null>(null);


    const deletCard= async()=>{
        if(!userId || !tokenCard){
            setError({
                type: 'Invalid input',
                help:'',
                description:'Parameters is required but is empty'
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
        const body: DeleteRequest = {
            card:{
                token: tokenCard
            },
            user:{
                id: userId
            },
        }
        
        const interceptor = NuveiSdk.createInterceptor(
            'v2/card/delete',
            'POST',
            body, 
            false
        )
    
            try {
                await interceptor.init();
                const response = await interceptor.request<DeleteCard>();
                console.log(response);
                setMessage(response)
            } catch (err: any) {
                setError(err.error || {
                    type: 'Invalid request',
                    help: '',
                    description: err.message || 'An unexpected error ocurrred'
                  })
            }finally{
                setIsLoading(false);
            }

    };

    return {
        message, isLoading, error, deletCard
    }

  

}

export default DeleteCardHook
