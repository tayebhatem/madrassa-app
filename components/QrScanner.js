import React, { useState, useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

export default function QrScanner({classId,groupeId,hideQrScanner,refrechList,setCheckStudent,setCheckAttendance}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  
 

  const searchStudent=(id)=>{
    try {
          supabase
     .from('student')
     .select('*')
     .eq('studentId',id)
     .eq('groupeId',groupeId)
     .single()
     .then(
        result=>{
           
              
                if(result.data){
                    setCheckStudent(true)
                 searchAttendance(id);
                }else{
                    setCheckStudent(false)
                    hideQrScanner(false);
                }

            
        }
     )
    } catch (error) {
     if (error instanceof Error) {
       Alert.alert(error.message)
     }
    }
    
   }

   const searchAttendance=(id)=>{
    try {
          supabase
     .from('attendance')
     .select('*')
     .eq('studentId',id)
     .eq('classId',classId)
     .single()
     .then(
        result=>{
            
              
                if(result.data){
                    setCheckAttendance(true)
                 hideQrScanner(false);
                }else{
                    setCheckAttendance(false)
                   insertAttendance(id)
                }

            
        }
     )
    } catch (error) {
     if (error instanceof Error) {
       Alert.alert(error.message)
     }
    }
    
   }
  
  const insertAttendance=async(id)=>{

  
    try {
        await supabase
    .from('attendance')
    .insert({classId:classId,studentId:id})
    .then(
       result=>{
           if (result.error) {
               Alert.alert(result.error.message)
           }else{
           refrechList();
            hideQrScanner(false);

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
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    const id=Number(data);
    searchStudent(id);
    
    
   
  };

  

  return (
    
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
       className="grow"
      />
     

  );
}


