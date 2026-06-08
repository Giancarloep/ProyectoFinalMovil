// src/screens/productivity/FocusScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FocusClock } from '../../components/FocusClock';

type Mode = 'focus' | 'break';

export const FocusScreen = () => {
  const [mode, setMode] = useState<Mode>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const handleSessionEnd = () => {
    if (mode === 'focus') {
      setSessionsCompleted(prev => prev + 1);
      setMode('break');
    } else {
      setMode('focus');
    }
  };

  return (
    <View style={styles.container}>
      {/* Selector de modo */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'focus' && styles.modeBtnActive]}
          onPress={() => setMode('focus')}
        >
          <Text style={[styles.modeBtnText, mode === 'focus' && styles.modeBtnTextActive]}>
            Enfoque
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'break' && styles.modeBtnActive]}
          onPress={() => setMode('break')}
        >
          <Text style={[styles.modeBtnText, mode === 'break' && styles.modeBtnTextActive]}>
            Descanso
          </Text>
        </TouchableOpacity>
      </View>

      {/* Indicador de sesiones */}
      <View style={styles.sessionsRow}>
        {[...Array(4)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.sessionDot,
              i < (sessionsCompleted % 4) ? styles.sessionDotFilled : styles.sessionDotEmpty
            ]}
          />
        ))}
      </View>
      <Text style={styles.sessionsLabel}>
        {sessionsCompleted} {sessionsCompleted === 1 ? 'sesión completada' : 'sesiones completadas'}
      </Text>

      {/* Reloj principal */}
      <FocusClock
        durationMinutes={mode === 'focus' ? 25 : 5}
        mode={mode}
        onComplete={handleSessionEnd}
      />

      {/* Tip de enfoque */}
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>
          {mode === 'focus' ? '🎯 Modo Enfoque' : '☕ Modo Descanso'}
        </Text>
        <Text style={styles.tipText}>
          {mode === 'focus'
            ? 'Silencia tu teléfono y evita redes sociales durante esta sesión.'
            : 'Levántate, estira los músculos y toma agua. ¡Te lo mereces!'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    padding: 4,
    width: '80%',
    marginBottom: 20,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#007AFF',
  },
  modeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  modeBtnTextActive: {
    color: '#FFFFFF',
  },
  sessionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  sessionDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  sessionDotFilled: {
    backgroundColor: '#007AFF',
  },
  sessionDotEmpty: {
    backgroundColor: '#C7C7CC',
  },
  sessionsLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 10,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: '#3A3A3C',
    lineHeight: 20,
  },
});