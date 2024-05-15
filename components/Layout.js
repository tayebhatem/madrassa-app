import {  Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navigation from '../components/Navigation'
import { useNavigation } from '@react-navigation/native'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { Image } from 'react-native-elements'

const Layout = ({children,title,show,messages,avatar}) => {
  const navigation=useNavigation();
  return (
    <SafeAreaView  className="flex-1  bg-[#F5F7FB] px-3 pt-3  justify-between ">
<View className="w-full flex-row justify-between py-2 ">
{
  messages ? <View className='flex-row items-center gap-x-2'>

  {avatar ? <Image className='w-14 h-14 grow rounded-full' source={{uri:avatar}}></Image>:
  <View className="rounded-full border-4 border-white bg-white">
      <FontAwesome name="user-circle" size={56} color="#0245D1"   />
      </View>
  }
  <Text className="grow font-semibold text-xl  w-1/2  truncate">{title}</Text>
</View>:
<Text className="grow font-semibold text-2xl">{title}</Text>
}

{
show && <TouchableOpacity onPress={navigation.goBack}>
     <AntDesign name="arrowleft" size={32} color="#000"  />
     </TouchableOpacity>
}
</View>
{children}
{!messages && <Navigation/>}
    </SafeAreaView>
  )
}

export default Layout