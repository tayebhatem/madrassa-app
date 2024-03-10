import { View, Text } from 'react-native'
import React from 'react'
import Layout from '../components/Layout'

const ClassPick = () => {
  return (
    <Layout title={'Emploi du temps'}>
    <View
   
     className="grow py-3 gap-y-3 ">
     
    {
     schedule && schedule.map(item=>(
      
       <View className="bg-white rounded-md p-4 shadow-md shadow-black " key={item.scheduleId} >
         <View className="flex-row items-center justify-between" key={item.scheduleId}>
         <Text className="text-lg">{item.day}</Text>
         <Text className="text-gray-400 text-lg">{item.time}</Text>
         </View>
         <Text className="text-lg">{item.groupe.level+" "+specialites.flatMap(item=>item).find(speciality=>speciality.id===item.groupe.speciality)?.name+" "+item.groupe.groupeNum}</Text>
       </View>
    
     ))
    }
    </View>
    </Layout>
  )
}

export default ClassPick