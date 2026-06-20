import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FocusClock } from '../../components/FocusClock';
import { useTheme } from '../../context/ThemeContext';

type Mode = 'focus' | 'break';

const MIN_MINUTES = 1;
const MAX_MINUTES = 120;

export const FocusScreen = () => {
  const { colors } = useTheme();
  const [mode, setMode] = useState<Mode>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [started, setStarted] = useState(false);

  const isLocked = sessionsCompleted > 0;

  const handleSessionEnd = () => {
    if (mode === 'focus') {
      setSessionsCompleted(prev => prev + 1);
      setMode('break');
    } else {
      setMode('focus');
    }
  };

  const adjustMinutes = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    delta: number
  ) => {
    setter(prev => Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, prev + delta)));
  };

  if (!started) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Text style={[styles.setupTitle, { color: colors.text }]}>Configura tu sesión</Text>

        <View style={[styles.setupRow, { backgroundColor: colors.card }]}>
          <Text style={[styles.setupLabel, { color: colors.text }]}>Tiempo de enfoque</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: colors.primary }]}
              onPress={() => adjustMinutes(setFocusMinutes, -5)}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={[styles.stepValue, { color: colors.text }]}>{focusMinutes} min</Text>
            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: colors.primary }]}
              onPress={() => adjustMinutes(setFocusMinutes, 5)}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.setupRow, { backgroundColor: colors.card }]}>
          <Text style={[styles.setupLabel, { color: colors.text }]}>Tiempo de descanso</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: colors.primary }]}
              onPress={() => adjustMinutes(setBreakMinutes, -1)}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={[styles.stepValue, { color: colors.text }]}>{breakMinutes} min</Text>
            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: colors.primary }]}
              onPress={() => adjustMinutes(setBreakMinutes, 1)}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.startBtn, { backgroundColor: colors.primary }]}
          onPress={() => setStarted(true)}
        >
          <Text style={styles.startBtnText}>Comenzar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {isLocked && (
        <View style={[styles.lockedBanner, { backgroundColor: colors.textTertiary }]}>
          <Text style={styles.lockedBannerText}>
            Tiempos bloqueados — reinicia la app para cambiar
          </Text>
        </View>
      )}

      <View style={styles.sessionsRow}>
        {[...Array(4)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.sessionDot,
              i < (sessionsCompleted % 4) ? { backgroundColor: colors.primary } : { backgroundColor: colors.inactive }
            ]}
          />
        ))}
      </View>
      <Text style={[styles.sessionsLabel, { color: colors.textTertiary }]}>
        {sessionsCompleted} {sessionsCompleted === 1 ? 'sesión completada' : 'sesiones completadas'}
      </Text>

      <FocusClock
        durationMinutes={mode === 'focus' ? focusMinutes : breakMinutes}
        mode={mode}
        onComplete={handleSessionEnd}
      />

      <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.tipTitle, { color: colors.text }]}>
          {mode === 'focus' ? '🎯 Modo Enfoque' : '☕ Modo Descanso'}
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
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
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  setupTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 40,
  },
  setupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  setupLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
  stepValue: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 60,
    textAlign: 'center',
  },
  startBtn: {
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginTop: 20,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lockedBanner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  lockedBannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
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
  sessionsLabel: {
    fontSize: 13,
    marginBottom: 10,
  },
  tipCard: {
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
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
