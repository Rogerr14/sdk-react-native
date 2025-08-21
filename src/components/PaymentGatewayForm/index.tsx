import { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  StyleSheet,
  
  Button,
  Dimensions,
} from 'react-native';
import type { CardInfo } from './interfaces';
import { formatCardNumber, formatExpiry, getCardInfo , getBrowserInfo} from './helpers';
import AnimatedCardFlip from '../FlipCard';
import ShadowInput from '../shadowInput';
import {
  // BrowserInfo,
  type AddCardResponse,
  type BrowserResponse,
  type UserInfoAdd,
} from '../../hooks/AddCardHook/addCard.interface';
import AddCardHook from '../../hooks/AddCardHook/AddCardHook';
import type ErrorModel from '../../interfaces/error.interface';
import {
  validateCardNumber,
  validateHolderName,
  validateExpiryDate,
  validateSecurityCode,
  validateOTPCode,
} from './validations';
import { t } from '../../i18n';
import useVerifyOtpHook from '../../hooks/AddCardHook/VerifyOtpHook';
import type { OtpRequest, OtpResponse } from '../../hooks/AddCardHook/otp.interface';
import ChallengeModal from '../../hooks/AddCardHook/Verify3dsHook';

export interface PaymentGatewayFormProps {
  userInfo: UserInfoAdd;
  showHolderName?: boolean;
  theme?: {
    buttonColor?: string;
    buttonTextColor?: string;
    labelColor?: string;
    inputTextColor?: string;
    errorColor?: string;
  };
  onSuccess?: (response: AddCardResponse) => void;
  onVerifyOtp?: (response: OtpResponse) => void;
  onError?: (response: ErrorModel['error']) => void;
  onLoading?: (isLoading: boolean) => void;
  moreInfoOtp?: boolean
}

