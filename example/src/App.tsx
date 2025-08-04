import { Text, StyleSheet, SafeAreaView } from 'react-native';
import { HelloFromSDK, multiply } from 'nuvei-sdk';
import { NavigationContainer } from '@react-navigation/native';
const result = multiply(3, 7);

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={
        {
          display: 'flex',
          alignItems: 'center'
        }
      }>

      <HelloFromSDK/>
      <Text>Result: {result}</Text>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
