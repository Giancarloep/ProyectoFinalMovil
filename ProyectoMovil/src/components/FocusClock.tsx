// src/components/FocusClock.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface FocusClockProps {
  durationMinutes: number;
  mode: 'focus' | 'break';
  onComplete: () => void;
}

export const FocusClock: React.FC<FocusClockProps> = ({
  durationMinutes,
  mode,
  onComplete,
}) => {
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reiniciar cuando cambia la duración o el modo
  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [totalSeconds, mode]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');
  const progress = secondsLeft / totalSeconds; // 1 → 0

  // Círculo SVG-like con View
  const SIZE = 200;
  const STROKE = 10;
  const activeColor = mode === 'focus' ? '#007AFF' : '#34C759';

  const handleReset = () => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
  };

  return (
    <View style={styles.wrapper}>
      {/* Círculo de progreso simulado con border */}
      <View style={[styles.circle, { borderColor: '#E5E5EA' }]}>
        <View style={[
          styles.progressArc,
          {
            borderColor: activeColor,
            // Simulamos el progreso con opacidad para no requerir SVG
            opacity: 0.15 + (1 - progress) * 0.85,
          }
        ]} />
        <View style={styles.innerCircle}>
          <Text style={styles.modeLabel}>
            {mode === 'focus' ? '🎯 ENFOQUE' : '☕ DESCANSO'}
          </Text>
          <Text style={[styles.timeText, { color: activeColor }]}>
            {minutes}:{seconds}
          </Text>
        </View>
      </View>

      {/* Controles */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlBtn, styles.resetBtn]}
          onPress={handleReset}
        >
          <Text style={styles.resetBtnText}>↺ Reiniciar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, { backgroundColor: activeColor }]}
          onPress={() => setIsRunning(prev => !prev)}
        >
          <Text style={styles.playBtnText}>
            {isRunning ? '⏸ Pausar' : '▶ Iniciar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: '100%',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  progressArc: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
  },
  innerCircle: {
    alignItems: 'center',
  },
  modeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 2,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  controlBtn: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtn: {
    backgroundColor: '#E5E5EA',
  },
  resetBtnText: {
    color: '#3A3A3C',
    fontWeight: '600',
    fontSize: 15,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});