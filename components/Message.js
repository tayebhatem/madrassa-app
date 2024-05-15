import { View, Text } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'

const Message = ({message,userId,avatar}) => {
    
  return (
    <View  key={message.messageId} >
    
    <View className={message.senderId===userId?'flex-row-reverse items-center':'flex-row items-center'}>
   
    <Text className={message.senderId===userId?"bg-blue-500 text-white   p-3 rounded-xl":"bg-gray-200 p-3 rounded-xl "}>{message.text}</Text>
    </View>
     
    
     <Text className={message.senderId===userId?"text-gray-400 text-right":"text-gray-400 text-left"}>{message.time}</Text>
 </View>
  )
}

export default Message