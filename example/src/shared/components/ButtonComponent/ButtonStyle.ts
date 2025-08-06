import { Platform, StyleSheet } from "react-native";



export const ButtonStyle = StyleSheet.create({
    textSytle:{
        fontSize: 17,
        color: '#ffffff'
    },
    buttonStyle:{
        borderWidth: 2,
        padding: 10,
        borderRadius: 5,
        backgroundColor:Platform.OS === 'android' ?'#1d1d1d' :"black",
        
    },
    buttonPressed:{
        borderWidth: 2,
        padding: 10,
        borderRadius: 5,
        backgroundColor: Platform.OS === 'android' ?'#1d1d1d' :'grey'
    }
    

    
})