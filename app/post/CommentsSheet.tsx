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
import { useState } from 'react';
import { colors } from '../../theme/colors';

type Comment = {
  id: string;
  user: string;
  avatar: string;
  text: string;
};

type Props = {
  post: any | null;
  onClose: () => void;
};

export default function CommentsSheet({ post, onClose }: Props) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'Lucas Oliveira',
      avatar: 'https://i.pravatar.cc/100?img=3',
      text: 'Que lugar lindo!',
    },
    {
      id: '2',
      user: 'Ana Clara',
      avatar: 'https://i.pravatar.cc/100?img=4',
      text: 'Uau, quero conhecer!',
    },
  ]);

  const [text, setText] = useState('');

  function handleSend() {
    if (!text.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: 'Você',
        avatar: 'https://i.pravatar.cc/100?img=12',
        text,
      },
    ]);

    setText('');
  }

  if (!post) return null;

  return (
    <Modal animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.drag} />

            <Text style={styles.title}>Comentários</Text>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Fechar</Text>
            </Pressable>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.commentContent}>
                  <Text style={styles.user}>{item.user}</Text>
                  <Text style={styles.text}>{item.text}</Text>
                </View>
              </View>
            )}
          />

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Adicione um comentário..."
              placeholderTextColor={colors.muted}
              value={text}
              onChangeText={setText}
              style={styles.input}
            />
            <Pressable onPress={handleSend}>
              <Text style={[styles.send, !text && { opacity: 0.4 }]}>
                Enviar
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  drag: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginBottom: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  closeButton: {
    position: 'absolute',
    right: 16,
    top: 18,
  },

  closeText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },

  list: {
    padding: 16,
    paddingBottom: 12,
  },

  comment: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },

  commentContent: {
    flex: 1,
  },

  user: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },

  text: {
    fontSize: 14,
    color: colors.text,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    paddingRight: 12,
  },

  send: {
    marginLeft: 8,
    paddingHorizontal: 8,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
});
