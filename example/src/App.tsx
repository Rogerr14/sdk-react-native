import { Text, StyleSheet } from 'react-native';
import { HelloFromSDK, multiply } from 'nuvei-sdk';
import { NavigationContainer } from '@react-navigation/native';
const result = multiply(3, 7);

export default function App() {
  return (
    <NavigationContainer>
      <HelloFromSDK/>
      <Text>Result: {result}</Text>
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
