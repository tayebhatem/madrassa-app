import { FontAwesome5 } from '@expo/vector-icons'
import { useState } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'


const Password = ({changePassword}) => {
    const[hiddePassword,setHiddePassword]=useState(true);
  return (
   
    <View className="flex-row gap-2 items-center w-72 bg-gray-100 pr-2 pb-2 rounded-md shadow-md">
        <FontAwesome5 name="lock" size={18} color="#aaa"   />
       <TextInput placeholder='Mot de pass'secureTextEntry={hiddePassword} className="grow"/>
       {
          hiddePassword?
          <TouchableOpacity onPress={()=>setHiddePassword(false)}>
          <FontAwesome5 name="eye" size={18} color="#aaa"/>
          </TouchableOpacity>:
          <TouchableOpacity onPress={()=>setHiddePassword(true)}>
          <FontAwesome5 name="eye-slash" size={18} color="#aaa" />
          </TouchableOpacity>
          
       }
       </View>
     
  )
}

export default Password