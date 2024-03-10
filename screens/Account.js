import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import ProfileLayout from '../components/ProfileLayout'
import { supabase } from '../lib/supabase'
import { useNavigation } from '@react-navigation/native'
import { subjects } from '../data/subjects'

const Account = ({route}) => {
    const navigation=useNavigation();
    const {teacher}=route.params;
    const [institute,setInstitute]=useState(null)
    const [session,setSession]=useState(null)
    const list = subjects.find(subject => subject.language === 'french').subjects;
   
   
    useEffect(() => {
      const fetchInstit=()=>{
        supabase.from('institute').select('*').eq('userId',teacher.teacher.instituteId).single().then(
          result=>{
            if(!result.error){
              setInstitute(result.data)
          
            }else{
              Alert.alert("error : "+result.error.message)
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
                fetchInstit();
                
              }
            })
          }
          
    checkSession()
  
    }, [])
    return (
      <ProfileLayout title={'Compte'}>
         
       
       <View className=" relative bg-white top-1/4   shadow-md shadow-black w-full  p-3 rounded-md">
      
       
       
       
       
       <View>
     <Text className="font-medium my-1">ID</Text>
     <Text className="bg-gray-100 p-3 rounded-md text-gray-500">{teacher.teacher.teacherId}</Text>
     </View>
       <View>
     <Text className="font-medium my-1">Email</Text>
     <Text className="bg-gray-100 p-3 rounded-md text-gray-500">{session && session.user.email}</Text>
     </View>
     <View>
     <Text className="font-medium my-1">Nom</Text>
     <Text className="bg-gray-100 p-3 rounded-md  text-gray-500 capitalize">{teacher.teacher.lastname}</Text>
     </View>
     <View>
     <Text className="font-medium my-1">Prénom</Text>
     <Text className="bg-gray-100 p-3 rounded-md  text-gray-500 capitalize">{teacher.teacher.firstname}</Text>
     </View>

     <View>
     <Text className="font-medium my-1">Matière</Text>
     <Text className="bg-gray-100 p-3 rounded-md  text-gray-500 capitalize">{list.find(subject=>subject.id===teacher.teacher.subject)?.name}</Text>
     </View>
     <View>
     <Text className="font-medium my-1 capitalize">établissement</Text>
     <Text className="bg-gray-100 p-3 rounded-md  text-gray-500 capitalize">{institute && institute.name}</Text>
     </View>
       
       
   
       
        </View>
      </ProfileLayout>
    )
}

export default Account