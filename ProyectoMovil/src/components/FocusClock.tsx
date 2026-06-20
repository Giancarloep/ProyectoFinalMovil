import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

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
  const { colors } = useTheme();
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
  const progress = secondsLeft / totalSeconds;

  const activeColor = mode === 'focus' ? colors.primary : colors.success;

  const handleReset = () => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.circle, { borderColor: colors.border }]}>
        <View style={[
          styles.progressArc,
          {
            borderColor: activeColor,
            opacity: 0.15 + (1 - progress) * 0.85,
          }
        ]} />
        <View style={styles.innerCircle}>
          <Text style={[styles.modeLabel, { color: colors.textTertiary }]}>
            {mode === 'focus' ? '🎯 ENFOQUE' : '☕ DESCANSO'}
          </Text>
          <Text style={[styles.timeText, { color: activeColor }]}>
            {minutes}:{seconds}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlBtn, { backgroundColor: colors.border }]}
          onPress={handleReset}
        >
          <Text style={[styles.resetBtnText, { color: colors.textSecondary }]}>↺ Reiniciar</Text>
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
  resetBtnText: {
    fontWeight: '600',
    fontSize: 15,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
