import * as React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IndexPage } from './pages/IndexPage';
import { LandingScreen } from './pages/LandingScreen';
import { Login } from './pages/Login';
import { AdminLogin } from './pages/AdminLogin';
import { CoachLogin } from './pages/CoachLogin';
import { CoordinatorLogin } from './pages/CoordinatorLogin';
import { AdminLandingPage } from './pages/AdminLandingPage';
import { CoachLandingPage } from './pages/CoachLandingPage';
import { CoordinatorLandingPage } from './pages/CoordinatorLandingPage';
import { RepLogin } from './pages/RepLogin';
import { RepLandingPage } from './pages/RepLandingPage';
import { NominationCategories } from './pages/NominationCatgories';
import { NominationForm } from './pages/NominationForm';
import { TrialsConfirmation } from './pages/TrialsConfirmation';
// Import your local images
const backgroundImage = require('./assets/startimg.png'); // Adjust the path as needed
const UserIcon = require('./assets/user.png'); // Import the home icon
const CP = require('./assets/iconcp.png'); // Import the home icon
const loginscreen = require('./assets/loginscreen.png'); // Import the home icon








const Stack = createNativeStackNavigator();
const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IndexScreen">
        <Stack.Screen name="IndexPage" component={IndexPage} options={{ headerShown: false }}/>
        <Stack.Screen name="LandingScreen" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="AdminLogin" component={AdminLogin} options={{ headerShown: false}}/>
        <Stack.Screen name="CoachLogin" component={CoachLogin} options={{ headerShown: false}}/>
        <Stack.Screen name="CoordinatorLogin" component={CoordinatorLogin} options={{ headerShown: false}}/>
        <Stack.Screen name="AdminLandingPage" component={AdminLandingPage} options={{headerShown: false}}/>
        <Stack.Screen name="CoachLandingPage" component={CoachLandingPage} options={{headerShown: false}}/>
        <Stack.Screen name="CoordinatorLandingPage" component={CoordinatorLandingPage} options={{headerShown: false}}/>
        <Stack.Screen name="RepLogin" component={RepLogin} options={{headerShown: false}}/>
        <Stack.Screen name="RepLandingPage" component={RepLandingPage} options={{headerShown: false}}/>
        <Stack.Screen name="NominationCategories" component={NominationCategories} options={{headerShown: false}}/>
        <Stack.Screen name="NominationForm" component={NominationForm} options={{headerShown: false}}/>
        <Stack.Screen name="TrialsConfirmation" component={TrialsConfirmation} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MyStack;
