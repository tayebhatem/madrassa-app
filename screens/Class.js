import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';


const Class = ({ route }) => {
    const [showSchedule,setShowSchedule]=useState(false);
    const [loading,setLoading]=useState(false);
    const navigation=useNavigation();
    const {groupeId,teacherId}=route.params;
    const [schedule,setSchedule]=useState(null)
    const [classes,setClasses]=useState([])
    const [chosenDate, setChosenDate] = useState(new Date());

    const handleDateChange = date => {
      setChosenDate(date);
    };
    const displaySchedule=()=>{
      fetchSchedule()
      setShowSchedule(true);
    }
    const fetchClasses=async()=>{
      setLoading(true)
        try {
         const { data, error } = await supabase
         .from('class')
         .select('*,schedule!inner(*)')
         .eq('schedule.teacherId', teacherId)
         .eq('schedule.goupeId',groupeId)
       if (error) {
         Alert.alert("error : "+error.message)
       }else{
         setClasses(data);
         setLoading(false)
       }
   
        } catch (error) {
         if (error instanceof Error) {
           Alert.alert(error.message)
         }
        }
        
       }

    const fetchSchedule=async()=>{
        try {
         const { data, error } = await supabase
         .from('schedule')
         .select('*')
         .eq('teacherId', teacherId)
         .eq('goupeId',groupeId)
       if (error) {
         Alert.alert("error : "+error.message)
       }else{
         setSchedule(data);
       }
   
        } catch (error) {
         if (error instanceof Error) {
           Alert.alert("error :  "+error.message)
         }
        }
        
       }


       const insertClass=async(id)=>{
        const currentDate = new Date();
        try {
         
             await supabase
         .from('class')
         .insert({scheduleId:id,created_at:currentDate})
         .then(
            result=>{
                if (result.error) {
                    Alert.alert(result.error.message)
                }else{
                    
                    setShowSchedule(false);
                    fetchClasses();

                }
            }
         )
    
         
        } catch (error) {
         if (error instanceof Error) {
           Alert.alert(error.message)
         }
        }
        
       }

       const deleteClass=async(id)=>{
        
        try {
         
             await supabase
         .from('class')
         .delete()
         .eq('classId',id)
         .then(
            result=>{
                if (result.error) {
                    Alert.alert(result.error.message)
                }else{
                    
                fetchClasses();

                }
            }
         )
    
         
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
                    fetchClasses();
                
                }
                      
                     })
        }
    
         fetchUser();
          },[])
         
  return (
   <Layout title={'Séance'} show={true}>
   {loading?
    <View className="grow justify-center">
    <ActivityIndicator size="xlarge" color="#0245D1" />
    {/* You can change the size and color as per your requirement */}
  </View>:
<>
<ScrollView className="relative grow py-3 gap-y-3 " showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
  
 
 
   
   {
    classes && classes.map(item=>(
        <TouchableOpacity className="bg-white rounded-md p-3 shadow-md shadow-black gap-y-2 " key={item.classId} onPress={()=>navigation.navigate('ScanAttendance',{classId:item.classId,groupeId:groupeId,date:item.created_at})}>
     
     
      <View className="flex-row justify-between items-center">
      <Text className="text-xl font-bold">
      {item.created_at}
      
      </Text>
      <TouchableOpacity onPress={()=>deleteClass(item.classId)}>
      <MaterialCommunityIcons name="delete" size={28} color="red"  />
      </TouchableOpacity>
      </View>
      <View className="flex-row justify-between items-center">
      <Text className="text-gray-400 ">{item.schedule?.day}</Text>
      <Text className="text-gray-400 ">
      {item.schedule?.time}
     
      </Text>
      </View>
     
     
      
    </TouchableOpacity>
    ))
   }
 
 
 
 </ScrollView>
 <TouchableOpacity className="bg-primary self-center p-3 rounded-full my-2 " onPress={displaySchedule}>
 <AntDesign name="plus" size={22} color="#fff"  />
 </TouchableOpacity>

 <SafeAreaView
   
     className={showSchedule?"absolute bg-white w-screen h-screen  top-0 transition-all p-3 gap-y-3 ":"absolute bg-white w-screen h-screen top-[110%] transition-all p-3 gap-y-3 "}>
     <TouchableOpacity onPress={()=>setShowSchedule(false)}>
     <AntDesign name="arrowleft" size={34} color="#000"  />
     </TouchableOpacity>
    {
     schedule && schedule.map(item=>(
      
       <TouchableOpacity className="bg-white rounded-md p-4 shadow-md shadow-black " key={item.scheduleId} onPress={()=>insertClass(item.scheduleId)}>
         <View className="flex-row items-center justify-between" key={item.scheduleId}>
         <Text className="text-lg">{item.day}</Text>
         <Text className="text-gray-400 text-lg">{item.time}</Text>
         </View>
       </TouchableOpacity>
    
     ))
    }

    </SafeAreaView>
</>
   }

   </Layout>
  )
}

export default Class