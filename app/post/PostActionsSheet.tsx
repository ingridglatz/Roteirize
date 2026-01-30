import { Ionicons } from '@expo/vector-icons';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type Post = {
  id: string;
  userId: string;
  user: string;
  location: string;
  avatar: string;
  image: any;
  caption: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  time: string;
};

type Props = {
  post: Post | null;
  isOwnPost: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
};

function ActionButton({
  icon,
  label,
  onPress,
  destructive = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <Pressable style={styles.actionButton} onPress={onPress}>
      <Ionicons
        name={icon}
        size={22}
        color={destructive ? colors.error : colors.text}
      />
      <Text style={[styles.actionLabel, destructive && { color: colors.error }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function PostActionsSheet({
  post,
  isOwnPost,
  onClose,
  onEdit,
  onDelete,
  onReport,
}: Props) {
  if (!post) return null;

  return (
    <Modal animationType="slide" transparent visible={!!post}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.drag} />
          </View>

          <View style={styles.actions}>
            {isOwnPost ? (
              <>
                <ActionButton
                  icon="create-outline"
                  label="Editar publicação"
                  onPress={onEdit}
                />
                <ActionButton
                  icon="trash-outline"
                  label="Excluir publicação"
                  onPress={onDelete}
                  destructive
                />
              </>
            ) : (
              <ActionButton
                icon="flag-outline"
                label="Denunciar publicação"
                onPress={onReport}
                destructive
              />
            )}

            <ActionButton icon="close" label="Cancelar" onPress={onClose} />
          </View>
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
  },
  header: {
    paddingTop: 10,
    paddingBottom: 12,
    alignItems: 'center',
  },
  drag: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  actions: {
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 14,
  },
  actionLabel: {
    fontSize: 16,
    color: colors.text,
  },
});
