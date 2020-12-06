/*
  _____                .___.__                             
  _/ ____\___________  __| _/|__|   ____________ ___________ 
  \   __\/ __ \_  __ \/ __ | |  |  /  _ \___   // __ \_  __ \
   |  | \  ___/|  | \/ /_/ | |  | (  <_> )    /\  ___/|  | \/
   |__|  \___  >__|  \____ | |__|  \____/_____ \\___  >__|   
             \/           \/                  \/    \/       
*/



import 'react-native-gesture-handler';

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
} from 'react-native';




import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { primaryColor, secondaryColor } from './helper';

//screens
import ScanScreen from './src/screens/Scan'
import CreateScreen from './src/screens/Create';
import WifiScreen from './src/screens/Wifi';

const Tab = createBottomTabNavigator();

//set icon name with route
function renderIcon({ route, size, color }) {
  //  console.log({ route, size, color })
  switch (route.name) {
    case 'Oku':
      return (<Ionicons size={size} color={color} name="scan" />)
      break;
    case 'Oluştur':
      return (<MaterialCommunityIcons size={size} color={color} name="qrcode-plus" />)
      break;
    case 'Wifi':
      return (<AntDesign size={size} color={color} name="wifi" />)
      break;
    default:
      return (<Ionicons size={size} color={color} name="scan" />)
      break;
  }
}

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            return renderIcon({ route, focused, color, size })
          },
        })}
        tabBarOptions={{
          activeTintColor: secondaryColor,
          inactiveTintColor: primaryColor,
        }}
      >
        <Tab.Screen name="Oku" component={ScanScreen} />
        <Tab.Screen name="Oluştur" component={CreateScreen} />
        <Tab.Screen name="Wifi" component={WifiScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};


export default App;
