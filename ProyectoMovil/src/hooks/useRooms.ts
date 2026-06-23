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
  createdBy: string;
};

export const useRooms = () => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const myCreatedRoom = currentUser
    ? rooms.find(r => r.createdBy === currentUser.id && r.isActive) ?? null
    : null;

  const fetchRooms = useCallback(async () => {
    setLoading(true);

    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('id, name, subject, capacity, is_active, created_by');

    if (roomsError) {
      console.log('Error cargando salas:', roomsError.message);
      setLoading(false);
      return;
    }

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
      createdBy: r.created_by,
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

  const createRoom = async (name: string, subject: string, capacity: number) => {
    if (!currentUser) return { error: 'No hay sesión activa' };

    if (myCreatedRoom) {
      return { error: 'already_created' };
    }

    if (joinedRoom) {
      return { error: 'already_joined' };
    }

    const { error } = await supabase
      .from('rooms')
      .insert({ name, subject, capacity, created_by: currentUser.id });

    if (error) return { error: error.message };
    await fetchRooms();
    return { success: true };
  };

  const closeRoom = async (roomId: string) => {
    if (!currentUser) return { error: 'No hay sesión activa' };

    const { error } = await supabase
      .from('rooms')
      .update({ is_active: false })
      .eq('id', roomId)
      .eq('created_by', currentUser.id);

    if (error) return { error: error.message };
    await fetchRooms();
    return { success: true };
  };

  return { rooms, joinedRoom, myCreatedRoom, loading, joinRoom, createRoom, closeRoom, refetch: fetchRooms };
};
