import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '../../context/ChatContext';
import { useSocial } from '../../context/SocialContext';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { getColors } from '../../theme/colors';
import { Conversation } from '../../types/Social';

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
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

    conversationList: {
      paddingVertical: 8,
    },
    conversationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    conversationAvatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
    },
    typingIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.background,
    },
    typingDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#fff',
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
    },
    conversationName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    conversationTime: {
      fontSize: 12,
      color: colors.muted,
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

    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
      paddingHorizontal: 32,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyTextDesc: {
      fontSize: 14,
      color: colors.muted,
      textAlign: 'center',
      lineHeight: 20,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
      paddingBottom: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },

    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 16,
      marginTop: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
    },

    userList: {
      paddingVertical: 8,
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    userAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    userInfo: {
      flex: 1,
    },
    userNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    userUsername: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 2,
    },
    emptyText: {
      fontSize: 14,
      color: colors.muted,
      textAlign: 'center',
      paddingVertical: 32,
    },
  });
}

function UserSearchModal({
  visible,
  onClose,
  onSelectUser,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchUsers } = useSocial();
  const { currentUser } = useUser();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const filteredUsers = searchUsers(searchQuery).filter(
    (user) => user.id !== currentUser.id,
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nova mensagem</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar usuários..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>

          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.userList}
            renderItem={({ item }) => (
              <Pressable
                style={styles.userRow}
                onPress={() => {
                  onSelectUser(item.id);
                  onClose();
                  setSearchQuery('');
                }}
              >
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.userAvatar}
                />
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{item.name}</Text>
                    {item.verified && (
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color={colors.primary}
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </View>
                  <Text style={styles.userUsername}>@{item.username}</Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

export default function ChatScreen() {
  const router = useRouter();
  const [showUserSearch, setShowUserSearch] = useState(false);
  const { conversations, deleteConversation, createConversation } = useChat();
  const { currentUser } = useUser();
  const { getUser } = useSocial();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleSelectUser = (userId: string) => {
    const existingConv = conversations.find(
      (c) =>
        c.participantIds.includes(userId) &&
        c.participantIds.includes(currentUser.id),
    );

    if (existingConv) {
      router.push(`/chat/${existingConv.id}` as any);
    } else {
      const newConv = createConversation(userId);
      router.push(`/chat/${newConv.id}` as any);
    }
  };

  const handleLongPress = (conversation: Conversation) => {
    Alert.alert('Opções', 'O que deseja fazer com esta conversa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar conversa',
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            'Deletar conversa',
            'Tem certeza que deseja deletar esta conversa? Esta ação não pode ser desfeita.',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Deletar',
                style: 'destructive',
                onPress: () => deleteConversation(conversation.id),
              },
            ],
          );
        },
      },
    ]);
  };

  const getOtherParticipant = (conversation: Conversation) => {
    const otherParticipantId = conversation.participantIds.find(
      (id) => id !== currentUser.id,
    );
    return otherParticipantId ? getUser(otherParticipantId) : undefined;
  };

  const getLastMessageText = (conversation: Conversation) => {
    if (!conversation.lastMessage) return 'Sem mensagens';

    if (conversation.lastMessage.text) {
      return conversation.lastMessage.text;
    }
    if (conversation.lastMessage.sharedPost) {
      return '📎 Publicação compartilhada';
    }
    if (conversation.lastMessage.mediaType === 'image') {
      return '📷 Foto';
    }
    if (conversation.lastMessage.mediaType === 'video') {
      return '🎥 Vídeo';
    }
    if (conversation.lastMessage.mediaType === 'document') {
      return `📄 ${conversation.lastMessage.mediaName || 'Documento'}`;
    }
    return '';
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}min`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <Pressable onPress={() => setShowUserSearch(true)} hitSlop={12}>
          <Ionicons name="create-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.conversationList}
        renderItem={({ item }) => {
          const otherUser = getOtherParticipant(item);
          if (!otherUser) return null;

          return (
            <Pressable
              style={styles.conversationRow}
              onPress={() => router.push(`/chat/${item.id}` as any)}
              onLongPress={() => handleLongPress(item)}
            >
              <View>
                <Image
                  source={{ uri: otherUser.avatar }}
                  style={styles.conversationAvatar}
                />
                {item.typing && item.typing.length > 0 && (
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDot} />
                  </View>
                )}
              </View>

              <View style={styles.conversationBody}>
                <View style={styles.conversationTop}>
                  <View style={styles.nameRow}>
                    <Text style={styles.conversationName}>
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
                      {getTimeAgo(item.lastMessage.createdAt)}
                    </Text>
                  )}
                </View>

                <View style={styles.conversationBottom}>
                  <Text
                    style={[
                      styles.conversationMsg,
                      item.unreadCount > 0 && styles.conversationMsgUnread,
                    ]}
                    numberOfLines={1}
                  >
                    {getLastMessageText(item)}
                  </Text>
                  {item.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>
                        {item.unreadCount > 9 ? '9+' : item.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubbles-outline"
              size={64}
              color={colors.muted}
            />
            <Text style={styles.emptyTitle}>Nenhuma conversa</Text>
            <Text style={styles.emptyTextDesc}>
              Toque no ícone + para iniciar uma conversa
            </Text>
          </View>
        }
      />

      <UserSearchModal
        visible={showUserSearch}
        onClose={() => setShowUserSearch(false)}
        onSelectUser={handleSelectUser}
      />
    </SafeAreaView>
  );
}
