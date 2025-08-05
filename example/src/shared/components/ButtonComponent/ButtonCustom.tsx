
import React from 'react'
import { Button, Pressable, Text } from 'react-native'
import { ButtonStyle } from './ButtonStyle';

interface ButtonCustom{
    name: string;
    onPress: ()=> void;
}


const ButtonCustom = ({name, onPress}: ButtonCustom) => {
  return (
    <>
    <Pressable  onPress={()=> onPress()} style= {
        {
             
        }
    } >
            <Text style={ButtonStyle.textSytle}>{name}</Text>
        </Pressable>
    </>
  )
}

export default ButtonCustom
