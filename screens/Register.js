import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity,Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase'
import Toast from 'react-native-toast-message'

const Register = () => {
  const showToast = (text) => {
  
    Toast.show({
      type: 'error',
      text1: 'error',
      text2: text
    });
  }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConf, setPasswordConf] = useState('')
  const [loading, setLoading] = useState(false)
    const navigation=useNavigation();
    const[hiddePassword,setHiddePassword]=useState(true);
    const[hiddePasswordConf,setHiddePasswordConf]=useState(true);
    const [session, setSession] = useState(null)
    const  signUpWithEmail=async()=> {
     
      if(email!=='' && password!==''){
        if(password===passwordConf){
        setLoading(true)
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        })
    
    
        if (error) showToast(error.message)
        
      
        setLoading(false)
        if(!error){

          supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
          })
      
        
        }
        
      }
       }else{
         Alert.alert('empty inputs')
       }
     
     }
     


  useEffect(() => {
    {session && session.user && navigation.navigate('Information')}
  }, [session])
 
    return (
      <SafeAreaView  className="flex-1 items-center  bg-white">
      <View className="bg-primary w-full rounded-b-3xl p-24 flex justify-center items-center ">
      <Image
          source={require('../assets/logo.png')}
          style={{width:245,height:36,resizeMode:'cover'}}
        />
      </View>
        <View className="flex  p-3 gap-4">
        <Text className="text-3xl text-center font-bold py-3">Inscrire</Text>
        <View className="flex-row items-center gap-2 w-72 bg-gray-100 pb-2 rounded-md shadow-md">
        <FontAwesome5 name="user-alt" size={18} color="#aaa"  />
        <TextInput placeholder='Email' onChangeText={(text) => setEmail(text)} value={email} />
        </View>
  
        <View className="flex-row gap-2 items-center w-72 bg-gray-100 pr-2 pb-2 rounded-md shadow-md">
        <FontAwesome5 name="lock" size={18} color="#aaa"   />
       <TextInput placeholder='Mot de pass'secureTextEntry={hiddePassword} className="grow"  value={password} onChangeText={(text) => setPassword(text)}/>
       {
          hiddePassword?
          <TouchableOpacity onPress={()=>setHiddePassword(false)}>
          <FontAwesome5 name="eye" size={18} color="#aaa"/>
          </TouchableOpacity>:
          <TouchableOpacity onPress={()=>setHiddePassword(true)}>
          <FontAwesome5 name="eye-slash" size={18} color="#aaa" />
          </TouchableOpacity>
          
       }
       </View>
       <View className="flex-row gap-2 items-center w-72 bg-gray-100 pr-2 pb-2 rounded-md shadow-md">
        <FontAwesome5 name="lock" size={18} color="#aaa"   />
       <TextInput placeholder='Confirmer le mot de pass'secureTextEntry={hiddePasswordConf} className="grow" value={passwordConf} onChangeText={(text) => setPasswordConf(text)}/>
       {
          hiddePasswordConf?
          <TouchableOpacity onPress={()=>setHiddePasswordConf(false)}>
          <FontAwesome5 name="eye" size={18} color="#aaa"/>
          </TouchableOpacity>:
          <TouchableOpacity onPress={()=>setHiddePasswordConf(true)}>
          <FontAwesome5 name="eye-slash" size={18} color="#aaa" />
          </TouchableOpacity>
          
       }
       </View>
    
    
        <TouchableOpacity className="bg-primary rounded-md shadow-md p-3" onPress={() => signUpWithEmail()} >
          <Text className="text-white text-center font-semibold">Inscrire</Text>
        </TouchableOpacity>
        <View className="relative py-4 justify-center items-center">
        <View className="absolute w-full h-0.5 bg-gray-200 top-4 "></View>
          <Text className="absolute text-gray-400 bg-white     z-20">Ou</Text>
        </View>
        <TouchableOpacity className="flex-row justify-center gap-1 items-center border border-gray-200 p-3 rounded-md">
        <Image
          source={require('../assets/google.png')}
          className="w-8 h-8"
        />
        <Text >Connectez-vous avec Google</Text>
        </TouchableOpacity>

        <View className="flex flex-row">
        <Text className="">Vous avez déjà un compte ? </Text>
        <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
        <Text className="font-semibold text-primary">Se connecter</Text>
      </TouchableOpacity>
        
      
        </View>
        
        </View>
        <Toast 
   
   />
      </SafeAreaView>
    )
}

export default Register