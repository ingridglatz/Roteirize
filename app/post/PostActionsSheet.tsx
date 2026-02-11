import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { getColors } from '../../theme/colors';

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
  colors,
  styles,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  colors: ReturnType<typeof getColors>;
  styles: ReturnType<typeof createStyles>;
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
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();

  if (!post) return null;

  const following = isFollowing(post.userId);

  function handleUnfollow() {
    if (!post) return;
    Alert.alert(
      t('post.unfollow'),
      t('post.unfollowConfirm', { username: post.username }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('post.unfollow'),
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
      t('post.blockUser'),
      t('post.blockConfirm', { username: post.username }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.block'),
          style: 'destructive',
          onPress: () => {
            if (!post) return;
            blockUser(post.userId);
            onClose();
            Alert.alert(t('post.blocked'), t('post.userBlocked'));
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
      post.allowComments ? t('post.commentsDisabled') : t('post.commentsEnabled'),
      post.allowComments
        ? t('post.commentsDisabledMsg')
        : t('post.commentsEnabledMsg'),
    );
  }

  function handleToggleLikesVisibility() {
    if (!post) return;
    updatePost(post.id, { hideLikes: !post.hideLikes });
    onClose();
    Alert.alert(
      post.hideLikes ? t('post.likesVisible') : t('post.likesHidden'),
      post.hideLikes
        ? t('post.likesVisibleMsg')
        : t('post.likesHiddenMsg'),
    );
  }

  async function handleShareLink() {
    if (!post) return;
    try {
      await Share.share({
        message: t('post.shareMessage', { username: post.username, postId: post.id }),
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  function handleCopyLink() {
    Alert.alert(
      t('post.linkCopied'),
      t('post.linkCopiedMsg'),
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
      t('post.notInterested'),
      t('post.notInterestedMsg'),
      [{ text: t('common.ok'), onPress: onClose }],
    );
  }

  function handleWhySeeing() {
    if (!post) return;
    Alert.alert(
      t('post.whySeeingThis'),
      t('post.whySeeingMsg', { username: post.username }),
      [{ text: t('common.ok') }],
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
                <ActionButton colors={colors} styles={styles}
                  icon="create-outline"
                  label={t('post.editPost')}
                  onPress={onEdit}
                />
                <ActionButton colors={colors} styles={styles}
                  icon={
                    post.allowComments
                      ? 'chatbubble-outline'
                      : 'chatbubble-ellipses-outline'
                  }
                  label={
                    post.allowComments
                      ? t('post.disableComments')
                      : t('post.enableComments')
                  }
                  onPress={handleToggleComments}
                />
                <ActionButton colors={colors} styles={styles}
                  icon={post.hideLikes ? 'eye-outline' : 'eye-off-outline'}
                  label={
                    post.hideLikes
                      ? t('post.showLikeCount')
                      : t('post.hideLikeCount')
                  }
                  onPress={handleToggleLikesVisibility}
                />
                <ActionButton colors={colors} styles={styles}
                  icon="share-outline"
                  label={t('post.shareTo')}
                  onPress={handleShareLink}
                />
                <ActionButton colors={colors} styles={styles}
                  icon="link-outline"
                  label={t('post.copyLink')}
                  onPress={handleCopyLink}
                />
                <ActionButton colors={colors} styles={styles}
                  icon="trash-outline"
                  label={t('post.deletePost')}
                  onPress={onDelete}
                  destructive
                />
              </>
            ) : (
              <>
                <ActionButton colors={colors} styles={styles}
                  icon="share-outline"
                  label={t('post.shareTo')}
                  onPress={handleShareLink}
                />
                <ActionButton colors={colors} styles={styles}
                  icon="link-outline"
                  label={t('post.copyLink')}
                  onPress={handleCopyLink}
                />
                <ActionButton colors={colors} styles={styles}
                  icon="qr-code-outline"
                  label={t('post.qrCode')}
                  onPress={() => {
                    Alert.alert(
                      t('post.qrCode'),
                      t('post.inDevelopment'),
                    );
                    onClose();
                  }}
                />
                <ActionButton colors={colors} styles={styles}
                  icon="person-outline"
                  label={t('post.aboutAccount')}
                  onPress={handleViewProfile}
                />
                <ActionButton colors={colors} styles={styles}
                  icon="information-circle-outline"
                  label={t('post.whySeeingThis')}
                  onPress={handleWhySeeing}
                />
                <ActionButton colors={colors} styles={styles}
                  icon="eye-off-outline"
                  label={t('post.notInterested')}
                  onPress={handleNotInterested}
                />
                {following && (
                  <ActionButton colors={colors} styles={styles}
                    icon="person-remove-outline"
                    label={t('post.unfollow')}
                    onPress={handleUnfollow}
                    destructive
                  />
                )}
                <ActionButton colors={colors} styles={styles}
                  icon="ban-outline"
                  label={t('common.block')}
                  onPress={handleBlock}
                  destructive
                />
                <ActionButton colors={colors} styles={styles}
                  icon="flag-outline"
                  label={t('common.report')}
                  onPress={onReport}
                  destructive
                />
              </>
            )}

            <ActionButton icon="close" label={t('common.cancel')} onPress={onClose} colors={colors} styles={styles} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
      backgroundColor: colors.background,
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
      backgroundColor: colors.muted,
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
}
