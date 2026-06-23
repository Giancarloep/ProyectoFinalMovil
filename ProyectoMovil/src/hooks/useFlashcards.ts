import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  subject: string | null;
  user_id: string;
  room_id: string | null;
  created_at: string;
};

export const useFlashcards = (roomId?: string) => {
  const { currentUser } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlashcards = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);

    let query = supabase
      .from('flashcards')
      .select('id, question, answer, subject, user_id, room_id, created_at')
      .order('created_at', { ascending: false });

    if (roomId) {
      query = query.eq('room_id', roomId);
    } else {
      query = query.is('room_id', null).eq('user_id', currentUser.id);
    }

    const { data, error } = await query;

    if (error) {
      console.log('Error cargando flashcards:', error.message);
    } else {
      setFlashcards(data ?? []);
    }
    setLoading(false);
  }, [currentUser, roomId]);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  const addFlashcard = async (question: string, answer: string, subject?: string) => {
    if (!currentUser) return { error: 'No hay sesión activa' };

    const { error } = await supabase
      .from('flashcards')
      .insert({
        user_id: currentUser.id,
        room_id: roomId ?? null,
        question,
        answer,
        subject: subject ?? null,
      });

    if (error) return { error: error.message };
    await fetchFlashcards();
    return { success: true };
  };

  const deleteFlashcard = async (id: string) => {
    if (!currentUser) return { error: 'No hay sesión activa' };

    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id)
      .eq('user_id', currentUser.id);

    if (error) return { error: error.message };
    await fetchFlashcards();
    return { success: true };
  };

  return { flashcards, loading, addFlashcard, deleteFlashcard, refetch: fetchFlashcards };
};
