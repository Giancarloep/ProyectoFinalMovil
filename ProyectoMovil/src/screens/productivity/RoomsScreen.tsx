// src/screens/productivity/RoomsScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert
} from 'react-native';
import { StudyRoom } from '../../components/StudyRoom';

type Room = {
  id: string;
  name: string;
  subject: string;
  capacity: number;
  participants: number;
  isActive: boolean;
};

const MOCK_ROOMS: Room[] = [
  { id: '1', name: 'Sala Cálculo I', subject: 'Matemáticas', capacity: 5, participants: 3, isActive: true },
  { id: '2', name: 'Sala Programación', subject: 'Informática', capacity: 4, participants: 1, isActive: true },
  { id: '3', name: 'Sala Física General', subject: 'Física', capacity: 6, participants: 0, isActive: false },
  { id: '4', name: 'Sala Inglés Técnico', subject: 'Idiomas', capacity: 3, participants: 2, isActive: true },
];

export const RoomsScreen = () => {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  const handleJoin = (room: Room) => {
    if (joinedRoom === room.id) {
      // Salir de la sala
      setRooms(prev =>
        prev.map(r => r.id === room.id ? { ...r, participants: r.participants - 1 } : r)
      );
      setJoinedRoom(null);
      Alert.alert('Saliste de la sala', `Saliste de "${room.name}".`);
    } else if (room.participants >= room.capacity) {
      Alert.alert('Sala llena', 'Esta sala ya alcanzó su capacidad máxima.');
    } else {
      if (joinedRoom) {
        // Salir de la sala anterior
        setRooms(prev =>
          prev.map(r => r.id === joinedRoom ? { ...r, participants: r.participants - 1 } : r)
        );
      }
      setRooms(prev =>
        prev.map(r => r.id === room.id ? { ...r, participants: r.participants + 1 } : r)
      );
      setJoinedRoom(room.id);
      Alert.alert('¡Te uniste!', `Ahora estás en "${room.name}". ¡Mucho éxito estudiando!`);
    }
  };

  const availableCount = rooms.filter(r => r.participants < r.capacity).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Salas de Estudio</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{availableCount} disponibles</Text>
        </View>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <StudyRoom
            room={item}
            isJoined={joinedRoom === item.id}
            onPress={() => handleJoin(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay salas disponibles.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    marginTop: 40,
    fontSize: 16,
  },
});