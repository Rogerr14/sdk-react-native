import { useState } from "react"
import type ErrorModel from "../../interfaces/error.interface"
import type { OtpRequest, OtpResponse } from "./otp.interface";
import NuveiSdk from "../../NuveiSdk";



const useVerifyOtpHook = () => {

    const [errorOtp, setErrorOtp] = useState<ErrorModel['error']>()
    const [isLoadingVerify, serIsLoadingVerify] = useState<boolean>(false);
    const [otpVerify, setOtpVerify] = useState<OtpResponse>()


    const verifyByOtp = async (request: OtpRequest)=>{
      if (!request.user || !request.transaction || !request.value) {
        setErrorOtp({
          type: 'Invalid input',
          help: '',
          description: 'Parameters is required but is empty',
        });
        return;
      }


      if (!NuveiSdk.isInitialized()) {
        setErrorOtp({
          type: 'sdk_not_initialized',
          help: 'SDK not initialized',
          description: 'Nuvei SDK must be initialized before use',
        });
        return;
      }
      const interceptor = NuveiSdk.createInterceptor(
        '/v2/transaction/verify',
        'POST',
        {},
        request,
        false
      );

      try {
        await interceptor.init();
        const response = await interceptor.request<OtpResponse>();
      
          setOtpVerify(response);
      
      } catch (err: any) {
        setErrorOtp(
          err.error || {
            type: 'Invalid request',
            help: '',
            description: err.message || 'An unexpected error ocurrred',
          }
        );
      } finally {
        serIsLoadingVerify(false);
      }
    };
      
    


  return {
errorOtp, isLoadingVerify, otpVerify, verifyByOtp
  }
}

export default useVerifyOtpHook
