import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoomsStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import { RoomsScreen } from '../screens/productivity/RoomsScreen';
import { ChatScreen } from '../screens/productivity/ChatScreen';

const Stack = createNativeStackNavigator<RoomsStackParamList>();

export const RoomsStackNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.headerText,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="RoomsList" component={RoomsScreen} options={{ title: 'Salas' }} />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({ title: route.params.roomName })}
      />
    </Stack.Navigator>
  );
};
