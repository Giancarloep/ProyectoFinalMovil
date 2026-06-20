import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  subject: string;
};

const MOCK_CARDS: Flashcard[] = [
  { id: '1', question: '¿Qué es un componente en React Native?', answer: 'Es un bloque reutilizable de UI que puede aceptar props y manejar su propio estado.', subject: 'Programación Móvil' },
  { id: '2', question: '¿Para qué sirve el hook useState?', answer: 'Permite añadir estado local a un componente funcional. Retorna el valor actual y una función para actualizarlo.', subject: 'Programación Móvil' },
  { id: '3', question: '¿Qué es Flexbox?', answer: 'Sistema de diseño que permite organizar elementos en filas o columnas de manera flexible y responsiva.', subject: 'Programación Móvil' },
  { id: '4', question: '¿Qué hace el hook useEffect?', answer: 'Ejecuta efectos secundarios después del renderizado, como llamadas a APIs o suscripciones.', subject: 'Programación Móvil' },
  { id: '5', question: '¿Qué es TypeScript?', answer: 'Superconjunto de JavaScript que añade tipado estático, mejorando la detección de errores en tiempo de desarrollo.', subject: 'Programación' },
];

export const FlashcardsScreen = () => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);

  const currentCard = MOCK_CARDS[currentIndex];
  const isLastCard = currentIndex === MOCK_CARDS.length - 1;

  const handleFlip = () => setIsFlipped(prev => !prev);

  const handleAnswer = (didKnow: boolean) => {
    if (didKnow) setKnown(prev => prev + 1);
    else setUnknown(prev => prev + 1);

    if (isLastCard) {
      Alert.alert(
        '¡Repaso completado!',
        `Correctas: ${known + (didKnow ? 1 : 0)}\nA repasar: ${unknown + (didKnow ? 0 : 1)}`,
        [{
          text: 'Reiniciar', onPress: () => {
            setCurrentIndex(0);
            setIsFlipped(false);
            setKnown(0);
            setUnknown(0);
          }
        }]
      );
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const progress = ((currentIndex) / MOCK_CARDS.length) * 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.progressText, { color: colors.textTertiary }]}>
          {currentIndex + 1} / {MOCK_CARDS.length}
        </Text>
      </View>

      <View style={[styles.subjectBadge, { backgroundColor: colors.badgeBg }]}>
        <Text style={[styles.subjectText, { color: colors.badgeText }]}>{currentCard.subject}</Text>
      </View>

      <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={handleFlip} activeOpacity={0.9}>
        <Text style={[styles.cardLabel, { color: colors.primary }]}>{isFlipped ? 'Respuesta' : 'Pregunta'}</Text>
        <Text style={[styles.cardText, { color: colors.text }]}>
          {isFlipped ? currentCard.answer : currentCard.question}
        </Text>
        <Text style={[styles.tapHint, { color: colors.inactive }]}>
          {isFlipped ? '' : 'Toca para ver la respuesta'}
        </Text>
      </TouchableOpacity>

      {isFlipped && (
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={[styles.answerBtn, { backgroundColor: colors.danger }]}
            onPress={() => handleAnswer(false)}
          >
            <Text style={styles.answerBtnText}>✗ A repasar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.answerBtn, { backgroundColor: colors.success }]}
            onPress={() => handleAnswer(true)}
          >
            <Text style={styles.answerBtnText}>✓ Lo sé</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.counters}>
        <Text style={[styles.counterKnown, { color: colors.success }]}>✓ {known}</Text>
        <Text style={[styles.counterUnknown, { color: colors.danger }]}>✗ {unknown}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  subjectBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 20,
  },
  subjectText: {
    fontWeight: '600',
    fontSize: 13,
  },
  card: {
    width: '100%',
    minHeight: 220,
    borderRadius: 16,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  tapHint: {
    fontSize: 12,
    marginTop: 20,
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 20,
  },
  answerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  answerBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  counters: {
    flexDirection: 'row',
    gap: 30,
  },
  counterKnown: {
    fontSize: 16,
    fontWeight: '700',
  },
  counterUnknown: {
    fontSize: 16,
    fontWeight: '700',
  },
});
