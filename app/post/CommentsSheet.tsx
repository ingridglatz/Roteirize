import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import CommentItem from '../../components/social/CommentItem';
import CommentReplies from '../../components/social/CommentReplies';
import { useSocial } from '../../context/SocialContext';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';
import { Comment, Post } from '../../types/Social';

type Props = {
  post: Post | null;
  onClose: () => void;
};

type SortType = 'recent' | 'top';

export default function CommentsSheet({ post, onClose }: Props) {
  const { currentUser } = useUser();
  const { getComments, addComment } = useSocial();

  const [text, setText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [sortType, setSortType] = useState<SortType>('recent');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set(),
  );

  const allComments = post ? getComments(post.id) : [];

  const sortedComments = useMemo(() => {
    if (sortType === 'top') {
      return [...allComments].sort((a, b) => b.likes - a.likes);
    }
    return allComments;
  }, [allComments, sortType]);

  if (!post) return null;

  function handleSend() {
    if (!text.trim() || !post) return;

    const newComment: Omit<Comment, 'id' | 'createdAt'> = {
      postId: post.id,
      userId: currentUser.id,
      user: currentUser.name,
      username: currentUser.username,
      avatar: currentUser.avatar,
      text: text.trim(),
      likes: 0,
      liked: false,
      parentId: replyingTo?.id,
      repliesCount: 0,
    };

    addComment(newComment);
    setText('');
    setReplyingTo(null);

    if (replyingTo) {
      setExpandedComments((prev) => new Set(prev).add(replyingTo.id));
    }
  }

  function handleReply(comment: Comment) {
    if (comment.repliesCount > 0) {
      setExpandedComments((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(comment.id)) {
          newSet.delete(comment.id);
        } else {
          newSet.add(comment.id);
        }
        return newSet;
      });
    }

    setReplyingTo(comment);
  }

  function handleCancelReply() {
    setReplyingTo(null);
    setText('');
  }

  function handleUserPress(userId: string) {
    console.log('Navigate to user:', userId);
  }

  return (
    <Modal animationType="slide" transparent visible={!!post}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.drag} />

            <View style={styles.headerContent}>
              <Text style={styles.title}>Comentários</Text>

              <View style={styles.sortButtons}>
                <Pressable
                  style={[
                    styles.sortButton,
                    sortType === 'recent' && styles.sortButtonActive,
                  ]}
                  onPress={() => setSortType('recent')}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortType === 'recent' && styles.sortButtonTextActive,
                    ]}
                  >
                    Recentes
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.sortButton,
                    sortType === 'top' && styles.sortButtonActive,
                  ]}
                  onPress={() => setSortType('top')}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortType === 'top' && styles.sortButtonTextActive,
                    ]}
                  >
                    Top
                  </Text>
                </Pressable>
              </View>
            </View>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <FlatList
            data={sortedComments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View key={item.id}>
                <CommentItem
                  comment={item}
                  onReply={handleReply}
                  onUserPress={handleUserPress}
                />
                {expandedComments.has(item.id) && (
                  <CommentReplies
                    parentCommentId={item.id}
                    onReply={handleReply}
                    onUserPress={handleUserPress}
                  />
                )}
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons
                  name="chatbubble-outline"
                  size={48}
                  color={colors.muted}
                />
                <Text style={styles.emptyText}>Nenhum comentário ainda</Text>
                <Text style={styles.emptySubtext}>
                  Seja o primeiro a comentar
                </Text>
              </View>
            }
          />

          <View style={styles.inputContainer}>
            {replyingTo && (
              <View style={styles.replyingToBar}>
                <Text style={styles.replyingToText}>
                  Respondendo @{replyingTo.username}
                </Text>
                <Pressable onPress={handleCancelReply} hitSlop={8}>
                  <Ionicons name="close" size={18} color={colors.muted} />
                </Pressable>
              </View>
            )}
            <View style={styles.inputRow}>
              <TextInput
                placeholder={
                  replyingTo
                    ? `Responder para @${replyingTo.username}...`
                    : 'Adicione um comentário...'
                }
                placeholderTextColor={colors.muted}
                value={text}
                onChangeText={setText}
                style={styles.input}
                multiline
                maxLength={500}
              />
              <Pressable
                onPress={handleSend}
                disabled={!text.trim()}
                style={styles.sendButton}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={text.trim() ? colors.primary : colors.muted}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drag: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginBottom: 12,
    alignSelf: 'center',
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  sortButtonActive: {
    backgroundColor: colors.text,
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  list: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#fff',
  },
  replyingToBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
  },
  replyingToText: {
    fontSize: 13,
    color: colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    maxHeight: 100,
    color: colors.text,
  },
  sendButton: {
    paddingBottom: 8,
  },
});
