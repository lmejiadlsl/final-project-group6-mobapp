import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { PetProvider } from './contexts/PetContext'; // Add this import
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import LoginScreen from './screens/auth/LoginScreen';
import AppNavigator from './navigation/AppNavigator';
import SignupScreen from './screens/auth/RegisterScreen';
import { UserProvider } from './contexts/UserContext';
export type RootStackParamList = {
  Login: undefined;
  Register: { initialRole?: 'buyer' | 'seller' | 'admin' };
  ForgotPassword: undefined;
  App: { role: 'buyer' | 'seller' | 'admin' };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <UserProvider>
    <PetProvider> {/* Wrap your entire app */}
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="App" component={AppNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </PetProvider>
    </UserProvider>
  );
}