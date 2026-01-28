import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { colors } from '../../theme/colors';

type Comment = {
  id: string;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  liked: boolean;
  timeAgo: string;
};

type Props = {
  post: any | null;
  onClose: () => void;
};

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    user: 'Lucas Oliveira',
    avatar: 'https://i.pravatar.cc/100?img=3',
    text: 'Que lugar lindo! Preciso conhecer.',
    likes: 12,
    liked: false,
    timeAgo: '1h',
  },
  {
    id: '2',
    user: 'Ana Clara',
    avatar: 'https://i.pravatar.cc/100?img=4',
    text: 'Uau, quero muito ir! Quanto tempo voce ficou?',
    likes: 5,
    liked: false,
    timeAgo: '2h',
  },
  {
    id: '3',
    user: 'Pedro Vieira',
    avatar: 'https://i.pravatar.cc/100?img=8',
    text: 'Foto incrivel! Qual camera voce usou?',
    likes: 3,
    liked: false,
    timeAgo: '3h',
  },
  {
    id: '4',
    user: 'Julia Mendes',
    avatar: 'https://i.pravatar.cc/100?img=9',
    text: 'Adicionei na minha lista de viagem!',
    likes: 8,
    liked: false,
    timeAgo: '5h',
  },
];

export default function CommentsSheet({ post, onClose }: Props) {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [text, setText] = useState('');

  function handleSend() {
    if (!text.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: 'Voce',
        avatar: 'https://i.pravatar.cc/100?img=12',
        text,
        likes: 0,
        liked: false,
        timeAgo: 'agora',
      },
    ]);

    setText('');
  }

  function toggleCommentLike(id: string) {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c,
      ),
    );
  }

  if (!post) return null;

  return (
    <Modal animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.overlayBg} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.drag} />
            <Text style={styles.title}>Comentarios</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.muted} />
            </Pressable>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.commentBody}>
                  <Text style={styles.commentText}>
                    <Text style={styles.commentUser}>{item.user} </Text>
                    {item.text}
                  </Text>
                  <View style={styles.commentMeta}>
                    <Text style={styles.commentTime}>{item.timeAgo}</Text>
                    {item.likes > 0 && (
                      <Text style={styles.commentLikesCount}>
                        {item.likes} curtida{item.likes !== 1 ? 's' : ''}
                      </Text>
                    )}
                    <Pressable>
                      <Text style={styles.commentReply}>Responder</Text>
                    </Pressable>
                  </View>
                </View>
                <Pressable
                  onPress={() => toggleCommentLike(item.id)}
                  hitSlop={10}
                  style={styles.commentLikeBtn}
                >
                  <Ionicons
                    name={item.liked ? 'heart' : 'heart-outline'}
                    size={14}
                    color={item.liked ? '#E53935' : colors.muted}
                  />
                </Pressable>
              </View>
            )}
          />

          <View style={styles.inputContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
              style={styles.inputAvatar}
            />
            <TextInput
              placeholder="Adicione um comentario..."
              placeholderTextColor={colors.muted}
              value={text}
              onChangeText={setText}
              style={styles.input}
              multiline
            />
            <Pressable onPress={handleSend} disabled={!text.trim()}>
              <Text style={[styles.send, !text.trim() && { opacity: 0.3 }]}>
                Publicar
              </Text>
            </Pressable>
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
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  sheet: {
    height: '75%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },

  header: {
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drag: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.disabled,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },

  list: {
    padding: 16,
    paddingBottom: 8,
  },

  comment: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentBody: {
    flex: 1,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 19,
  },
  commentUser: {
    fontWeight: '700',
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 6,
  },
  commentTime: {
    fontSize: 12,
    color: colors.muted,
  },
  commentLikesCount: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
  },
  commentReply: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
  },
  commentLikeBtn: {
    paddingTop: 8,
    paddingLeft: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#fff',
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    paddingRight: 12,
    maxHeight: 80,
    color: colors.text,
  },
  send: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
