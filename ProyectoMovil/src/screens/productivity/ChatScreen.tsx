import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, SafeAreaView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Message = {
  id: string;
  text: string;
  sender: string;
  isMe: boolean;
  time: string;
};

const getTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const MOCK_MESSAGES: Message[] = [
  { id: '1', text: '¡Hola a todos! ¿Listos para estudiar Cálculo?', sender: 'María', isMe: false, time: '09:01' },
  { id: '2', text: 'Sí! Alguien tiene los apuntes de la clase 5?', sender: 'Carlos', isMe: false, time: '09:02' },
  { id: '3', text: 'Yo los tengo, los subo al drive ahora', sender: 'Yo', isMe: true, time: '09:03' },
  { id: '4', text: 'Gracias! ¿Empezamos con los límites o derivadas?', sender: 'María', isMe: false, time: '09:04' },
  { id: '5', text: 'Mejor empecemos con límites, es lo que más me cuesta', sender: 'Carlos', isMe: false, time: '09:05' },
];

export const ChatScreen = ({ route }: any) => {
  const { colors } = useTheme();
  const roomName = route?.params?.roomName ?? 'Sala de Estudio';
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'Yo',
      isMe: true,
      time: getTime(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
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
          <Text style={[styles.headerSub, { color: 'rgba(255,255,255,0.8)' }]}>{messages.length > 0 ? '3 participantes' : 'Sin mensajes'}</Text>
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
