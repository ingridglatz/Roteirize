import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SharedPostPreview from '../../components/chat/SharedPostPreview';
import UserAvatar from '../../components/social/UserAvatar';
import { useChat } from '../../context/ChatContext';
import { useSocial } from '../../context/SocialContext';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';
import { Message } from '../../types/Social';
import { formatTimeAgo } from '../../utils/socialHelpers';

export default function Conversation() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser } = useUser();
  const {
    getConversation,
    getMessages,
    sendMessage,
    markAsRead,
    setTyping,
    reactToMessage,
    deleteMessage,
  } = useChat();
  const { getUser } = useSocial();

  const conversation = getConversation(id as string);
  const messages = getMessages(id as string);
  const [text, setText] = useState('');
  // eslint-disable-next-line no-empty-pattern
  const [] = useState<Message | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const recipient = useMemo(() => {
    if (!conversation) return null;
    const recipientId = conversation.participants.find(
      (p) => p.id !== currentUser.id,
    );
    return recipientId ? getUser(recipientId.id) : null;
  }, [conversation, currentUser.id, getUser]);

  const isTyping = conversation?.typing && conversation.typing.length > 0;

  useEffect(() => {
    if (id) {
      markAsRead(id as string);
    }
  }, [id, markAsRead]);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout | number;
    if (text.trim()) {
      setTyping(id as string, true);
      typingTimeout = setTimeout(() => {
        setTyping(id as string, false);
      }, 2000);
    } else {
      setTyping(id as string, false);
    }
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
      setTyping(id as string, false);
    };
  }, [text, id, setTyping]);

  function handleSend() {
    if (!text.trim() || !recipient) return;

    sendMessage(id as string, {
      conversationId: id as string,
      senderId: currentUser.id,
      recipientId: recipient.id,
      text: text.trim(),
      read: false,
    });

    setText('');
  }

  function handleLongPress(message: Message) {
    if (message.senderId !== currentUser.id) {
      Alert.alert('Reagir à mensagem', '', [
        {
          text: '❤️',
          onPress: () => reactToMessage(message.id, '❤️'),
        },
        {
          text: '😂',
          onPress: () => reactToMessage(message.id, '😂'),
        },
        {
          text: '😮',
          onPress: () => reactToMessage(message.id, '😮'),
        },
        {
          text: '😢',
          onPress: () => reactToMessage(message.id, '😢'),
        },
        {
          text: '👍',
          onPress: () => reactToMessage(message.id, '👍'),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]);
    } else {
      Alert.alert('Opções da mensagem', '', [
        {
          text: 'Excluir mensagem',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Excluir mensagem',
              'Tem certeza que deseja excluir esta mensagem?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Excluir',
                  style: 'destructive',
                  onPress: () => deleteMessage(message.id),
                },
              ],
            );
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]);
    }
  }

  function renderMessage({ item }: { item: Message }) {
    const isMe = item.senderId === currentUser.id;
    const showReadReceipt = isMe && item.read;

    return (
      <Pressable
        onLongPress={() => handleLongPress(item)}
        style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        {item.text && (
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.theirMessageText,
            ]}
          >
            {item.text}
          </Text>
        )}

        {item.sharedPost && (
          <SharedPostPreview postId={item.sharedPost.postId} />
        )}

        {item.reaction && (
          <View style={styles.reactionBadge}>
            <Text style={styles.reactionEmoji}>{item.reaction}</Text>
          </View>
        )}

        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.messageTime,
              isMe ? styles.myMessageTime : styles.theirMessageTime,
            ]}
          >
            {formatTimeAgo(item.createdAt)}
          </Text>
          {showReadReceipt && (
            <Ionicons
              name="checkmark-done"
              size={14}
              color="rgba(255,255,255,0.7)"
              style={{ marginLeft: 4 }}
            />
          )}
          {isMe && !showReadReceipt && (
            <Ionicons
              name="checkmark"
              size={14}
              color="rgba(255,255,255,0.7)"
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </Pressable>
    );
  }

  if (!conversation || !recipient) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Conversa não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <UserAvatar
            uri={recipient.avatar}
            size={36}
            verified={recipient.verified}
            onPress={() => router.push(`/profile/${recipient.id}` as any)}
          />
          <Pressable
            style={styles.headerInfo}
            onPress={() => router.push(`/profile/${recipient.id}` as any)}
          >
            <View style={styles.headerNameRow}>
              <Text style={styles.headerName}>{recipient.name}</Text>
              {recipient.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={colors.primary}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <Text style={styles.headerStatus}>
              {isTyping ? 'digitando...' : 'Ativo há 5m'}
            </Text>
          </Pressable>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          renderItem={renderMessage}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <UserAvatar
                uri={recipient.avatar}
                size={80}
                verified={recipient.verified}
              />
              <Text style={styles.emptyName}>{recipient.name}</Text>
              <Text style={styles.emptyUsername}>@{recipient.username}</Text>
              <Text style={styles.emptyText}>
                Envie uma mensagem para iniciar a conversa
              </Text>
            </View>
          }
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
            multiline
            maxLength={500}
          />
          <Pressable
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim()}
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
  headerInfo: {
    flex: 1,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
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
    position: 'relative',
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
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.6)',
  },
  theirMessageTime: {
    color: colors.muted,
  },
  reactionBadge: {
    position: 'absolute',
    bottom: -8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 15,
    maxHeight: 100,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptyUsername: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.muted,
  },
});
