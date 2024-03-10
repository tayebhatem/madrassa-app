
import React, { useEffect, useState } from 'react'
import { View, Text, Alert, ScrollView, FlatList, ActivityIndicator} from 'react-native'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { specialitesList } from '../data/speciality'

const Schedule = () => {
  const [loading,setLoading]=useState(false);
    const [schedule,setSchedule]=useState(null)
    const specialites=specialitesList.find(speciality=>speciality.language==='french')?.specialites;

    const fetchSchedule=async(id)=>{
    
     try {
      const { data, error } = await supabase
      .from('schedule')
      .select('*,groupe(*)')
      .eq('teacherId', id)
      
      
      
    if (error) {
      Alert.alert("error : "+error.message)
    }else{
      setSchedule(data);
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
      fetchSchedule(data.teacherId);
     }
 
     
      } catch (error) {
       if (error instanceof Error) {
         Alert.alert(error.message)
       }
      }
      setLoading(false)
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
   <Layout title={'Emploi du temps'} show={true}>
  {loading?
    <View className="grow justify-center">
    <ActivityIndicator size="xlarge" color="#0245D1" />
   
  </View>:
    <View
  
  className="h-[85%]  ">
  
  <FlatList 
showsVerticalScrollIndicator={false}
data={schedule}
renderItem={({ item: scheduleItem }) => (
  <View className="bg-white border border-gray-300 rounded-md p-4 shadow-lg shadow-black  my-2 mx-1" key={scheduleItem.scheduleId}>
    <View className="flex-row items-center justify-between" key={scheduleItem.scheduleId}>
      <Text className="text-lg font-bold">{scheduleItem.day}</Text>
      <Text className="text-gray-400 text-lg">{scheduleItem.time}</Text>
      </View>
      <Text className="text-lg">{scheduleItem.groupe.level+" "+specialites.flatMap(item=>item).find(speciality=>speciality.id===scheduleItem.groupe.speciality)?.name+" "+scheduleItem.groupe.groupeNum}</Text>
  </View>
)}
keyExtractor={(scheduleItem) => scheduleItem.scheduleId}
/>


 </View>
  }
   </Layout>
  )
}

export default Schedule