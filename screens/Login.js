import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity,Image, Alert,AppState, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase'
import Loader from '../components/Loader'
import Toast from 'react-native-toast-message'
import { Formik } from 'formik'
import * as yup from 'yup'
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})


const Login = () => {
 
  
  const [loading,setLoading]=useState(false);
  const [session, setSession] = useState(null)
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Entrer un email valide")
      .required('Adresse email est nécessaire'),
    password: yup
      .string()
      .min(6, ({ min }) => `Le mot de passe doit contenir au moins ${min} caractères`)
      .required('Mot de passe requis'),
  })
    const showToast = (text,type) => {
  
      Toast.show({
        type: type,
        text1: type,
        text2: text
      });
    }
    
   
    const navigation=useNavigation();
    const[hiddePassword,setHiddePassword]=useState(true);

    async function signInWithEmail(values) {
     
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if(error){
        error.message==='Invalid login credentials' && showToast('Mauvais email ou mot de passe !','error')
        
        
      }else{
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
        })
    }
    
     values.email=''
     values.password=''
     setLoading(false);
    }
   
    
    useEffect(() => {
      session && session.user &&  navigation.navigate('Home');
    },[session])
    
  return (
    <>
   {loading && <Loader/>}
    <SafeAreaView className="flex-1 items-center  bg-white">
  
    <View className="bg-primary w-full rounded-b-3xl p-24 flex justify-center items-center ">
    <Image
        source={require('../assets/logo.png')}
        style={{width:245,height:36,resizeMode:'cover'}}
      />

    </View>
      <View className="flex  p-3 gap-4">
      <Text className="text-3xl text-center font-bold py-3">Se conncter</Text>
     
      <Formik
   validationSchema={loginValidationSchema}
   initialValues={{ email: '', password: '' }}
   onSubmit={values => signInWithEmail(values)}
 >
   {({
     handleChange,
     
     handleSubmit,
     values,
     errors,
     isValid,
   }) => (
   <View className='gap-2'>
   <View className={(errors.email)?"flex-row items-center gap-2  bg-gray-100 border border-red-500 pb-2  rounded-md shadow-md"
      :"flex-row items-center gap-2 mb-4 w-72 bg-gray-100 border border-gray-200 pb-2 rounded-md shadow-md"}>
       <FontAwesome5 name="user-alt" size={18} color="#aaa"  />
       <TextInput
         name="email"
         id='email'
         placeholder='Email'
        
         onChangeText={handleChange('email')}
        
         value={values.email}
         keyboardType="email-address"
       />
         </View>
       {errors.email && <Text className="text-red-500">{errors.email}</Text>
       }
        <View className={errors.password ?"flex-row items-center gap-2  bg-gray-100 border border-red-500 pb-2 rounded-md shadow-md"
      :"flex-row items-center gap-2  w-72 bg-gray-100 border border-gray-200 pb-2 rounded-md shadow-md"}>
       <FontAwesome5 name="lock" size={18} color="#aaa" />
       <TextInput
         name="password"
         placeholder="Mot de passe"
        id='password'
         onChangeText={handleChange('password')}
        
         value={values.password}
         secureTextEntry={hiddePassword}
         className='grow'
       />
        {
        hiddePassword?
        <TouchableOpacity onPress={()=>setHiddePassword(false)} className='px-2'>
        <FontAwesome5 name="eye" size={18} color="#aaa"/>
        </TouchableOpacity>:
        <TouchableOpacity onPress={()=>setHiddePassword(true)}>
        <FontAwesome5 name="eye-slash" size={18} color="#aaa" className='px-2'/>
        </TouchableOpacity>
        
     }
       </View>
       {errors.password &&
         <Text className="text-red-500">{errors.password}</Text>
       }
       <Text className="font-medium text-primary">Mot de passe oublié ?</Text>
    
      <TouchableOpacity className="bg-primary rounded-md shadow-md p-3" onPress={handleSubmit} >
        <Text className="text-white text-center font-semibold ">Se connceter</Text>
      </TouchableOpacity>
   </View>
   )}
 </Formik>
      
      <View className="relative py-4 justify-center items-center">
        <View className="absolute w-full h-0.5 bg-gray-200 top-4 "></View>
          <Text className="absolute text-gray-400 bg-white     z-20">Ou </Text>
        </View>
       
       <TouchableOpacity className="flex-row justify-center gap-1 items-center border border-gray-200 p-3 rounded-md">
        <Image
          source={require('../assets/google.png')}
          className="w-8 h-8"
        />
        <Text >Connectez-vous avec Google</Text>
        </TouchableOpacity>
       
     
      <View className="flex flex-row justify-center">
      <Text className="">vous n'avez pas de compte ? </Text>
      <TouchableOpacity onPress={()=>navigation.navigate('Register')}>
      <Text className="font-semibold text-primary">S'inscrire</Text>
      </TouchableOpacity>
      </View>
      
      </View>
   
   <Toast/>
    </SafeAreaView>

    </>
  )
}

export default Login