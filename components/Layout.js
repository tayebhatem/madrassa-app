import {  Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navigation from '../components/Navigation'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'

const Layout = ({children,title,show}) => {
  const navigation=useNavigation();
  return (
    <SafeAreaView  className="flex-1  bg-white px-4 pt-3  justify-between">
<View className="w-full flex-row justify-between py-2">
<Text className="grow font-semibold text-2xl">{title}</Text>
{
show && <TouchableOpacity onPress={navigation.goBack}>
     <AntDesign name="arrowleft" size={32} color="#000"  />
     </TouchableOpacity>
}
</View>
{children}
<Navigation/>
    </SafeAreaView>
  )
}

export default Layout