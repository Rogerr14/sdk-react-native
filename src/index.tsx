import NuveiSdk from './NativeNuveiSdk';
import 'react-native-get-random-values';

export function multiply(a: number, b: number): number {
  return NuveiSdk.multiply(a, b);
}
export {HelloFromSDK}

import { Text, View, StyleSheet } from 'react-native';

 const HelloFromSDK = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hola desde Nuvei SDK!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  text: { fontSize: 18, color: 'blue' },
});