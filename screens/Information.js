import { View, Text, TextInput, TouchableOpacity,Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import Loader from '../components/Loader'

const Information = () => {
  const [loading, setLoading] = useState(false);
    const navigation=useNavigation();
    const [id, setId] = useState('');
    const [session, setSession] = useState(null)
    const showToast = (text) => {
  
      Toast.show({
        type: 'error',
        text1: 'error',
        text2: text
      });
    }
    const createAccount=()=>{
     if(id){
     try {
      setLoading(true);

      supabase.from('teacher').select('*').eq('teacherId',id).single().then(
          result=>{
             if(result.error){
           showToast(result.error.message)
             }else{
              if(result.data){
                saveInfo();
            }else{
             
                showToast('Aucun enseignant avec cet identifiant');
               
            }
             }
              setLoading(false);
          }
      )
     } catch (error) {
      showToast(error.message)
     }
     }
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
        if (!session) {
         navigation.navigate('Login');
        }else{
          setSession(session);
        }
      })
    },[])
  return (
    <>
    {loading && <Loader/>}
      <SafeAreaView className="flex-1 items-center  bg-white">
    <View className="bg-primary w-full rounded-b-3xl p-24 flex justify-center items-center ">
    <Image
        source={require('../assets/logo.png')}
        style={{width:245,height:36,resizeMode:'cover'}}
      />
    </View>
      <View className="flex  p-3 gap-4">
      <Text className="text-2xl text-center font-medium py-3">Entrer votre identifiant</Text>
      <View className="flex-row items-center gap-2 w-72 border border-gray-200 bg-gray-100 pb-2 rounded-md shadow-md">
      
      <TextInput placeholder='ID' onChangeText={(text) => setId(text)} value={id}  />
      </View>

      
      
      <TouchableOpacity className="bg-primary rounded-md shadow-md p-3" onPress={createAccount} >
        <Text className="text-white text-center">Sauvgarder</Text>
      </TouchableOpacity>
      
       
      
      
      </View>
      <Toast />
    </SafeAreaView>
    </>
  )
}

export default Information