import { View, Text, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import QrScanner from '../components/QrScanner';
import Toast from 'react-native-toast-message';

const ScanAttendance = ({route}) => {
    const [showScanner,setShowScanner]=useState(false);
    const [loading,setLoading]=useState(false);
    const navigation=useNavigation();
    const [checkStudent, setCheckStudent] = useState(true);
    const [checkAttendance, setCheckAttendance] = useState(false);
    const [showPresence, setShowPresence] = useState(true);
    const [showAbsense, setShowAbsense] = useState(false);
    const {classId,groupeId,date}=route.params;
    const [attendances,setAttendance]=useState(null);
    const [students,setstudents]=useState(null);
    const [absenses,setAbsense]=useState(null);
    
    const showToast = (text) => {
  
      Toast.show({
        type: 'error',
        text1: 'error',
        text2: text
      });
    }
    const searchAttendance = (text) => {
      
     if(attendances){
      if (text.trim() === "") {
        fetchAttendance();
       } else {
         
         const filteredAttendance = attendances.filter((attendance) =>
           attendance.student.lastname.toLowerCase().includes(text.toLowerCase()) ||
           attendance.student.firstname.toLowerCase().includes(text.toLowerCase())
         );
         setAttendance(filteredAttendance);
       }
     }
    };
    const searchAbsence = (text) => {
     
      if (text.trim() === "") {
       fetchAttendance();
      } else {
        
        const filteredAttendance = attendances.filter((attendance) =>
          attendance.student.lastname.toLowerCase().includes(text.toLowerCase()) ||
          attendance.student.firstname.toLowerCase().includes(text.toLowerCase())
        );
        setAttendance(filteredAttendance);
      }
    };
    const displayPresence=()=>{
      setShowPresence(true);
      setShowAbsense(false);
    }
    const displayAbsense=()=>{
      const absentStudents = students.filter(student => !attendances.some(attendance => attendance.studentId === student.studentId));
      
  setAbsense(absentStudents);
      setShowPresence(false);
      setShowAbsense(true);
    }
    const fetchAttendance=async()=>{
      setLoading(true);
        try {
         const { data, error } = await supabase
         .from('attendance')
         .select('*,student(*)')
         .eq('classId', classId);
         
       if (error) {
         Alert.alert("error : "+error.message)
       }else{
        setAttendance(data);
       }
   
        } catch (error) {
         if (error instanceof Error) {
           Alert.alert(error.message)
         }
        }
        setLoading(false);
       }


       const fetchStudents=async()=>{
        
        try {
         const { data, error } = await supabase
         .from('student')
         .select('*')
         .eq('groupeId', groupeId);
         
       if (error) {
         Alert.alert("error : "+error.message)
       }else{
        setstudents(data);
       }
   
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
                
                 fetchAttendance();
                 fetchStudents();
                 
                }
                      
                     })
        }
    
         fetchUser();
        if ( !checkStudent) {
          showToast("l'étudiant n'appartient pas à ce groupe");
          setCheckStudent(true);

        }

        if ( checkAttendance) {
          showToast("présence déjà ajoutée");
          setCheckAttendance(false);

        }
          },[checkStudent,checkAttendance])
  return (
  <>
     <Layout title={date} show={true}>
     {loading?
    <View className="grow justify-center">
    <ActivityIndicator size="xlarge" color="#0245D1" />
    {/* You can change the size and color as per your requirement */}
  </View>:
      <>
      <View className="flex-row py-1">
      <View className="flex-row grow">
      <TouchableOpacity onPress={displayPresence}>
        <Text className={showPresence ? "text-primary text-lg font-bold border-b-4 border-primary pb-2 pr-4":"text-[#ccc] text-lg font-bold border-b-4 border-[#ccc] pb-2 pr-4"}>Présence</Text>
        </TouchableOpacity>
      <TouchableOpacity onPress={displayAbsense}>
       
        <Text className={showAbsense ? "text-primary text-lg font-bold border-b-4 border-primary pb-2 pr-4":"text-[#ccc] text-lg font-bold border-b-4 border-[#ccc] pb-2 pr-4"}>Absence</Text>
      </TouchableOpacity>
      </View>
      <View className="flex-row gap-x-2 items-center">
      <Text className="text-[#aaa] text-lg font-medium">{showPresence ?attendances?attendances.length:0:absenses?absenses.length:0}/{students && students.length}</Text>
      <FontAwesome5 name="users" size={24} color="#aaa" />
      </View>
     </View>
 
 {
  showPresence && <View className=" h-[70%]">
  <View className=" flex-row gap-2 items-center  bg-gray-100 pr-2 pb-2 rounded-md shadow-md  m-1">
  <AntDesign name="search1" size={18} color="#aaa" />
  <TextInput  placeholder='Recherche...' className="grow" onChangeText={(text) => searchAttendance(text)}/>
  </View>
 <FlatList 
showsVerticalScrollIndicator={false}

  data={attendances}
  renderItem={({ item: attendance }) => (
    <View className="bg-white  border-gray-300 rounded-md p-4 shadow-md shadow-black flex-row justify-between items-center my-2 mx-1" key={attendance.studentId}>
      <View className="grow flex-row gap-x-2">
        <Text className="text-lg font-semibold">{attendance.student?.lastname}</Text>
        <Text className="text-lg font-semibold">{attendance.student?.firstname}</Text>
      </View>
      <AntDesign name="checkcircle" size={20} color="#22ba43" />
    </View>
  )}
  keyExtractor={(attendance) => attendance.attendanceId}
/>
 </View>
 }

 {
  showAbsense && <View className=" h-[70%]">
 <FlatList 
 showsVerticalScrollIndicator={false}
  data={absenses}
  renderItem={({ item: absense }) => (
    <View className="bg-white border border-gray-300 rounded-md p-4 shadow-lg shadow-black flex-row justify-between items-center my-2 mx-1" key={absense.studentId}>
      <View className="grow flex-row gap-x-2">
        <Text className="text-lg font-semibold">{absense?.lastname}</Text>
        <Text className="text-lg font-semibold">{absense?.firstname}</Text>
      </View>
      <AntDesign name="questioncircle" size={22} color="#aaa" />
    </View>
  )}
  keyExtractor={(absense) => absense.studentId}
/>
 </View>
 }

 <TouchableOpacity className="bg-primary p-2 rounded-full self-center" onPress={()=>setShowScanner(true)}>
 <AntDesign name="qrcode" size={28} color="#fff"  />
 </TouchableOpacity>
      </>
     }
 
   </Layout>
  {
    showScanner &&
   <SafeAreaView className=" bg-white w-full h-full">
    <QrScanner classId={classId} groupeId={groupeId} hideQrScanner={setShowScanner} refrechList={fetchAttendance} setCheckAttendance={setCheckAttendance} setCheckStudent={setCheckStudent}/>
     
    </SafeAreaView>
  }
  <Toast 
   
  />
  </>
  )
}

export default ScanAttendance