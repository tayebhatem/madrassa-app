import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import ProfileLayout from '../components/ProfileLayout'
import { supabase } from '../lib/supabase'
import { useNavigation } from '@react-navigation/native'

const Profile = () => {
  const navigation=useNavigation();
  const [teacher,setTeacher]=useState(null)
  const [session,setSession]=useState(null)
  const fetchTeacher=(id)=>{
supabase.from('teacherUser').select('*,teacher(*)').eq('userId',id).single().then(
  result=>{
    if(!result.error){
    setTeacher(result.data)
  
    }else{
      Alert.alert(result.error.message)
    }
  }
)
  }
  const checkSession=()=>{
    supabase.auth.getSession().then(({ data: { session } }) => {
    
      if (!session) {
        navigation.navigate('Login')
      } else{
        setSession(session)
        fetchTeacher(session.user.id)
        
      }
    })
  }
  const logOut=()=>{
    supabase.auth.signOut();
    navigation.navigate('Login');

   }
  useEffect(() => {
   
  checkSession()

  }, [])
  return (
    <ProfileLayout title={'Profile'}>
       <View className="absolute w-full ml-4 top-2/3 ">
     
     <View className=" relative bg-white   shadow-md shadow-black w-full  p-3 rounded-md">
     <View className=" justify-center items-center">
      <View className="absolute -top-14 mb-3 rounded-full border-4 border-white bg-white">
      <FontAwesome name="user-circle" size={96} color="#0245D1"   />
      </View>
      <View className="mt-12 w-full">
      <View className="border-b border-gray-300 pb-6 w-full">
      <Text className="text-center font-semibold text-2xl capitalize">{teacher && teacher.teacher.firstname+" "+teacher.teacher.lastname}</Text>
      <Text className="text-center text-gray-400">{session && session.user.email}</Text>
      </View>
      <View className="border-b border-gray-300 py-3 w-full pl-6 gap-y-2">
        

        <TouchableOpacity className="flex-row  items-center justify-between  gap-y-2" onPress={()=>navigation.navigate('Account', { teacher:teacher })}>
        <View className="flex-row gap-x-3 items-center">
        <FontAwesome name="user" size={36} color="#aaa"  />
          <Text className="text-gray-400 font-medium">Compte</Text> 
        </View>
       
          <MaterialIcons name="arrow-forward-ios" size={30} color="#aaa"  />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row  items-center justify-between gap-y-2">
        
         <View className="flex-row gap-x-3 items-center">
         <FontAwesome name="lock" size={36} color="#aaa"  />
         <Text className="text-gray-400 font-medium">Changer le mot de passe</Text>
          
         </View>
         <MaterialIcons name="arrow-forward-ios" size={30} color="#aaa"  />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row  items-center justify-between   gap-y-2">
        <View className="flex-row gap-x-3 items-center">
        <FontAwesome name="globe" size={36} color="#aaa"  />
          <Text className="text-gray-400 font-medium ">Langue</Text>
        </View>
          <MaterialIcons name="arrow-forward-ios" size={30} color="#aaa"  />
        </TouchableOpacity>
      </View>
      </View>
      <TouchableOpacity className="flex-row gap-3 items-center self-start ml-3 my-3" onPress={logOut}>
        <MaterialIcons name="logout" size={36} color="#aaa"  />
          <Text className="text-gray-400 font-medium">Déconnecter</Text>
          
        </TouchableOpacity>
      </View>
     
      </View>
     
      </View>
    </ProfileLayout>
  )
}

export default Profile