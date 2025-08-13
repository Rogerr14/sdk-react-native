import { useState } from "react"
import type ErrorModel from "../../interfaces/error.interface"



const VerifyOtpHook = () => {

    const [errorOtp, setErrorOtp] = useState<ErrorModel['error']>()
    const [isLoadingVerify, serIsLoadin] = useState<boolean>(false);


  return {

  }
}

export default VerifyOtpHook
