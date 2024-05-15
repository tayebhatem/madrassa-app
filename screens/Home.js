import { View, Text,Dimensions, TouchableOpacity, ActivityIndicator,FlatList,Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import Animated from 'react-native-reanimated'

const Home = () => {
  const postSilder=useRef()
  const navigation=useNavigation();
  const [loading,setLoading]=useState(true);
  const[ posts,setPosts]=useState([]);
  const [activeIndex,setActiveindex]=useState(0)
  const [teacher,setTeacher]=useState()
  const fetchPosts=(instituteId,userId)=>{
      supabase.from('posts').select('*').eq('userId',instituteId).then(
        result=>{
          if(!result.error){
               setPosts(result.data)
          }
        }
      )
  }
  const postItems=({ item: postItem }) => (
    <View className='w-screen pl-1     '>
  <View className=" p-3 rounded-md bg-blue-600  shadow-lg shadow-black  mx-4        my-2 grow  "   >
     <View className=' flex-row justify-between'>
     <Text className=' text-white'>
    {postItem.date}
     </Text>
     <View className="">
   <FontAwesome name="bell" size={26} color="#FFF" />
   </View>
     </View>
      <View className="grow truncate  ">
     
      <Text className="text-lg text-white   ">
       {postItem.context}
      
      </Text>
      </View>
      
      
  
  </View>
    </View>
    
  );

  const indicators=({ item: postItem,index:index }) => (

      <View className={activeIndex===index?'w-3 h-3 rounded-full bg-blue-600 mx-1 self-center':'w-2 h-2 rounded-full bg-gray-300 mx-1 self-center'}>
  
    </View>
    
    
  );

  const haldleScroll=(e)=>{
  const screenWidth=Dimensions.get('window').width
  const scrolPosition=e.nativeEvent.contentOffset.x;
  const index=Math.round(scrolPosition/screenWidth)
  setActiveindex(index);
  }
  useEffect(()=>{

    let intervel=setInterval(() => {
      if(activeIndex===posts.length-1){
     postSilder.current.scrollToIndex({index:0,Animated:true})
      }else{
        postSilder.current.scrollToIndex({index:activeIndex+1,Animated:true})
      }
    },5000);

    return ()=>clearInterval(intervel);


  })
  useEffect(() => {
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      
      if (session && session.user) {
        supabase.from('teacherUser')
        .select('*,teacher(*)').eq('userId', session.user.id)
        .single().then(
          result=>{
            if(!result.data){
              navigation.navigate('Information');
            }else{
              setTeacher(result.data.teacher)
              fetchPosts(result.data.teacher.instituteId,session.user.id);

              setLoading(false);


            }
          }
        );
      } else{
        navigation.navigate('Login')
      }
      
      
    })
   
  }, [])

  useEffect(()=>{
   teacher && supabase
    .channel('table-db')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
      },
      (payload) => setPosts(prevPosts => [...prevPosts, payload.new])
         
  
    )
    .subscribe();
   },[])
  return (
  <>
  {loading?
    <View className="grow justify-center">
    <ActivityIndicator size="xlarge" color="#0245D1" />
   
  </View>:<Layout title={'Accuil'}>
     
    <View className='h-2/6' >
   
    <FlatList 
    ref={postSilder}
    className='flex-row gap-x-5 '
   horizontal={true}
  pagingEnabled={true}
  onScrollAnimationEnd={true}
showsHorizontalScrollIndicator={false}
data={posts}
renderItem={postItems}
keyExtractor={(postItem) => postItem.postId}
onScroll={haldleScroll}
/>


   

    </View>
 {
  posts.length>1 && <View  className='justify-center items-center py-1'>
  <FlatList 
   
   horizontal={true}

showsHorizontalScrollIndicator={false}
data={posts}
renderItem={indicators}
keyExtractor={(postItem) => postItem.postId}
/>
  </View>
 }
 
     <View className="grow gap-y-4 mb-4 mt-1 ">
     
      

     <View className='grow flex-row gap-x-2'>
     <TouchableOpacity className="grow bg-white  shadow-lg shadow-black      items-center justify-center   " onPress={()=>navigation.navigate('Attendance')}>
      <Image
        source={require('../assets/attendance.png')}
        style={{width:60,height:60,resizeMode:'cover'}}
      />

        <Text className=" font-medium text-gray-500   text-xl" >Présence</Text>
      </TouchableOpacity>

      <TouchableOpacity className="grow bg-white shadow-lg shadow-black    items-center justify-center  ">
      <Image
        source={require('../assets/icons8-document-50.png')}
        style={{width:60,height:60,resizeMode:'cover'}}
      />
        <Text className=" font-medium text-gray-500 text-xl">Notes</Text>
      </TouchableOpacity>
     </View>


    <View className='grow flex-row gap-x-2'>
    <TouchableOpacity className="grow bg-white  shadow-lg shadow-black   items-center justify-center  ">
    <Image
        source={require('../assets/icons8-livre-50.png')}
        style={{width:60,height:60,resizeMode:'cover'}}
      />
        <Text className="  text-gray-500 font-medium text-xl">Cours</Text>
      </TouchableOpacity>

      <TouchableOpacity className="grow bg-white shadow-lg shadow-black     items-center justify-center " onPress={()=>navigation.navigate('Schedule')}>
      <Image
        source={require('../assets/icons8-heures-supplémentaires-50.png')}
        style={{width:60,height:60,resizeMode:'cover'}}
      />
        <Text className="  text-gray-500 font-medium text-xl">Emploi</Text>
      </TouchableOpacity>
    </View>
     
     </View>
         </Layout>
  }
  </>
  )

}

export default Home