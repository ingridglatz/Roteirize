import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { getColors } from '../../theme/colors';

type Contact = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

type Message = {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
};

const CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Ana Souza',
    avatar: 'https://i.pravatar.cc/100?img=1',
    lastMessage: 'Voce viu a praia do Felix? Incrivel!',
    time: '2min',
    unread: 2,
    online: true,
  },
  {
    id: 'c2',
    name: 'Lucas Oliveira',
    avatar: 'https://i.pravatar.cc/100?img=3',
    lastMessage: 'Bora mergulhar amanha?',
    time: '15min',
    unread: 1,
    online: true,
  },
  {
    id: 'c3',
    name: 'Mariana Lima',
    avatar: 'https://i.pravatar.cc/100?img=5',
    lastMessage: 'Aquele restaurante e demais!',
    time: '1h',
    unread: 0,
    online: false,
  },
  {
    id: 'c4',
    name: 'Pedro Santos',
    avatar: 'https://i.pravatar.cc/100?img=7',
    lastMessage: 'Manda o roteiro que vc fez',
    time: '3h',
    unread: 0,
    online: false,
  },
  {
    id: 'c5',
    name: 'Julia Costa',
    avatar: 'https://i.pravatar.cc/100?img=9',
    lastMessage: 'Adorei as fotos da trilha!',
    time: '5h',
    unread: 0,
    online: true,
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: 'm1', text: 'Oi! Tudo bem?', fromMe: false, time: '10:30' },
    { id: 'm2', text: 'Tudo sim! E voce?', fromMe: true, time: '10:31' },
    {
      id: 'm3',
      text: 'Voce viu a praia do Felix? Incrivel!',
      fromMe: false,
      time: '10:32',
    },
    {
      id: 'm4',
      text: 'Sim!! Fui ontem, a agua tava cristalina',
      fromMe: true,
      time: '10:33',
    },
    {
      id: 'm5',
      text: 'Preciso ir la! Qual lado e melhor pra nadar?',
      fromMe: false,
      time: '10:34',
    },
  ],
  c2: [
    { id: 'm1', text: 'E ai, mergulho amanha?', fromMe: false, time: '09:15' },
    {
      id: 'm2',
      text: 'Bora! Ilha Anchieta?',
      fromMe: true,
      time: '09:20',
    },
    {
      id: 'm3',
      text: 'Bora mergulhar amanha?',
      fromMe: false,
      time: '09:22',
    },
  ],
  c3: [
    {
      id: 'm1',
      text: 'Conhece algum restaurante bom na Almada?',
      fromMe: true,
      time: '14:00',
    },
    {
      id: 'm2',
      text: 'Aquele restaurante e demais!',
      fromMe: false,
      time: '14:05',
    },
  ],
  c4: [
    {
      id: 'm1',
      text: 'Manda o roteiro que vc fez',
      fromMe: false,
      time: '11:00',
    },
  ],
  c5: [
    {
      id: 'm1',
      text: 'Adorei as fotos da trilha!',
      fromMe: false,
      time: '08:00',
    },
  ],
};

function ContactList({ onSelect }: { onSelect: (contact: Contact) => void }) {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <FlatList
      data={CONTACTS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.contactList}
      renderItem={({ item }) => (
        <Pressable style={styles.contactRow} onPress={() => onSelect(item)}>
          <View>
            <Image source={{ uri: item.avatar }} style={styles.contactAvatar} />
            {item.online && <View style={styles.onlineDot} />}
          </View>
          <View style={styles.contactBody}>
            <View style={styles.contactTop}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactTime}>{item.time}</Text>
            </View>
            <View style={styles.contactBottom}>
              <Text
                style={[
                  styles.contactMsg,
                  item.unread > 0 && styles.contactMsgUnread,
                ]}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      )}
    />
  );
}

function Conversation({
  contact,
  onBack,
}: {
  contact: Contact;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(
    MOCK_MESSAGES[contact.id] || [],
  );
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);

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
    <KeyboardAvoidingView
      style={styles.conversationContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={styles.convHeader}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Image source={{ uri: contact.avatar }} style={styles.convAvatar} />
        <View style={styles.convHeaderInfo}>
          <Text style={styles.convHeaderName}>{contact.name}</Text>
          <Text style={styles.convHeaderStatus}>
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
  );
}

export default function ChatScreen() {
  const router = useRouter();
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (activeContact) {
    return (
      <SafeAreaView style={styles.safe}>
        <Conversation
          contact={activeContact}
          onBack={() => setActiveContact(null)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.listHeader}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.listTitle}>Mensagens</Text>
        <View style={{ width: 24 }} />
      </View>

      <ContactList onSelect={setActiveContact} />
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    listHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    listTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },

    contactList: {
      paddingVertical: 8,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    contactAvatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
    },
    onlineDot: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#4CAF50',
      borderWidth: 2,
      borderColor: colors.background,
    },
    contactBody: {
      flex: 1,
    },
    contactTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    contactName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    contactTime: {
      fontSize: 12,
      color: colors.muted,
    },
    contactBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 3,
    },
    contactMsg: {
      fontSize: 14,
      color: colors.muted,
      flex: 1,
      marginRight: 8,
    },
    contactMsgUnread: {
      color: colors.text,
      fontWeight: '500',
    },
    unreadBadge: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    unreadText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '700',
    },

    conversationContainer: {
      flex: 1,
    },
    convHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    convAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    convHeaderInfo: {
      flex: 1,
    },
    convHeaderName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    convHeaderStatus: {
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
      backgroundColor: colors.card,
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
      backgroundColor: colors.background,
      gap: 8,
    },
    chatInput: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === 'ios' ? 10 : 8,
      fontSize: 15,
      color: colors.text,
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
      backgroundColor: colors.border,
    },
  });
}
