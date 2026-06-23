import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import { RoomsStackNavigator } from './RoomsStackNavigator';
import { FocusScreen } from '../screens/productivity/FocusScreen';
import { FlashcardsScreen } from '../screens/productivity/FlashcardsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Profile: 'person',
  Rooms: 'people',
  Focus: 'timer',
  Flashcards: 'card',
};

export const TabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.tabBarBorder,
        },
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.headerText,
        headerTitleAlign: 'center',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={tabIcons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Rooms" component={RoomsStackNavigator} options={{ headerShown: false, title: 'Salas' }} />
      <Tab.Screen name="Focus" component={FocusScreen} options={{ title: 'Enfoque' }} />
      <Tab.Screen name="Flashcards" component={FlashcardsScreen} options={{ title: 'Repaso' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
};
