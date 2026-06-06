import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
//no son pantallas de las que tenemos son como placeholders para navegar
const RoomsScreen = () => (
  <View style={styles.center}>
    <Text style={styles.text}>Salas de Estudio Virtuales</Text>
  </View>
);

const FocusScreen = () => (
  <View style={styles.center}>
    <Text style={styles.text}>Temporizador de Enfoque</Text>
  </View>
);

const FlashcardsScreen = () => (
  <View style={styles.center}>
    <Text style={styles.text}>Tarjetas de Repaso</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.center}>
    <Text style={styles.text}>Perfil de Usuario</Text>
  </View>
);

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',     // Azul para la pestaña que estás viendo
        tabBarInactiveTintColor: '#8E8E93',   // Gris para las demás
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#FFFFFF',
        headerTitleAlign: 'center',
      }}
    >
      <Tab.Screen 
        name="Rooms" 
        component={RoomsScreen} 
        options={{ title: 'Salas' }} 
      />
      <Tab.Screen 
        name="Focus" 
        component={FocusScreen} 
        options={{ title: 'Enfoque' }} 
      />
      <Tab.Screen 
        name="Flashcards" 
        component={FlashcardsScreen} 
        options={{ title: 'Repaso' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Perfil' }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
});