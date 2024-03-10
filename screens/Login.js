import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity,Image, Alert,AppState, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase'
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})


const Login = ({}) => {
  const [email, setEmail] = useState('')
  const [loading,setLoading]=useState(false);
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(null)
  const [wrongUser, setwrongUser] = useState(false);
  const [errors, setErrors] = useState({}); 
    const [isFormValid, setIsFormValid] = useState(false); 
  
    const validateForm = () => { 
        let errors = {}; 
  
       
  
        // Validate email field 
        if (!email) { 
            errors.email = 'Email est requis'; 
        } else if (!/\S+@\S+\.\S+/.test(email)) { 
            errors.email = 'Email est invalid.'; 
        } 
  
        // Validate password field 
        if (!password) { 
            errors.password = 'Mot de pass est requis'; 
        } else if (password.length < 6) { 
            errors.password = 'Mot de passe doit être au moins de 6 caractères'; 
        } 
  
        // Set the errors and update form validity 
        setErrors(errors); 
        setIsFormValid(Object.keys(errors).length === 0); 
    }; 
    const navigation=useNavigation();
    const[hiddePassword,setHiddePassword]=useState(true);

    async function signInWithEmail() {
     if(isFormValid){
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      if(error){
        error.message==='Invalid login credentials'? setwrongUser(true):setwrongUser(false)
        
        
      }else{
      
        navigation.navigate('Home');
        setwrongUser(false);
        setEmail('');
        setPassword('');
    }
    
     }
     setLoading(false);
    }
    useEffect(() => {
      validateForm(); 
    }, [email,password])
    
  return (
    <SafeAreaView className="flex-1 items-center  bg-white">
   {
    loading?<View className="grow justify-center">
    <ActivityIndicator size="xlarge" color="#0245D1" />
    {/* You can change the size and color as per your requirement */}
  </View>:<>
    <View className="bg-primary w-full rounded-b-3xl p-24 flex justify-center items-center ">
    <Image
        source={require('../assets/logo.png')}
        style={{width:245,height:36,resizeMode:'cover'}}
      />

    </View>
      <View className="flex  p-3 gap-4">
      <Text className="text-3xl text-center font-bold py-3">Se conncter</Text>
      <View className={wrongUser || (errors && errors.email)?"flex-row items-center gap-2 w-72 bg-gray-100 border border-red-500 pb-2 rounded-md shadow-md":"flex-row items-center gap-2 w-72 bg-gray-100 border border-gray-200 pb-2 rounded-md shadow-md"}>
      <FontAwesome5 name="user-alt" size={18} color="#aaa"  />
      <TextInput placeholder='Email' onChangeText={(text) => setEmail(text)} value={email} />
      </View>
     {
      errors && errors.email  && <Text className="text-red-500">{errors.email}</Text>
     }
      <View className={wrongUser || (errors && errors.password)?"flex-row items-center gap-2 w-72 bg-gray-100 border border-red-500 pb-2 pr-1 rounded-md shadow-md":"flex-row items-center pr-1 gap-2 w-72 bg-gray-100 border border-gray-200 pb-2 rounded-md shadow-md"}>
      <FontAwesome5 name="lock" size={18} color="#aaa"   />
     <TextInput placeholder='Mot de pass'secureTextEntry={hiddePassword} className="grow" value={password} onChangeText={(text) => setPassword(text)}/>
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
     {
      errors && errors.password  && <Text className="text-red-500">{errors.password}</Text>
     }
       <Text className="font-medium text-primary">Mot de passe oublié ?</Text>
       {
        wrongUser && <Text className="text-center text-red-500">Mauvais email ou mot de passe !</Text>
       }
      <TouchableOpacity className="bg-primary rounded-md shadow-md p-3" onPress={signInWithEmail} >
        <Text className="text-white text-center font-semibold">Se connceter</Text>
      </TouchableOpacity>
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
    </>
   }
    </SafeAreaView>
  )
}

export default Login