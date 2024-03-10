import { View, Text, TextInput, TouchableOpacity,Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Information = () => {
    const [session, setSession] = useState(null)
    const navigation=useNavigation();
    const [id, setId] = useState('')
    const fetchTeacher=()=>{
        supabase.from('teacher').select('teacherId',id).single().then(
            result=>{
                if(result.data){
                    saveInfo();
                }else{
                    Alert.alert('no teacher with this id');
                }
            }
        )
    }
    const saveInfo=()=>{
        supabase.from('teacherUser').insert({userId:session.user.id,teacherId:id}).then(
            result=>{
                if(!result.error){
                    navigation.navigate('Home');
                }
            }
        )
    }
    useEffect(()=>{
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
          })
    })
  return (
    <SafeAreaView className="flex-1 items-center  bg-white">
    <View className="bg-primary w-full rounded-b-3xl p-24 flex justify-center items-center ">
    <Image
        source={require('../assets/logo.png')}
        style={{width:245,height:36,resizeMode:'cover'}}
      />
    </View>
      <View className="flex  p-3 gap-4">
      <Text className="text-3xl text-center font-bold py-3">Information</Text>
      <View className="flex-row items-center gap-2 w-72 bg-gray-100 pb-2 rounded-md shadow-md">
      
      <TextInput placeholder='ID' onChangeText={(text) => setId(text)} value={id} />
      </View>

      
      
      <TouchableOpacity className="bg-primary rounded-md shadow-md p-3" onPress={fetchTeacher} >
        <Text className="text-white text-center">Sauvgarder</Text>
      </TouchableOpacity>
      
       
      
      
      </View>
    </SafeAreaView>
  )
}

export default Information