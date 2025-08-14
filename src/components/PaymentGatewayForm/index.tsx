import { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';
import type { CardInfo } from './interfaces';
import { formatCardNumber, formatExpiry, getCardInfo } from './helpers';
import AnimatedCardFlip from '../FlipCard';
import ShadowInput from '../shadowInput';
import type {
  AddCardResponse,
  UserInfoAdd,
} from '../../hooks/AddCardHook/addCard.interface';
import AddCardHook from '../../hooks/AddCardHook/AddCardHook';
import type ErrorModel from '../../interfaces/error.interface';
import {
  validateCardNumber,
  validateHolderName,
  validateExpiryDate,
  validateSecurityCode,
  valideOTPCode,
} from './validations';
import { t } from '../../i18n';
import useVerifyOtpHook from '../../hooks/AddCardHook/VerifyOtpHook';
import type { OtpResponse } from '../../hooks/AddCardHook/otp.interface';

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
  onVerifyOtp?: (response: OtpResponse)=>void; 
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
  moreInfoOtp = false
}: PaymentGatewayFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [dateExpiry, setDateExpiry] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [otpCode, setOtpCode] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardInfo, setCardInfo] = useState<CardInfo>();
  const [isOtp, setIsOtp] = useState<boolean>(false);

  const { addCardProcess, errorAddCard, addCard } = AddCardHook();
  const {verifyByOtp, errorOtp, otpVerify} = useVerifyOtpHook();
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
    !(isOtp && valideOTPCode(otpCode));

  const handleAddCardPress = async () => {
    if (!isFormValid) return;
    onLoading?.(true);

    try {
      const [monthStr, yearStr] = dateExpiry.split('/');
      const month = parseInt(monthStr!, 10);
      const year = 2000 + parseInt(yearStr!, 10);

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
      });

      
      // if (errorAddCard) onError?.(errorAddCard);
      // else onSuccess?.(addCard!);
    } finally {
      onLoading?.(false);
    }
  };


  const handleVerifyOtp = async()=>{
    if(!isFormValid) return;
    onLoading?.(true);

    try {
      await verifyByOtp({user:{
       id: userInfo.id 
      }, transaction:{
        id:addCard?.card.transaction_reference ?? ''
      },
      value: otpCode,
      type:'BY_OTP',
      more_info: moreInfoOtp
    })
      
    } finally{
      onLoading?.(false);
    }
  }


  useEffect(() => {
    if(errorAddCard){
      onError?.(errorAddCard)
    }
    if(errorOtp){
      onError?.(errorOtp)
    }
  }, [errorAddCard, errorOtp])
  

  useEffect(()=>{
    if(addCard){
      switch (addCard.card.status) {
        case 'valid':
          onSuccess?.(addCard)
          break;
        case 'pending':
          setIsOtp(true)
          break;
        default:
          onSuccess?.(addCard)
          break;
      }
    }
  },[addCard])

  useEffect(()=>{
    if(otpVerify){
      onVerifyOtp?.(otpVerify)
    }
  },[otpVerify])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
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
              validation={(v)=>validateExpiryDate(v)}
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
            
            validation={(v)=>valideOTPCode(v)}
            isFlipped={false}
            allowedChars={/^[0-9 ]*$/}
            labelStyle={{ color: theme.labelColor || '#000' }}
            inputStyle={{ color: theme.inputTextColor || '#000' }}
            errorStyle={{ color: theme.errorColor || 'red' }}
          />
        )}

        {/* Botón */}
        <Pressable
          style={[
            styles.button,
            { backgroundColor: theme.buttonColor || '#000' },
            !isFormValid && styles.disabledButton,
          ]}
          onPress={isOtp ? handleVerifyOtp :handleAddCardPress}
          disabled={!isFormValid}
        >
          <Text
            style={{
              color: theme.buttonTextColor || '#fff',
              textAlign: 'center',
            }}
          >
            {isOtp ? 'Verify Code' :'Add Card'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginTop: 8 },
  button: { marginTop: 16, paddingVertical: 12, borderRadius: 8 },
  disabledButton: { backgroundColor: '#888' },
});

export default PaymentGatewayForm;
