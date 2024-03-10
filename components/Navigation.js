import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome5,FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'

const Navigation = () => {
  const navigation=useNavigation();
  const route = useRoute();

  // Accessing the screen name
  const screenName = route.name;
 
  return (
    <View className="w-full flex-row justify-between">
      <TouchableOpacity className="justify-center items-center " onPress={()=>navigation.navigate('Home')}>
      <FontAwesome5 name="home" size={28} color={screenName==='Home'?"#0245D1":"#aaa"}  />
      <Text className={screenName==='Home'?"text-primary font-medium capitalize":"text-gray-400 font-medium capitalize"}>accueil</Text>
      </TouchableOpacity>

      <TouchableOpacity className="justify-center items-center ">
      <FontAwesome5 name="cog" size={28} color="#aaa"  />
      <Text className="text-gray-400 font-medium capitalize">paramètre</Text>
      </TouchableOpacity>

      <TouchableOpacity className="justify-center items-center ">
      <FontAwesome name="bell" size={28} color="#aaa"/>
      <Text className="text-gray-400 font-medium capitalize">notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity className="justify-center items-center " onPress={()=>navigation.navigate('Profile')}>
      <FontAwesome5 name="user-alt" size={28}  color={screenName==='Profile'?"#0245D1":"#aaa"}  />
      <Text className={screenName==='Profile'?"text-primary font-medium capitalize":"text-gray-400 font-medium capitalize"}>profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Navigation