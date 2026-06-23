import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  Modal, TextInput, FlatList,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useFlashcards, Flashcard } from '../../hooks/useFlashcards';

export const FlashcardsScreen = () => {
  const { colors } = useTheme();
  const { flashcards, loading, addFlashcard, deleteFlashcard, refetch } = useFlashcards();
  const [showCreate, setShowCreate] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);

  const handleAdd = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      Alert.alert('Error', 'Pregunta y respuesta son obligatorias.');
      return;
    }
    const result = await addFlashcard(
      newQuestion.trim(),
      newAnswer.trim(),
      newSubject.trim() || undefined,
    );
    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      setShowCreate(false);
      setNewQuestion('');
      setNewAnswer('');
      setNewSubject('');
    }
  };

  const handleDelete = (card: Flashcard) => {
    Alert.alert('Eliminar', '¿Eliminar esta tarjeta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => deleteFlashcard(card.id),
      },
    ]);
  };

  const startReview = () => {
    if (flashcards.length === 0) return;
    setReviewIndex(0);
    setIsFlipped(false);
    setKnown(0);
    setUnknown(0);
  };

  const handleAnswer = (didKnow: boolean) => {
    if (reviewIndex === null) return;
    if (didKnow) setKnown(prev => prev + 1);
    else setUnknown(prev => prev + 1);

    if (reviewIndex >= flashcards.length - 1) {
      Alert.alert(
        '¡Repaso completado!',
        `Correctas: ${known + (didKnow ? 1 : 0)}\nA repasar: ${unknown + (didKnow ? 0 : 1)}`,
        [{ text: 'OK', onPress: () => setReviewIndex(null) }],
      );
    } else {
      setReviewIndex(prev => (prev ?? 0) + 1);
      setIsFlipped(false);
    }
  };

  if (reviewIndex !== null && flashcards.length > 0) {
    const card = flashcards[reviewIndex];
    const progress = ((reviewIndex) / flashcards.length) * 100;

    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.textTertiary }]}>
            {reviewIndex + 1} / {flashcards.length}
          </Text>
        </View>

        {card.subject && (
          <View style={[styles.subjectBadge, { backgroundColor: colors.badgeBg }]}>
            <Text style={[styles.subjectText, { color: colors.badgeText }]}>{card.subject}</Text>
          </View>
        )}

        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={() => setIsFlipped(prev => !prev)} activeOpacity={0.9}>
          <Text style={[styles.cardLabel, { color: colors.primary }]}>{isFlipped ? 'Respuesta' : 'Pregunta'}</Text>
          <Text style={[styles.cardText, { color: colors.text }]}>
            {isFlipped ? card.answer : card.question}
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
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>Mis Tarjetas</Text>
        <View style={styles.headerRight}>
          {flashcards.length > 0 && (
            <TouchableOpacity onPress={startReview}>
              <Text style={[styles.reviewBtn, { color: colors.headerText }]}>Repasar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowCreate(true)}>
            <Text style={[styles.addBtn, { color: colors.headerText }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={flashcards}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.cardItem, { backgroundColor: colors.card }]}
            onLongPress={() => handleDelete(item)}
          >
            <Text style={[styles.cardItemQuestion, { color: colors.text }]}>{item.question}</Text>
            <Text style={[styles.cardItemAnswer, { color: colors.textSecondary }]}>{item.answer}</Text>
            {item.subject && (
              <View style={[styles.cardItemSubject, { backgroundColor: colors.badgeBg }]}>
                <Text style={[styles.cardItemSubjectText, { color: colors.badgeText }]}>{item.subject}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
              No tienes tarjetas guardadas.
            </Text>
            <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>
              Presiona + para crear una.
            </Text>
          </View>
        }
      />

      <Modal visible={showCreate} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Nueva Tarjeta</Text>

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Pregunta"
              placeholderTextColor={colors.textTertiary}
              value={newQuestion}
              onChangeText={setNewQuestion}
              multiline
            />

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Respuesta"
              placeholderTextColor={colors.textTertiary}
              value={newAnswer}
              onChangeText={setNewAnswer}
              multiline
            />

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Materia (opcional)"
              placeholderTextColor={colors.textTertiary}
              value={newSubject}
              onChangeText={setNewSubject}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleAdd}
              >
                <Text style={styles.modalBtnText}>Guardar</Text>
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
    gap: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reviewBtn: {
    fontSize: 15,
    fontWeight: '700',
  },
  addBtn: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  cardItem: {
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  cardItemQuestion: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardItemAnswer: {
    fontSize: 14,
  },
  cardItemSubject: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
  },
  cardItemSubjectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
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
    alignSelf: 'center',
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
