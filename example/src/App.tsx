import { Text, StyleSheet, SafeAreaView, View, Pressable } from 'react-native';
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
        
        
        <View style={{flexDirection: 'row'}}>
        <Text>NuveiSdk</Text>
        <Pressable  onPress={()=>{
          console.log('holaaa')
        }} style={{
          borderRadius: 20,
          borderColor: '#121212',
          borderWidth: 20
        }}>
          <Text>Init Simulation</Text>
        </Pressable>
        </View>
        
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
