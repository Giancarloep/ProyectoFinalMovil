import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

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
  const { colors } = useTheme();
  const isFull = room.participants >= room.capacity;
  const occupancyPercent = (room.participants / room.capacity) * 100;

  const barColor =
    occupancyPercent >= 100 ? colors.danger :
    occupancyPercent >= 66  ? '#FF9500' : colors.success;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }, isJoined && { borderColor: colors.primary }]}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={[styles.roomName, { color: colors.text }]}>{room.name}</Text>
          <View style={[styles.subjectBadge, { backgroundColor: colors.badgeBg }]}>
            <Text style={[styles.subjectText, { color: colors.badgeText }]}>{room.subject}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.joinBtn,
            isJoined ? { backgroundColor: colors.danger } :
            isFull   ? { backgroundColor: colors.inactive }  : { backgroundColor: colors.primary }
          ]}
          onPress={onPress}
          disabled={isFull && !isJoined}
        >
          <Text style={styles.joinBtnText}>
            {isJoined ? 'Salir' : isFull ? 'Llena' : 'Unirse'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.occupancyRow}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { width: `${occupancyPercent}%`, backgroundColor: barColor }]} />
        </View>
        <Text style={[styles.occupancyText, { color: colors.textTertiary }]}>
          {room.participants}/{room.capacity}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
    marginBottom: 6,
  },
  subjectBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  subjectText: {
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
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  occupancyText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
});
