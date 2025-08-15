import { SafeAreaView } from 'react-native-safe-area-context';
import { PaymentGatewayForm } from '../../../../../src/components';
import { useNavigation } from '@react-navigation/native';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import ScreenWrapper from '../../../shared/components/layout/LayoutScreen';
import { useState } from 'react';

const AddCardPage = () => {
  const [loadindAddCard, setLoadindAddCard] = useState(false);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenWrapper
        isLoading={loadindAddCard}
        loadingText={loadindAddCard ? 'Delete Card...' : 'Reload card...'}
        onRetry={() => {}}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <PaymentGatewayForm
            showHolderName={true}
            userInfo={{ email: 'test@example.com', id: '4' }}
            onSuccess={(card) => {
              if(card.card.status === 'rejected'){
                Alert.alert('Error', `Card ${card.card.status}`, [
                  { text: 'OK' },
                ]);
              }else{

                Alert.alert('Alert', 'Card added successfully', [
                  { text: 'OK', onPress: () => navigation.goBack() },
                ]);
              }
            }}
            onLoading={(value) => {
              setLoadindAddCard(value);
            }}
            onError={(error) => {
              Alert.alert('Error', error.description, [
                { text: 'OK', },
              ]);
            }}
            onVerifyOtp={() => {
              Alert.alert('Alert', 'Card added successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            }}
          />
        </KeyboardAvoidingView>
      </ScreenWrapper>
    </SafeAreaView>
  );
};

export default AddCardPage;
