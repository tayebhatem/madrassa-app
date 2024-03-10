import { View, Text,StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'

import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'

const Home = () => {
  const navigation=useNavigation();
  
  useEffect(() => {
   
    supabase.auth.getSession().then(({ data: { session } }) => {
      
      if (!session && !session.user) {
        navigation.navigate('Login');
      } else {
        try {
          const { data, error } =  supabase
          .from('teacherUser')
          .select(`teacherId`)
          .eq('userId', session.user.id)
          .single()
          
        if (error) {
          Alert.alert("error : "+error.message)
        }else{
          if(data===null){
           navigation.navigate('Information')
          }
        }
    
        
         } catch (error) {
          if (error instanceof Error) {
            Alert.alert(error.message)
          }
         }
      }
    })
   
  }, [])
  return (
    <Layout title={'Accuil'}>
     
<View className="h-1/4 p-3 rounded-md bg-blue-500 flex-row shadow-black shadow-lg" >
    <View className="w-4/5">
    <Text className="text-3xl text-white">Annulation</Text>
    <Text className="text-lg text-white font-light ">Laborum quis adipisicing officia elit elit enim ut dolore ipsum mollit.</Text>
    </View>
    
 <View className=" grow items-center justify-center">
 <FontAwesome name="bell" size={40} color="#fff" />
 </View>
    
</View>


<View className="grow  py-2   gap-y-2  ">

 <View className="grow flex-row gap-x-2">
 <TouchableOpacity className="w-1/2 bg-yellow-500 rounded-md shadow-black shadow-lg   p-3   items-center justify-center   " onPress={()=>navigation.navigate('Attendance')}>
 <FontAwesome name="qrcode" size={50} color="#fff" />
   <Text className="capitalize font-medium text-white  text-2xl" >Présence</Text>
 </TouchableOpacity>
 <TouchableOpacity className="grow  bg-pink-500 rounded-md  p-3   items-center justify-center  ">
 <FontAwesome name="file-text-o" size={50} color="#fff" />
   <Text className="  text-white font-medium text-2xl">Notes</Text>
 </TouchableOpacity>
 </View>
<View className="grow flex-row gap-x-2">
<TouchableOpacity className="grow bg-green-500 rounded-md  p-3   items-center justify-center  ">
 <FontAwesome name="clock-o" size={50} color="#fff" />
   <Text className="  text-white font-medium text-2xl">Examen</Text>
 </TouchableOpacity>
 <TouchableOpacity className="grow bg-purple-500 rounded-md  p-3   items-center justify-center " onPress={()=>navigation.navigate('Schedule')}>
 <FontAwesome5 name="calendar-alt" size={50} color="#fff" />
   <Text className="  text-white font-medium text-2xl">Emploi</Text>
 </TouchableOpacity>
</View>
</View>
    </Layout>
  )

}
const styles = StyleSheet.create({
    container: {
        shadowColor: '#aaa',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 2,
      },
});
export default Home