// src/components/StudyRoom.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface StudyRoomProps {
  room: {
    id: string;
    name: string;
    subject: string;
    capacity: number;
    participants: number;
    isActive: boolean;
  };
  isJoined: boolean;
  onPress: () => void;
}

export const StudyRoom: React.FC<StudyRoomProps> = ({ room, isJoined, onPress }) => {
  const isFull = room.participants >= room.capacity;
  const occupancyPercent = (room.participants / room.capacity) * 100;

  // Color de la barra según ocupación
  const barColor =
    occupancyPercent >= 100 ? '#FF3B30' :
    occupancyPercent >= 66  ? '#FF9500' : '#34C759';

  return (
    <View style={[styles.card, isJoined && styles.cardJoined]}>
      <View style={styles.row}>
        {/* Info principal */}
        <View style={styles.info}>
          <Text style={styles.roomName}>{room.name}</Text>
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectText}>{room.subject}</Text>
          </View>
        </View>

        {/* Botón */}
        <TouchableOpacity
          style={[
            styles.joinBtn,
            isJoined ? styles.joinBtnLeave :
            isFull   ? styles.joinBtnFull  : styles.joinBtnAvailable
          ]}
          onPress={onPress}
          disabled={isFull && !isJoined}
        >
          <Text style={styles.joinBtnText}>
            {isJoined ? 'Salir' : isFull ? 'Llena' : 'Unirse'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Barra de ocupación */}
      <View style={styles.occupancyRow}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${occupancyPercent}%`, backgroundColor: barColor }]} />
        </View>
        <Text style={styles.occupancyText}>
          {room.participants}/{room.capacity}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardJoined: {
    borderColor: '#007AFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  subjectBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F0FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  subjectText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
  joinBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    minWidth: 72,
    alignItems: 'center',
  },
  joinBtnAvailable: {
    backgroundColor: '#007AFF',
  },
  joinBtnLeave: {
    backgroundColor: '#FF3B30',
  },
  joinBtnFull: {
    backgroundColor: '#C7C7CC',
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  occupancyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  occupancyText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
});