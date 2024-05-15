import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { MaterialIcons } from '@expo/vector-icons'
import Message from '../components/Message'
import moment from 'moment'
const Messages = () => {
    const scrollViewRef = useRef(null);
    const[messages,setMessages]=useState([]);
    const[message,setMessage]=useState('');
    const [session,setSession]=useState();
    const[institute,setInstitute]=useState();
   

   const fetchInstitInfo=(id)=>{
  supabase.from('institute').select('*,profiles(*)').eq('userId',id).single().then(
          result=>{
            if(!result.error){
                setInstitute(result.data)
          
            }else{
              Alert.alert("error : "+result.error.message)
            }
          }
        )
    }
    const fetchInstit=(id)=>{
        supabase.from('teacherUser').select('*,teacher(instituteId)').eq('userId',id).single().then(
          result=>{
            if(!result.error){
             fetchInstitInfo(result.data.teacher.instituteId)
          
            }else{
              Alert.alert("error : "+result.error.message)
            }
          }
        )
          }

    const fetchMessages=(id)=>{
        supabase.from('messages').select('*').or(`recieverId.eq.${id},senderId.eq.${id}`).then(
            result=>{
                if(!result.error){
                   setMessages(result.data)
                   scrollViewRef &&  scrollViewRef.current.scrollToEnd({ animated: true });
                   
                }else{
                    console.log(result.error.message);
                }
            }
        )
    }
    const sendMessage=()=>{
       
        if(message!==''){
            addConversation();
           
    }

    }

    const addMessage=(id)=>{
        const currentTime = moment().format('h:mm A');
        supabase.from('messages').insert({text:message,senderId:session.user.id,recieverId:institute.userId,date:new Date(),time:currentTime,status:'unseen',conversationId:id}).then(
            result=>{
                if (result.error) {
                 
                }else{
                   setMessage('');
                   scrollViewRef.current.scrollToEnd({ animated: true });
                }
                
            }
           );
       }

    const addConversation=()=>{
           if(messages.length===0){
            supabase.from('conversation').insert({}).select('*').single().then(
                result=>{
                    if (result.error) {
                       console.log(result.error.message)
                    }else{
                    const  convId=result.data.conversationId;
                     addMessage(convId)
                    }
                    
                }
               );
           }else{
            const convId=messages[0].conversationId;
            addMessage(convId)
           }
            
          
    }

  

    const updateMessages=(id)=>{
      
       
            supabase.from('messages').update({status:'seen'}).match({recieverId:id,status:'unseen'}).then(
                result=>{
                    if (result.error) {
                    
                    }
                }
               );
           
    }

    useEffect(()=>{
        supabase.auth.getSession().then(({ data: { session } }) => {
      
            if (session && session.user) {
             setSession(session);
             fetchMessages(session.user.id);
            fetchInstit(session.user.id);
            updateMessages(session.user.id);
           
            } 
            
            
          });
       
          
    },[]);
    useEffect(()=>{
        const changes = supabase
        .channel('table-db')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            
          },
          (payload) => { 
            setMessages(prevMessages => [...prevMessages, payload.new]);
          try {
            scrollViewRef &&  scrollViewRef.current.scrollToEnd({ animated: true });
          } catch (error) {
            
          }
        }
             
      
        )
        .subscribe();
    },[])
  return (
   <Layout show={true} messages={true} title={institute && institute.name} avatar={institute && institute.profiles.avatar} >
  
  <View className='gap-y-1 flex-1'>
  
  <ScrollView  
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={style.scrollViewContent}
    ref={scrollViewRef}
    
  >
 {
    messages && messages.map(message=>(
      <Message message={message} userId={session.user.id} key={message.messageId}/>
    ))
 }
  </ScrollView>
  
<View className='flex-row gap-x-2 justify-center items-center mb-2'>
 <TextInput placeholder='Message...' className="grow bg-gray-200 rounded-full p-2" value={message} onChangeText={(text) => setMessage(text)}/>
 <TouchableOpacity onPress={sendMessage}>
 <MaterialIcons name="send" size={34} color={message?"#0245D1":"#aaa"}/> 
 </TouchableOpacity>
 </View>

 </View>

   </Layout>
  )
}

export default Messages;

const style=StyleSheet.create(
    {
        scrollViewContent: {
            flexGrow: 1,
            justifyContent: 'flex-end',
            
          },
    }
);