import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSocial } from '../../context/SocialContext';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';

type Post = {
  id: string;
  userId: string;
  user: string;
  username: string;
  location: string;
  avatar: string;
  image: any;
  caption: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  time: string;
  createdAt: string;
  editedAt?: string;
  allowComments: boolean;
  hideLikes: boolean;
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
        color={destructive ? '#E53935' : colors.text}
      />
      <Text style={[styles.actionLabel, destructive && { color: '#E53935' }]}>
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
  useUser();
  const router = useRouter();
  const { isFollowing, unfollowUser, blockUser, updatePost } = useSocial();

  if (!post) return null;

  const following = isFollowing(post.userId);

  function handleUnfollow() {
    if (!post) return;
    Alert.alert(
      'Deixar de seguir',
      `Tem certeza que deseja deixar de seguir @${post.username}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deixar de seguir',
          style: 'destructive',
          onPress: () => {
            if (!post) return;
            unfollowUser(post.userId);
            onClose();
          },
        },
      ],
    );
  }

  function handleBlock() {
    if (!post) return;
    Alert.alert(
      'Bloquear usuário',
      `Tem certeza que deseja bloquear @${post.username}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Bloquear',
          style: 'destructive',
          onPress: () => {
            if (!post) return;
            blockUser(post.userId);
            onClose();
            Alert.alert('Bloqueado', 'Usuário bloqueado com sucesso');
          },
        },
      ],
    );
  }

  function handleToggleComments() {
    if (!post) return;
    updatePost(post.id, { allowComments: !post.allowComments });
    onClose();
    Alert.alert(
      post.allowComments ? 'Comentários desativados' : 'Comentários ativados',
      post.allowComments
        ? 'As pessoas não poderão mais comentar nesta publicação'
        : 'As pessoas podem comentar nesta publicação novamente',
    );
  }

  function handleToggleLikesVisibility() {
    if (!post) return;
    updatePost(post.id, { hideLikes: !post.hideLikes });
    onClose();
    Alert.alert(
      post.hideLikes ? 'Curtidas visíveis' : 'Curtidas ocultas',
      post.hideLikes
        ? 'O número de curtidas está visível novamente'
        : 'O número de curtidas foi ocultado',
    );
  }

  async function handleShareLink() {
    if (!post) return;
    try {
      await Share.share({
        message: `Confira esta publicação de @${post.username}: roteirize://post/${post.id}`,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  function handleCopyLink() {
    Alert.alert(
      'Link copiado',
      'O link foi copiado para a área de transferência',
    );
    onClose();
  }

  function handleViewProfile() {
    if (!post) return;
    onClose();
    router.push(`/profile/${post.userId}` as any);
  }

  function handleNotInterested() {
    Alert.alert(
      'Não tenho interesse',
      'Vamos mostrar menos publicações como esta.',
      [{ text: 'OK', onPress: onClose }],
    );
  }

  function handleWhySeeing() {
    if (!post) return;
    Alert.alert(
      'Por que estou vendo isto?',
      `Você está vendo esta publicação porque segue @${post.username} e interage com conteúdo similar.`,
      [{ text: 'OK' }],
    );
  }

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
                  icon={
                    post.allowComments
                      ? 'chatbubble-outline'
                      : 'chatbubble-ellipses-outline'
                  }
                  label={
                    post.allowComments
                      ? 'Desativar comentários'
                      : 'Ativar comentários'
                  }
                  onPress={handleToggleComments}
                />
                <ActionButton
                  icon={post.hideLikes ? 'eye-outline' : 'eye-off-outline'}
                  label={
                    post.hideLikes
                      ? 'Mostrar contagem de curtidas'
                      : 'Ocultar contagem de curtidas'
                  }
                  onPress={handleToggleLikesVisibility}
                />
                <ActionButton
                  icon="share-outline"
                  label="Compartilhar para..."
                  onPress={handleShareLink}
                />
                <ActionButton
                  icon="link-outline"
                  label="Copiar link"
                  onPress={handleCopyLink}
                />
                <ActionButton
                  icon="trash-outline"
                  label="Excluir publicação"
                  onPress={onDelete}
                  destructive
                />
              </>
            ) : (
              <>
                <ActionButton
                  icon="share-outline"
                  label="Compartilhar para..."
                  onPress={handleShareLink}
                />
                <ActionButton
                  icon="link-outline"
                  label="Copiar link"
                  onPress={handleCopyLink}
                />
                <ActionButton
                  icon="qr-code-outline"
                  label="Código QR"
                  onPress={() => {
                    Alert.alert(
                      'Código QR',
                      'Funcionalidade em desenvolvimento',
                    );
                    onClose();
                  }}
                />
                <ActionButton
                  icon="person-outline"
                  label="Sobre esta conta"
                  onPress={handleViewProfile}
                />
                <ActionButton
                  icon="information-circle-outline"
                  label="Por que estou vendo isto?"
                  onPress={handleWhySeeing}
                />
                <ActionButton
                  icon="eye-off-outline"
                  label="Não tenho interesse"
                  onPress={handleNotInterested}
                />
                {following && (
                  <ActionButton
                    icon="person-remove-outline"
                    label="Deixar de seguir"
                    onPress={handleUnfollow}
                    destructive
                  />
                )}
                <ActionButton
                  icon="ban-outline"
                  label="Bloquear"
                  onPress={handleBlock}
                  destructive
                />
                <ActionButton
                  icon="flag-outline"
                  label="Denunciar"
                  onPress={onReport}
                  destructive
                />
              </>
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
    maxHeight: '80%',
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
