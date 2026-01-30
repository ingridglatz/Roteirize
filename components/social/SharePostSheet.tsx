import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useChat } from '../../context/ChatContext';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';
import { Conversation, Post } from '../../types/Social';
import UserAvatar from './UserAvatar';

type Props = {
  post: Post | null;
  onClose: () => void;
  onShare?: () => void;
};

export default function SharePostSheet({ post, onClose, onShare }: Props) {
  const { conversations, sharePost } = useChat();
  const { currentUser } = useUser();
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
      return otherUser?.name.toLowerCase().includes(query);
    });
  }, [searchQuery, conversations, getOtherParticipant]);

  function handleShareToConversation(conversationId: string) {
    if (!post) return;
    sharePost(conversationId, post.id, post.image, post.caption, post.username);
    onClose();
    onShare?.();
  }

  function handleShareToStory() {
    onClose();
    onShare?.();
  }

  if (!post) return null;

  return (
    <Modal animationType="slide" transparent visible={!!post}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.drag} />
            <Text style={styles.title}>Compartilhar</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
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
          </View>

          <Pressable style={styles.storyOption} onPress={handleShareToStory}>
            <View style={styles.storyAvatarContainer}>
              <UserAvatar uri={currentUser.avatar} size={56} hasStory={false} />
              <View style={styles.storyIconBadge}>
                <Ionicons name="add" size={16} color="#fff" />
              </View>
            </View>
            <Text style={styles.storyText}>Seu story</Text>
          </Pressable>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Enviar em uma mensagem</Text>

          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const otherUser = getOtherParticipant(item);
              if (!otherUser) return null;

              return (
                <Pressable
                  style={styles.conversationItem}
                  onPress={() => handleShareToConversation(item.id)}
                >
                  <UserAvatar
                    uri={otherUser.avatar}
                    size={48}
                    hasStory={false}
                  />
                  <View style={styles.conversationInfo}>
                    <Text style={styles.conversationName}>
                      {otherUser.name}
                    </Text>
                    <Text style={styles.conversationUsername}>
                      @{otherUser.username}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery
                    ? 'Nenhuma conversa encontrada'
                    : 'Nenhuma conversa'}
                </Text>
              </View>
            }
            style={styles.conversationsList}
            showsVerticalScrollIndicator={false}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '80%',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
  },
  drag: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
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
  storyOption: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  storyAvatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  storyIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  conversationsList: {
    maxHeight: 300,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  conversationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  conversationName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  conversationUsername: {
    fontSize: 13,
    color: colors.muted,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.muted,
  },
});
