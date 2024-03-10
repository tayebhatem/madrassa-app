import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { specialitesList } from '../data/speciality'
import { supabase } from '../lib/supabase'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Attendance = () => {
    const [groupes,setGroupes]=useState(null);
    const [loading,setLoading]=useState(true);

    const specialites=specialitesList.find(speciality=>speciality.language==='french')?.specialites;
    const navigation=useNavigation();
    const fetchGroupes=async(id)=>{
      
     try {
      const { data, error } = await supabase
      .from('schedule')
      .select('*,groupe(*)')
      .eq('teacherId', id)
      
      
      
    if (error) {
      Alert.alert("error : "+error.message)
    }else{
        const uniqueGroupes = Array.from(new Set(data.map(item => item.groupe.groupeId)))
                    .map(groupeId => data.find(item => item.groupe.groupeId === groupeId));

                setGroupes(uniqueGroupes);
    }

    
     } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
     }
     
    }

    const fetchTeacher=async(id)=>{
      setLoading(true)
      try {
       const { data, error } = await supabase
       .from('teacherUser')
       .select('teacherId')
       .eq('userId', id)
       .single()
       
       
       
     if (error) {
       Alert.alert("error : "+error.message)
     }else{
        fetchGroupes(data.teacherId);
        setLoading(false)
     }
 
     
      } catch (error) {
       if (error instanceof Error) {
         Alert.alert(error.message)
       }
      }
      
     }
    useEffect(() => {

    fetchUser=async()=>{   

       await supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session && !session.user ) {
             navigation.navigate('Login');
            } else {
             
              fetchTeacher(session.user.id)
            }
                  
                 })
    }

     fetchUser();
      },[])
  return (
  <Layout title={'Présence'} show={true}>
  {
   !loading? <View
  
  className=" grow py-3 gap-y-3 ">
  
 {
  groupes && groupes.map(item=>(
   
    <TouchableOpacity className="bg-white rounded-md px-4 py-6 shadow-md shadow-black " key={item.groupe.groupeId} onPress={()=>navigation.navigate('Class', { groupeId: item.groupe.groupeId,teacherId:item.teacherId })}>
      <Text className="text-xl text-center font-bold">{item.groupe.level+" "+specialites.flatMap(item=>item).find(speciality=>speciality.id===item.groupe.speciality)?.name+" "+item.groupe.groupeNum}</Text>
    </TouchableOpacity>
 
  ))
 }
 
 </View>:<View className="grow justify-center">
    <ActivityIndicator size="xlarge" color="#0245D1" />
    {/* You can change the size and color as per your requirement */}
  </View>
  }

 
  </Layout>
  )
}

export default Attendance