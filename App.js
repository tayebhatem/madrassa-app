import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Register from './screens/Register';
import Home from './screens/Home';
import Information from './screens/Information';
import Schedule from './screens/Schedule';
import Attendance from './screens/Attendance';
import Class from './screens/Class';
import ScanAttendance from './screens/ScanAttendance';
import Profile from './screens/Profile';
import Account from './screens/Account';



const App = () => {
 
  const Stack=createNativeStackNavigator();
  return (
    <SafeAreaProvider>
     <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
    <Stack.Screen
      name='Home'
      component={Home}
      options={{headerShown:false}}
    />
    <Stack.Screen
      name='Login'
      component={Login}
      options={{headerShown:false}}
    />
     <Stack.Screen
      name='Register'
      component={Register}
      options={{headerShown:false}}
    />
    <Stack.Screen
      name='Information'
      component={Information}
      options={{headerShown:false}}
    />
    <Stack.Screen
      name='Schedule'
      component={Schedule}
      options={{headerShown:false}}
    />
     <Stack.Screen
      name='Attendance'
      component={Attendance}
      options={{headerShown:false}}
    />
      <Stack.Screen
      name='Class'
      component={Class}
      options={{headerShown:false}}
    />
    <Stack.Screen
      name='ScanAttendance'
      component={ScanAttendance}
      options={{headerShown:false}}
    />
     <Stack.Screen
      name='Profile'
      component={Profile}
      options={{headerShown:false}}
    />
     <Stack.Screen
      name='Account'
      component={Account}
      options={{headerShown:false}}
    />
    
    </Stack.Navigator>
  </NavigationContainer>
    </SafeAreaProvider>
 
  );
};



export default App;
