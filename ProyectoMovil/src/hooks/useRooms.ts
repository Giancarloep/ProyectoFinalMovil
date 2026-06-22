// src/hooks/useRooms.ts
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export type Room = {
  id: string;
  name: string;
  subject: string;
  capacity: number;
  participants: number;
  isActive: boolean;
};

export const useRooms = () => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    setLoading(true);

    // 1. Traer las salas
    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('id, name, subject, capacity, is_active');

    if (roomsError) {
      console.log('Error cargando salas:', roomsError.message);
      setLoading(false);
      return;
    }

    // 2. Traer todos los participantes de una vez
    const { data: participantsData, error: participantsError } = await supabase
      .from('room_participants')
      .select('room_id, user_id');

    if (participantsError) {
      console.log('Error cargando participantes:', participantsError.message);
    }

    const counts: Record<string, number> = {};
    let myRoom: string | null = null;

    (participantsData ?? []).forEach(p => {
      counts[p.room_id] = (counts[p.room_id] ?? 0) + 1;
      if (currentUser && p.user_id === currentUser.id) {
        myRoom = p.room_id;
      }
    });

    const mapped: Room[] = (roomsData ?? []).map(r => ({
      id: r.id,
      name: r.name,
      subject: r.subject,
      capacity: r.capacity,
      isActive: r.is_active,
      participants: counts[r.id] ?? 0,
    }));

    setRooms(mapped);
    setJoinedRoom(myRoom);
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const joinRoom = async (room: Room) => {
    if (!currentUser) return { error: 'No hay sesión activa' };

    if (joinedRoom === room.id) {
      // salir de la sala
      const { error } = await supabase
        .from('room_participants')
        .delete()
        .eq('room_id', room.id)
        .eq('user_id', currentUser.id);

      if (error) return { error: error.message };
      await fetchRooms();
      return { left: true };
    }

    if (room.participants >= room.capacity) {
      return { error: 'full' };
    }

    // si estaba en otra sala, sale primero
    if (joinedRoom) {
      await supabase
        .from('room_participants')
        .delete()
        .eq('room_id', joinedRoom)
        .eq('user_id', currentUser.id);
    }

    const { error } = await supabase
      .from('room_participants')
      .insert({ room_id: room.id, user_id: currentUser.id });

    if (error) return { error: error.message };
    await fetchRooms();
    return { joined: true };
  };

  return { rooms, joinedRoom, loading, joinRoom, refetch: fetchRooms };
};