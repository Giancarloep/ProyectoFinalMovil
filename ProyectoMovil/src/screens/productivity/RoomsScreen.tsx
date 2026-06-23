import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Alert,
  TouchableOpacity, Modal, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StudyRoom } from '../../components/StudyRoom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useRooms, Room } from '../../hooks/useRooms';
import { RoomsStackParamList } from '../../navigation/types';

type RoomsNavProp = NativeStackNavigationProp<RoomsStackParamList, 'RoomsList'>;

export const RoomsScreen = () => {
  const { colors } = useTheme();
  const { currentUser } = useAuth();
  const { rooms, joinedRoom, myCreatedRoom, loading, joinRoom, createRoom, closeRoom, refetch } = useRooms();
  const navigation = useNavigation<RoomsNavProp>();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newCapacity, setNewCapacity] = useState('4');

  const handleJoin = async (room: Room) => {
    if (!room.isActive) {
      Alert.alert('Sala cerrada', 'Esta sala ya no está activa.');
      return;
    }
    const result = await joinRoom(room);
    if (result.error === 'full') {
      Alert.alert('Sala llena', 'Esta sala ya alcanzó su capacidad máxima.');
    } else if (result.error) {
      Alert.alert('Error', result.error);
    } else if (result.joined) {
      Alert.alert('¡Te uniste!', `Ahora estás en "${room.name}". ¡Mucho éxito estudiando!`);
    } else if (result.left) {
      Alert.alert('Saliste de la sala', `Saliste de "${room.name}".`);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newSubject.trim()) {
      Alert.alert('Error', 'Nombre y materia son obligatorios.');
      return;
    }
    const cap = parseInt(newCapacity, 10);
    if (isNaN(cap) || cap < 1 || cap > 50) {
      Alert.alert('Error', 'La capacidad debe ser entre 1 y 50.');
      return;
    }
    const result = await createRoom(newName.trim(), newSubject.trim(), cap);
    if (result.error === 'already_created') {
      Alert.alert('Límite alcanzado', 'Ya creaste una sala. Solo puedes tener una sala activa a la vez.');
      setShowCreate(false);
    } else if (result.error === 'already_joined') {
      Alert.alert('No disponible', 'Si ya eres parte de una sala no puedes crear otra.');
      setShowCreate(false);
    } else if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      setShowCreate(false);
      setNewName('');
      setNewSubject('');
      setNewCapacity('4');
    }
  };

  const handleClose = (room: Room) => {
    Alert.alert(
      'Cerrar sala',
      `¿Estás seguro de cerrar "${room.name}"? Los participantes serán removidos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar',
          style: 'destructive',
          onPress: async () => {
            const result = await closeRoom(room.id);
            if (result.error) Alert.alert('Error', result.error);
          },
        },
      ]
    );
  };

  const availableCount = rooms.filter(r => r.isActive && r.participants < r.capacity).length;
  const isCreator = (room: Room) => currentUser?.id === room.createdBy;
  const canCreate = !myCreatedRoom && !joinedRoom;

  const handlePressCreate = () => {
    if (myCreatedRoom) {
      Alert.alert('Límite alcanzado', 'Ya creaste una sala. Solo puedes tener una sala activa a la vez.');
    } else if (joinedRoom) {
      Alert.alert('No disponible', 'Si ya eres parte de una sala no puedes crear otra.');
    } else {
      setShowCreate(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>Salas de Estudio</Text>
        <View style={styles.headerRight}>
          <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
            <Text style={[styles.badgeText, { color: colors.headerText }]}>{availableCount} disponibles</Text>
          </View>
          <TouchableOpacity onPress={handlePressCreate}>
            <Text style={[styles.addBtn, { color: colors.headerText, opacity: canCreate ? 1 : 0.4 }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={rooms.filter(r => r.isActive)}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <View>
            <StudyRoom
              room={item}
              isJoined={joinedRoom === item.id}
              onPress={() => handleJoin(item)}
            />
            <View style={styles.roomActions}>
              {joinedRoom === item.id && (
                <TouchableOpacity
                  style={[styles.chatBtn, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('Chat', { roomId: item.id, roomName: item.name, subject: item.subject })}
                >
                  <Text style={styles.chatBtnText}>💬 Chat</Text>
                </TouchableOpacity>
              )}
              {isCreator(item) && (
                <TouchableOpacity
                  style={[styles.closeBtn, { backgroundColor: colors.danger }]}
                  onPress={() => handleClose(item)}
                >
                  <Text style={styles.closeBtnText}>Cerrar sala</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
            No hay salas activas. Crea una nueva.
          </Text>
        }
      />

      <Modal visible={showCreate} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Nueva Sala</Text>

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Nombre de la sala"
              placeholderTextColor={colors.textTertiary}
              value={newName}
              onChangeText={setNewName}
            />

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Materia (ej: Matemáticas)"
              placeholderTextColor={colors.textTertiary}
              value={newSubject}
              onChangeText={setNewSubject}
            />

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Capacidad (ej: 4)"
              placeholderTextColor={colors.textTertiary}
              value={newCapacity}
              onChangeText={setNewCapacity}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleCreate}
              >
                <Text style={styles.modalBtnText}>Crear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.inactive }]}
                onPress={() => setShowCreate(false)}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addBtn: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  list: {
    padding: 16,
    gap: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  roomActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  chatBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  chatBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  closeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    gap: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
