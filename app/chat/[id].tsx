import { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../theme/colors';

type Message = {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
};

const CONTACTS: Record<string, { name: string; avatar: string; online: boolean }> = {
  c1: { name: 'Ana Souza', avatar: 'https://i.pravatar.cc/100?img=1', online: true },
  c2: { name: 'Lucas Oliveira', avatar: 'https://i.pravatar.cc/100?img=3', online: true },
  c3: { name: 'Mariana Lima', avatar: 'https://i.pravatar.cc/100?img=5', online: false },
  c4: { name: 'Pedro Santos', avatar: 'https://i.pravatar.cc/100?img=7', online: false },
  c5: { name: 'Julia Costa', avatar: 'https://i.pravatar.cc/100?img=9', online: true },
};

const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: 'm1', text: 'Oi! Tudo bem?', fromMe: false, time: '10:30' },
    { id: 'm2', text: 'Tudo sim! E voce?', fromMe: true, time: '10:31' },
    { id: 'm3', text: 'Voce viu a praia do Felix? Incrivel!', fromMe: false, time: '10:32' },
    { id: 'm4', text: 'Sim!! Fui ontem, a agua tava cristalina', fromMe: true, time: '10:33' },
    { id: 'm5', text: 'Preciso ir la! Qual lado e melhor pra nadar?', fromMe: false, time: '10:34' },
  ],
  c2: [
    { id: 'm1', text: 'E ai, mergulho amanha?', fromMe: false, time: '09:15' },
    { id: 'm2', text: 'Bora! Ilha Anchieta?', fromMe: true, time: '09:20' },
    { id: 'm3', text: 'Bora mergulhar amanha?', fromMe: false, time: '09:22' },
  ],
  c3: [
    { id: 'm1', text: 'Conhece algum restaurante bom na Almada?', fromMe: true, time: '14:00' },
    { id: 'm2', text: 'Aquele restaurante e demais!', fromMe: false, time: '14:05' },
  ],
  c4: [
    { id: 'm1', text: 'Manda o roteiro que vc fez', fromMe: false, time: '11:00' },
  ],
  c5: [
    { id: 'm1', text: 'Adorei as fotos da trilha!', fromMe: false, time: '08:00' },
  ],
};

export default function Conversation() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const contact = CONTACTS[id as string] || { name: 'Usuario', avatar: '', online: false };

  const [messages, setMessages] = useState<Message[]>(
    MOCK_MESSAGES[id as string] || [],
  );
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  function handleSend() {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      fromMe: true,
      time: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setText('');

    setTimeout(() => {
      const replies = [
        'Que legal!',
        'Concordo!',
        'Vamos sim!',
        'Adorei!',
        'Me conta mais!',
        'Incrivel!',
      ];
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        fromMe: false,
        time: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Image source={{ uri: contact.avatar }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{contact.name}</Text>
            <Text style={styles.headerStatus}>
              {contact.online ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.fromMe ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.fromMe ? styles.myMessageText : styles.theirMessageText,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  item.fromMe ? styles.myMessageTime : styles.theirMessageTime,
                ]}
              >
                {item.time}
              </Text>
            </View>
          )}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.chatInput}
            placeholder="Mensagem..."
            placeholderTextColor={colors.muted}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Pressable
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
          >
            <Ionicons
              name="send"
              size={20}
              color={text.trim() ? '#fff' : colors.muted}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.muted,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
  },
  theirMessageTime: {
    color: colors.muted,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#fff',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 15,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#E0E0E0',
  },
});
