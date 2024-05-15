import { View, ActivityIndicator } from 'react-native'
import React from 'react'

const Loader = () => {
  return (
    <View className='absolute w-full h-full  top-0 left-0 z-50 '>
    <View className="absolute w-full h-full bg-black opacity-25">

    </View>
     <View className="absolute w-full h-full flex justify-center items-center">
    <View className='bg-white p-8'>
    <ActivityIndicator size="xlarge" color="#0245D1"  />
    </View>
  </View>
    </View>
  )
}

export default Loader