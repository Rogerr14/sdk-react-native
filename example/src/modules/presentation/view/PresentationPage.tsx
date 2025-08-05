

import { Text, View } from 'react-native'
import ButtonCustom from '../../../shared/components/ButtonComponent/ButtonCustom'
import { SafeAreaView } from 'react-native-safe-area-context'
import NuveiSdk from '../../../../../src/NuveiSdk'
import { NUVEI_ENV } from '../../../shared/utils/constants'

export const PresentationPage = ()=> {


  const   initEnv = ()=>{
    NuveiSdk.initEnvironmet(NUVEI_ENV.APP_CODE,NUVEI_ENV.APP_KEY, NUVEI_ENV.SERVER_CODE, NUVEI_ENV.SERVER_KEY, true);
  }


  return (
    <SafeAreaView style= {{flex: 1}}>

      <View style={{
        flex: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
        
      }}> 

      <Text>
        Presentation Page
      </Text>
      <ButtonCustom name='Init simulation' onPress={initEnv}/>
      </View>
      </SafeAreaView>
    
  )
}
