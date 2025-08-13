import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../routes/navigations';
import ScreenWrapper from '../../../shared/components/layout/LayoutScreen';
import { RefundHook } from '../../../../../src/hooks';
import { useEffect } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'DetailsPayment'>;

export default function DetailsPaymentPage({route, navigation}: Props) {
  const { paymentResponse } = route.params;
  const {refund,isLoadingRefund, processRefund, errorRefund } = RefundHook()

  const handleRefund = async () => {
    console.log(paymentResponse?.transaction?.id)
    if (!paymentResponse?.transaction?.id) return;

    try {
      await processRefund({ transaction: {
        id: paymentResponse.transaction.id
      }});
    
    } catch (err: any) {
      Alert.alert('Refund Error', err.message || 'Something went wrong.');
    }
  };


  useEffect(()=>{
    if(refund){
        Alert.alert('Refund Success', 'The payment has been refunded successfully.');
    }else if(errorRefund){
       Alert.alert('Refund Error', errorRefund.description );
    }
  },[refund, errorRefund])

  return (
    <ScreenWrapper isLoading={isLoadingRefund} loadingText="Processing..."
    
    >
      <View style={styles.container}>
        <Text style={styles.title}>Payment Details</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{paymentResponse.transaction.id}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>${paymentResponse.transaction.amount.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Authorization Code:</Text>
          <Text style={styles.value}>{paymentResponse.transaction.authorization_code}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{paymentResponse.transaction.status}</Text>
        </View>

        <Pressable
          style={[styles.button, refund && styles.disabledButton]}
          disabled={refund? true: false}
          onPress={handleRefund}
        >
          <Text style={styles.buttonText}>
            {refund ? 'Refund Done' : 'Refund'}
          </Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 12 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  value: { fontSize: 16 },
  button: {
    marginTop: 30,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#888' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
