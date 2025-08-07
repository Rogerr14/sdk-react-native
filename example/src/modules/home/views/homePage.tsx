import { createStackNavigator } from "@react-navigation/stack"
import { useState } from "react"
import { SafeAreaView, StatusBar, Text, View } from "react-native"
import { FlatList } from "react-native-gesture-handler";



export default function HomePage(){

    const Stack = createStackNavigator();
    const [simulation, setSimulation] = useState()





    return(

        <SafeAreaView style={{flex:1}}>
            <FlatList data={[
                
            ]} renderItem={({item})=> <View>
                <Text></Text>
            </View>}/>
            
        </SafeAreaView>
    )
}