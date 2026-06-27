import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, SafeAreaView, Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { RoomsStackParamList } from '../../navigation/types';

type Message = {
  id: string;
  text: string;
  sender: string;
  isMe: boolean;
  time: string;
};

type Props = NativeStackScreenProps<RoomsStackParamList, 'Chat'>;

export const ChatScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const { currentUser } = useAuth();
  const { roomId, roomName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const msg = payload.new as {
            id: string;
            text: string;
            sender_name: string;
            user_id: string;
            created_at: string;
          };
          setMessages((prev) => [
            ...prev,
            {
              id: msg.id,
              text: msg.text,
              sender: msg.sender_name,
              isMe: msg.user_id === currentUser?.id,
              time: formatTime(msg.created_at),
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('room_messages')
      .select('id, text, sender_name, user_id, created_at')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) {
      console.log('Error cargando mensajes:', error.message);
      return;
    }

    setMessages(
      (data ?? []).map((msg) => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender_name,
        isMe: msg.user_id === currentUser?.id,
        time: formatTime(msg.created_at),
      }))
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !currentUser) return;

    setInputText('');

    const { error } = await supabase.from('room_messages').insert({
      room_id: roomId,
      user_id: currentUser.id,
      sender_name: currentUser.name,
      text,
    });

    if (error) {
      Alert.alert('Error', `No se pudo enviar el mensaje:\n${error.message}`);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.isMe ? styles.messageRowMe : styles.messageRowOther]}>
      {!item.isMe && (
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{item.sender.charAt(0)}</Text>
        </View>
      )}
      <View style={[styles.bubble, item.isMe ? [styles.bubbleMe, { backgroundColor: colors.primary }] : [styles.bubbleOther, { backgroundColor: colors.card }]]}>
        {!item.isMe && (
          <Text style={[styles.senderName, { color: colors.primary }]}>{item.sender}</Text>
        )}
        <Text style={[styles.messageText, item.isMe && styles.messageTextMe]}>
          {item.text}
        </Text>
        <Text style={[styles.timeText, item.isMe && { color: 'rgba(255,255,255,0.7)' }, !item.isMe && { color: colors.textTertiary }]}>
          {item.time}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: colors.headerText }]}>{roomName}</Text>
          <View style={styles.onlineDot} />
          <Text style={[styles.headerSub, { color: 'rgba(255,255,255,0.8)' }]}>
            {messages.length > 0 ? `${messages.length} mensajes` : 'Sin mensajes'}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={renderMessage}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <View style={[styles.inputRow, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={300}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: colors.primary }, !inputText.trim() && { backgroundColor: colors.inactive }]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendBtnText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
  },
  headerSub: {
    fontSize: 13,
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 8,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMe: {
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3,
  },
  messageText: {
    fontSize: 15,
    color: '#1C1C1E',
    lineHeight: 21,
  },
  messageTextMe: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
