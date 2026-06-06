import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login" // Arranca en el Login
      screenOptions={{ headerShown: false }}
    >
      {/* 1. Pantalla de Login */}
      <Stack.Screen name="Login" component={LoginScreen} />
      
      {/* 2. Pantalla Principal Temporal (Apuntando directo al Perfil para poder salir) */}
      <Stack.Screen name="Tabs" component={ProfileScreen} />
    </Stack.Navigator>
  );
};