import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { getColors } from '../../theme/colors';
import { Comment } from '../../types/Social';
import { useSocial } from '../../context/SocialContext';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import UserAvatar from './UserAvatar';
import { formatTimeAgo } from '../../utils/socialHelpers';

type Props = {
  comment: Comment;
  onReply: (comment: Comment) => void;
  onUserPress: (userId: string) => void;
};

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    content: {
      flex: 1,
      marginLeft: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    username: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
    },
    time: {
      fontSize: 12,
      color: colors.muted,
      flex: 1,
    },
    text: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      marginBottom: 8,
    },
    edited: {
      fontSize: 12,
      color: colors.muted,
      fontStyle: 'italic',
    },
    actions: {
      flexDirection: 'row',
      gap: 16,
    },
    actionButton: {
      paddingVertical: 2,
    },
    actionText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.muted,
    },
    actionTextActive: {
      color: colors.text,
    },
    viewRepliesButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      gap: 8,
    },
    replyLine: {
      width: 24,
      height: 1,
      backgroundColor: colors.border,
    },
    viewRepliesText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.muted,
    },
    editContainer: {
      marginTop: 4,
    },
    editInput: {
      fontSize: 14,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 8,
      minHeight: 60,
      marginBottom: 8,
      backgroundColor: colors.background,
    },
    editActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
    },
    cancelButton: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.muted,
    },
    saveButton: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
  });
}

export default function CommentItem({ comment, onReply, onUserPress }: Props) {
  const { currentUser } = useUser();
  const { toggleLikeComment, updateComment, deleteComment, getUser } = useSocial();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const user = getUser(comment.userId);
  const isOwnComment = comment.userId === currentUser.id;

  function handleLike() {
    toggleLikeComment(comment.id);
  }

  function handleOptions() {
    if (!isOwnComment) return;

    Alert.alert('Opções do comentário', '', [
      {
        text: 'Editar',
        onPress: () => {
          setIsEditing(true);
          setEditText(comment.text);
        },
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: handleDelete,
      },
      {
        text: 'Cancelar',
        style: 'cancel',
      },
    ]);
  }

  function handleDelete() {
    Alert.alert(
      'Excluir comentário',
      'Tem certeza que deseja excluir este comentário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteComment(comment.id),
        },
      ],
    );
  }

  function handleSaveEdit() {
    if (!editText.trim()) {
      Alert.alert('Erro', 'O comentário não pode estar vazio');
      return;
    }

    updateComment(comment.id, editText.trim());
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditText(comment.text);
  }

  return (
    <View style={styles.container}>
      <UserAvatar
        uri={comment.avatar}
        size={32}
        verified={user?.verified}
        onPress={() => onUserPress(comment.userId)}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => onUserPress(comment.userId)}>
            <View style={styles.userRow}>
              <Text style={styles.username}>{comment.username}</Text>
              {user?.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={12}
                  color={colors.primary}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
          </Pressable>
          <Text style={styles.time}>{formatTimeAgo(comment.createdAt)}</Text>
          {isOwnComment && !isEditing && (
            <Pressable onPress={handleOptions} hitSlop={8}>
              <Ionicons
                name="ellipsis-horizontal"
                size={16}
                color={colors.muted}
              />
            </Pressable>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              autoFocus
              placeholderTextColor={colors.muted}
            />
            <View style={styles.editActions}>
              <Pressable onPress={handleCancelEdit}>
                <Text style={styles.cancelButton}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={handleSaveEdit}>
                <Text style={styles.saveButton}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.text}>
              {comment.text}
              {comment.editedAt && (
                <Text style={styles.edited}> (editado)</Text>
              )}
            </Text>

            <View style={styles.actions}>
              <Pressable onPress={handleLike} style={styles.actionButton}>
                <Text
                  style={[
                    styles.actionText,
                    comment.liked && styles.actionTextActive,
                  ]}
                >
                  {comment.likes > 0 ? `${comment.likes} curtidas` : 'Curtir'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onReply(comment)}
                style={styles.actionButton}
              >
                <Text style={styles.actionText}>Responder</Text>
              </Pressable>
            </View>

            {comment.repliesCount > 0 && (
              <Pressable
                style={styles.viewRepliesButton}
                onPress={() => onReply(comment)}
              >
                <View style={styles.replyLine} />
                <Text style={styles.viewRepliesText}>
                  Ver {comment.repliesCount}{' '}
                  {comment.repliesCount === 1 ? 'resposta' : 'respostas'}
                </Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    </View>
  );
}
