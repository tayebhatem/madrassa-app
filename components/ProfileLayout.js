import React from 'react'
import Navigation from './Navigation';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View ,Text} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileLayout({children,title}) {
    const navigation=useNavigation();
    return (
      <SafeAreaView  className="flex-1  bg-white px-4 pt-3  justify-between ">
      <View className="relative bg-primary h-2/5 w-screen px-4 -mx-4 -mt-3 rounded-b-3xl">
      <View className="w-full flex-row justify-between py-2">
  <Text className="grow font-semibold text-2xl text-white">{title}</Text>
 <TouchableOpacity onPress={navigation.goBack}>
       <AntDesign name="arrowleft" size={32} color="#fff"  />
       </TouchableOpacity>
  
  </View>
  {children}
      </View>
  

  
  <Navigation/>
      </SafeAreaView>
    )
}
