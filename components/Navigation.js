import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5,FontAwesome, AntDesign } from '@expo/vector-icons'
import {  useNavigation, useRoute } from '@react-navigation/native'
import { supabase } from '../lib/supabase'

const Navigation = () => {
  const navigation=useNavigation();
  const route = useRoute();
  const [unseenMessages,setUnseenMessages]=useState([]);
  const [session,setSession]=useState()
  // Accessing the screen name
  const screenName = route.name;
 useEffect(()=>{
  
  const fetchMessages=(id)=>{
    supabase.from('messages').select('*').eq('recieverId',id).eq('status','unseen').then(
        result=>{
            if(!result.error){
              setUnseenMessages(result.data)
            
            }
        }
    )
}
supabase.auth.getSession().then(({ data: { session } }) => {
      
  if (session && session.user) {
    setSession(session);
  fetchMessages(session.user.id);
  } 
  
  
});

 },[])
 useEffect(()=>{
  session && supabase
  .channel('table-db')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages',
      filter: `recieverId.eq.${session.user.id}`
    },
    (payload) => {
      setUnseenMessages([]);
      console.log('seen')
    
    }
       

  )
  .subscribe();
 },[])

 useEffect(()=>{
  session && supabase
  .channel('table-db')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `recieverId.eq.${session.user.id}`
    },
    (payload) => setUnseenMessages(prevMessages => [...prevMessages, payload.new])
       

  )
  .subscribe();
 },[])
  return (
    <View className="w-screen -mx-3 px-3 pt-2 border-t border-gray-200  flex-row justify-between bg-white">
      <TouchableOpacity className="justify-center items-center " onPress={()=>navigation.navigate('Home')}>
      <FontAwesome5 name="home" size={28} color={screenName==='Home'?"#0245D1":"#aaa"}  />
      <Text className={screenName==='Home'?"text-primary font-medium capitalize":"text-gray-400 font-medium capitalize"}>accueil</Text>
      </TouchableOpacity>

      <TouchableOpacity className="justify-center items-center " onPress={()=>navigation.navigate('Messages')}>
      {unseenMessages.length>0 && <View className='absolute z-50 right-2 top-0 w-6 h-6 rounded-full bg-red-500  items-center justify-center '>

       <Text className='text-white font-medium'>{unseenMessages.length}</Text>
     </View>
     }
      <AntDesign name="message1" size={28} color="#aaa"  />
      
      <Text className="text-gray-400 font-medium capitalize" >Messages</Text>

      </TouchableOpacity>

      <TouchableOpacity className="justify-center items-center ">
      <FontAwesome name="bell" size={28} color="#aaa"/>
      <Text className="text-gray-400 font-medium capitalize">notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity className="justify-center items-center " onPress={()=>navigation.navigate('Profile')}>
      <FontAwesome5 name="user-alt" size={28}  color={screenName==='Profile'?"#0245D1":"#aaa"}  />
      <Text className={screenName==='Profile'?"text-primary font-medium capitalize":"text-gray-400 font-medium capitalize"}>profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Navigation