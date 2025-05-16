import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import AppNavigator from './navigation/AppNavigator'; 
import UserDashboard from './screens/user/UserDashboard'; 

const isLoggedIn = false;

export type RootStackParamList = {
  Login: undefined;
  Register: { initialRole?: 'buyer' | 'seller' };
  ForgotPassword: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
        {isLoggedIn ? (
          <Stack.Screen name="Home" component={AppNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Home" component={UserDashboard} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
