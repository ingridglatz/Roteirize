import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserAvatar from '../../components/social/UserAvatar';
import { useChat } from '../../context/ChatContext';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';
import { Conversation } from '../../types/Social';
import { formatTimeAgo } from '../../utils/socialHelpers';

export default function ChatList() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { conversations } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getOtherParticipant(conv: Conversation) {
    return conv.participants.find((p) => p.id !== currentUser.id);
  }

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) => {
      const otherUser = getOtherParticipant(conv);
      return (
        otherUser?.name.toLowerCase().includes(query) ||
        otherUser?.username.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, conversations, getOtherParticipant]);

  function handleConversationPress(id: string) {
    router.push(`/chat/${id}`);
  }

  function getLastMessagePreview(conv: (typeof conversations)[0]) {
    if (!conv.lastMessage) return 'Enviar mensagem';

    if (conv.lastMessage.sharedPost) {
      return 'Enviou uma publicação';
    }

    if (conv.lastMessage.text) {
      return conv.lastMessage.text;
    }

    return '';
  }

  function isConversationUnread(conv: (typeof conversations)[0]) {
    return conv.lastMessage && !conv.lastMessage.read;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <Pressable onPress={() => {}} hitSlop={12}>
          <Ionicons name="create-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color={colors.muted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar"
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const otherUser = getOtherParticipant(item);
          const isTyping = item.typing && item.typing.length > 0;
          const isUnread = isConversationUnread(item);

          if (!otherUser) return null;

          return (
            <Pressable
              style={styles.conversationRow}
              onPress={() => handleConversationPress(item.id)}
            >
              <UserAvatar
                uri={otherUser.avatar}
                size={56}
                verified={otherUser.verified}
                onPress={() => router.push(`/profile/${otherUser.id}` as any)}
              />
              <View style={styles.conversationBody}>
                <View style={styles.conversationTop}>
                  <View style={styles.nameRow}>
                    <Text
                      style={[
                        styles.conversationName,
                        isUnread && styles.conversationNameUnread,
                      ]}
                    >
                      {otherUser.name}
                    </Text>
                    {otherUser.verified && (
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color={colors.primary}
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </View>
                  {item.lastMessage && (
                    <Text style={styles.conversationTime}>
                      {formatTimeAgo(item.lastMessage.createdAt)}
                    </Text>
                  )}
                </View>
                <View style={styles.conversationBottom}>
                  <Text
                    style={[
                      styles.conversationMsg,
                      isUnread && styles.conversationMsgUnread,
                    ]}
                    numberOfLines={1}
                  >
                    {isTyping ? 'digitando...' : getLastMessagePreview(item)}
                  </Text>
                  {isUnread && !isTyping && <View style={styles.unreadDot} />}
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="chatbubbles-outline"
              size={64}
              color={colors.muted}
            />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Nenhuma conversa encontrada' : 'Sem mensagens'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Tente buscar por outro nome'
                : 'Envie mensagens privadas para seus amigos'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  list: {
    paddingVertical: 8,
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  conversationBody: {
    flex: 1,
  },
  conversationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  conversationName: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.text,
  },
  conversationNameUnread: {
    fontWeight: '700',
  },
  conversationTime: {
    fontSize: 12,
    color: colors.muted,
    marginLeft: 8,
  },
  conversationBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  conversationMsg: {
    fontSize: 14,
    color: colors.muted,
    flex: 1,
    marginRight: 8,
  },
  conversationMsgUnread: {
    color: colors.text,
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 8,
    textAlign: 'center',
  },
});