const PaymentGatewayForm = ({
  userInfo,
  showHolderName = true,
  theme = {},
  onSuccess,
  onError,
  onLoading,
  onVerifyOtp,
  moreInfoOtp = true
}: PaymentGatewayFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [dateExpiry, setDateExpiry] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [otpCode, setOtpCode] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardInfo, setCardInfo] = useState<CardInfo>();
  const [isOtp, setIsOtp] = useState<boolean>(false);
  const [validOtp, setValidOtp]  =  useState<boolean>(true);
  
  const [validate3ds, setValidate3ds] = useState<boolean>(false);
 const [challengeHtml, setChallengeHtml] = useState<string>("");


  const { addCardProcess, errorAddCard, addCard } = AddCardHook();
  const { verifyByOtp, errorOtp, otpVerify } = useVerifyOtpHook();
  const handleCardNumber = (value: string) => {
    const result = formatCardNumber(value);
    setCardNumber(result);
    setCardInfo(getCardInfo(result));
  };



  const handleExpiryChange = (value: string) =>
    setDateExpiry(formatExpiry(value));

  const isFormValid =
    !validateCardNumber(cardNumber) &&
    !validateHolderName(cardholderName, showHolderName) &&
    !validateExpiryDate(dateExpiry) &&
    !validateSecurityCode(securityCode, cardInfo?.cvcNumber) &&
    !(isOtp && validateOTPCode(otpCode));

  const handleAddCardPress = async () => {
    if (!isFormValid) return;
    onLoading?.(true);

    try {
      const [monthStr, yearStr] = dateExpiry.split('/');
      const month = parseInt(monthStr!, 10);
      const year = 2000 + parseInt(yearStr!, 10);

      const browserInfo = await getBrowserInfo()
      await addCardProcess({
        user: userInfo,
        card: {
          number: cardNumber.replace(/\s/g, ''),
          holder_name: cardholderName,
          expiry_month: month,
          expiry_year: year,
          cvc: securityCode,
          type: cardInfo?.typeCode,
        },
        extra_params:{
          browser_info: browserInfo
        }
      });


      // if (errorAddCard) onError?.(errorAddCard);
      // else onSuccess?.(addCard!);
    } finally {
      onLoading?.(false);
    }
  };

  const clearAllForms =()=>{
    setCardNumber("")
    setCardholderName("")
    setDateExpiry("")
    setSecurityCode("")
    setOtpCode("")
    setValidOtp(true)
    setIsOtp(false)
    setCardInfo(undefined)
  }





  const handleVerifyOtp = async ({type, value}:OtpRequest) => {

    // if (!isFormValid) return;
    onLoading?.(true);
    console.log('pasa aqui')
    try {
      console.log('sdasdsds')
       await verifyByOtp({
        user: {
          id: userInfo.id
        }, transaction: {
          id: addCard?.card.transaction_reference ?? ''
        },
        value: value,
        type: type,
        more_info: moreInfoOtp
      })


    } finally {
      onLoading?.(false);
    }
  }


  useEffect(() => {
    if (errorAddCard) {
      onError?.(errorAddCard)
    }
    if (errorOtp) {
      if(errorOtp.type.includes('VerificationError')){
        clearAllForms()
      }else{
        onError?.(errorOtp)
      }
    }
  }, [errorAddCard, errorOtp])


  const validateChallengue =  async (browserResponse: BrowserResponse)=>{

    if(browserResponse.challenge_request){
      setChallengeHtml( `<!DOCTYPE html SYSTEM 'about:legacy-compat'><html class='no-js' lang='en'xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'/><meta charset='utf-8'/></head><body OnLoad='OnLoadEvent();'><form action='https://ccapi-stg.paymentez.com/v2/3ds/mockchallenge' method='POST' id='threeD' name='threeD'>message_id: <input type='area' id='message_id' name='message_id' value='AU-106430' />;creq: <input type='area' id='creq'name='creq' value='ewogICAiYWNzVHJhbnNJRCIgOiAiMjZjZGI3ZjAtOTE0My00M2I0LTlhM2YtYWUwZWE1MzUyMzhjIiwKICA' />; \"term_url: <input type='area' id='term_url' name='term_url' value='https://lantechco.ec/img/callback3DS.php' />;\n            <input type='submit' value='proceed to issuer'></form><script language='Javascript'>document.getElementById('threeD').submit(); </script></body></body></html>`)
      setValidate3ds(true);
    }else{
      setTimeout(()=>{}, 5000)
      await handleVerifyOtp({type:'AUTHENTICATION_CONTINUE', value:""})
    }

    // if(browserResponse.challenge_request){
    //   
    //   setValidate3ds(true)
    //  await validate3dsChallenge()
    // }else{
    //   setTimeout(()=>{}, 3500)
    //   await handleVerifyOtp({type:'AUTHENTICATION_CONTINUE', value:""})
    //   if(otpVerify?.['3ds']?.browser_response.challenge_request){
    //     setChallengeHtml( `<!DOCTYPE html SYSTEM 'about:legacy-compat'><html class='no-js' lang='en'xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'/><meta charset='utf-8'/></head><body OnLoad='OnLoadEvent();'><form action='https://ccapi-stg.paymentez.com/v2/3ds/mockchallenge' method='POST' id='threeD' name='threeD'>message_id: <input type='area' id='message_id' name='message_id' value='AU-106430' />;creq: <input type='area' id='creq'name='creq' value='ewogICAiYWNzVHJhbnNJRCIgOiAiMjZjZGI3ZjAtOTE0My00M2I0LTlhM2YtYWUwZWE1MzUyMzhjIiwKICA' />; \"term_url: <input type='area' id='term_url' name='term_url' value='https://lantechco.ec/img/callback3DS.php' />;\n            <input type='submit' value='proceed to issuer'></form><script language='Javascript'>document.getElementById('threeD').submit(); </script></body></body></html>`)
    //   setValidate3ds(true)
    //  await validate3dsChallenge()
    //   }
    // // }
  }

  // const validate3dsChallenge = async () =>{
    
  //   await handleVerifyOtp({type:"BY_CRES", value:"U3VjY2VzcyBBdXRoZW50aWNhdGlvbg=="})
  //   setValidate3ds(false);
  // }

  useEffect(() => {
    if (addCard) {


      
      switch (addCard.card.status) {
        case 'valid':
          onSuccess?.(addCard)
          break;
        case 'pending':
          setIsOtp(true)
          break;
        case 'review':
          validateChallengue(addCard['3ds'].browser_response)
          break;
        case 'rejected':
          clearAllForms()
          onSuccess?.(addCard)  
          break;
        default:
          onSuccess?.(addCard)
          break;
      }
  

    }
  }, [addCard])

  useEffect(() => {
    if (otpVerify ) {
      if(isOtp){
      switch (otpVerify.transaction?.status_detail) {
        case 31:
          setOtpCode("")
          setValidOtp(false)
          break;
        case 32:
          setValidOtp(true)
          onVerifyOtp?.(otpVerify)
          break;
        case 33:
          clearAllForms()
          onError?.({
            type:'Otp not valid',
            help:'try again',
            description:''
          })
          break;
        default:
          break;
      }
    }else{

      switch(otpVerify.transaction?.status){
        case 'success':
          onVerifyOtp?.(otpVerify)
          break;
        case 'pending':
          validateChallengue(otpVerify['3ds']!.browser_response)
          break;
        case 'failure':
          onVerifyOtp?.(otpVerify)
          break;
        default:

        onVerifyOtp?.(otpVerify)
          break;
      }

    }
    
    }
  }, [otpVerify])

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      
      <ChallengeModal
        visible={validate3ds}
        onClose={()=>{ 
          handleVerifyOtp({type:"BY_CRES", value: 'U3VjY2VzcyBBdXRoZW50aWNhdGlvbg=='})
         } }
        onSuccess={()=>{}}
        challengeHtml={challengeHtml}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Tarjeta ilustrativa */}
        <AnimatedCardFlip
          isFlipped={isFlipped}
          cardNumber={cardNumber || '**** **** **** ****'}
          cardHolderName={cardholderName || 'Jhon Doe'}
          expiryDate={dateExpiry || 'MM/YY'}
          ccv={securityCode || '***'}
          gradient={cardInfo?.gradientColor || ['#333', '#000']}
          icon={
            cardInfo?.icon ||
            'https://github.com/paymentez/paymentez-ios/blob/master/PaymentSDK/PaymentAssets.xcassets/stp_card_unknown.imageset/stp_card_unknown@3x.png?raw=true'
          }
        />

        {/* Inputs */}
        <ShadowInput
          label={t('forms.cardNumber')}
          placeholder="0000 0000 0000 0000"
          value={cardNumber}
          onChangeText={handleCardNumber}
          maxLength={19}
          editable={!isOtp}
          keyboardType='numeric'
          allowedChars={/^[0-9 ]*$/}
          setIsFlipped={setIsFlipped}
          isFlipped={false}
          validation={(v) => validateCardNumber(v)}
          labelStyle={{ color: theme.labelColor || '#000' }}
          inputStyle={{ color: theme.inputTextColor || '#000' }}
          errorStyle={{ color: theme.errorColor || 'red' }}
        />

        {showHolderName && (
          <ShadowInput
            label={t('forms.holderName')}
            placeholder="John Doe"
            forceUppercase={true}
            value={cardholderName}
            editable={!isOtp}
            onChangeText={setCardholderName}
            maxLength={20}
            validation={(v) => validateHolderName(v, showHolderName)}
            setIsFlipped={setIsFlipped}
            isFlipped={false}
            allowedChars={/^[A-Za-z ]*$/}
            labelStyle={{ color: theme.labelColor || '#000' }}
            inputStyle={{ color: theme.inputTextColor || '#000' }}
            errorStyle={{ color: theme.errorColor || 'red' }}
          />
        )}

        {/* Expiry y CVV */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <ShadowInput
              label={t('forms.expiryDate')}
              placeholder="MM/YY"
              value={dateExpiry}
              editable={!isOtp}
              onChangeText={handleExpiryChange}
              maxLength={5}
              keyboardType="numeric"
              validation={(v) => validateExpiryDate(v)}
              setIsFlipped={setIsFlipped}
              isFlipped={false}
              labelStyle={{ color: theme.labelColor || '#000' }}
              inputStyle={{ color: theme.inputTextColor || '#000' }}
              errorStyle={{ color: theme.errorColor || 'red' }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ShadowInput
              label={t('forms.securityCode')}
              placeholder="CCV/CVV"
              value={securityCode}
              editable={!isOtp}
              onChangeText={setSecurityCode}
              maxLength={cardInfo?.cvcNumber || 3}
              keyboardType="numeric"
              validation={(v) => validateSecurityCode(v, cardInfo?.cvcNumber)}
              setIsFlipped={setIsFlipped}
              isFlipped={true}
              labelStyle={{ color: theme.labelColor || '#000' }}
              inputStyle={{ color: theme.inputTextColor || '#000' }}
              errorStyle={{ color: theme.errorColor || 'red' }}
            />
          </View>
        </View>
        {isOtp && (
          <ShadowInput
            label={t('forms.otpCode')}
            placeholder="123456"
            value={otpCode}
            onChangeText={setOtpCode}
            maxLength={6}
            setIsFlipped={setIsFlipped}

            validation={(v) => validateOTPCode(v, validOtp)}
            isFlipped={false}
            allowedChars={/^[0-9 ]*$/}
            labelStyle={{ color: theme.labelColor || '#000' }}
            inputStyle={{ color: theme.inputTextColor || '#000' }}
            errorStyle={{ color: theme.errorColor || 'red' }}
          />
        )}

          {!validOtp && <Text style={{color: theme.errorColor || 'red'}}>{t('errors.otpNotValid')}</Text>}


        {/* Botón */}
        <Pressable
          style={[
            styles.button,
            
            { backgroundColor: theme.buttonColor || '#000' },
            !isFormValid && styles.disabledButton,
          ]}
          onPress={isOtp ? ()=> handleVerifyOtp({type:"BY_OTP", value: otpCode}) : handleAddCardPress}
          disabled={!isFormValid}
        >
          <Text
            style={{
              color: theme.buttonTextColor || '#fff',
              textAlign: 'center',
            }}
          >
            {isOtp ? 'Verify Code' : 'Add Card'}
          </Text>
        </Pressable>
        <Button  title='Show Modal' onPress={() => setValidate3ds(true)} />
      </ScrollView>
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginTop: 8 },
  button: { marginTop: 16, paddingVertical: 12, borderRadius: 8 },
  disabledButton: { backgroundColor: '#888' },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 40,
    width: Dimensions.get('window').width * 0.9, // 90% del ancho de la pantalla
    height: Dimensions.get('window').height * 0.7, // 70% del alto de la pantalla
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  webView: {
    justifyContent:'center',
    // flex:1,
    marginTop:60,
    borderRadius:20,
    padding:20,
    marginBottom:20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default PaymentGatewayForm;
