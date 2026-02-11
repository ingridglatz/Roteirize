import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSocial } from '../../context/SocialContext';
import { useTheme } from '../../context/ThemeContext';
import { getColors } from '../../theme/colors';
import { Notification } from '../../types/Social';
import { formatTimeAgo } from '../../utils/socialHelpers';
import FollowButton from './FollowButton';
import UserAvatar from './UserAvatar';

type Props = {
  notification: Notification;
  onPress: () => void;
};

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
      backgroundColor: colors.background,
    },
    unread: {
      backgroundColor: colors.primary + '08',
    },
    avatarWrapper: {
      position: 'relative',
    },
    content: {
      flex: 1,
      gap: 4,
    },
    text: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
    },
    username: {
      fontWeight: '700',
      color: colors.text,
    },
    action: {
      color: colors.muted,
      fontWeight: '400',
    },
    time: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    thumbnail: {
      width: 48,
      height: 48,
      borderRadius: 6,
      backgroundColor: colors.surface,
    },
    unreadDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
      position: 'absolute',
      right: -2,
      top: -2,
      borderWidth: 2,
      borderColor: colors.background,
    },
  });
}

export default function NotificationItem({ notification, onPress }: Props) {
  const router = useRouter();
  const { getUser, isFollowing } = useSocial();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const user = getUser(notification.fromUserId);

  function getNotificationText() {
    switch (notification.type) {
      case 'like':
        return 'curtiu sua publicação';
      case 'comment':
        return notification.text
          ? `comentou: ${notification.text}`
          : 'comentou em sua publicação';
      case 'follow':
        return 'começou a seguir você';
      case 'mention':
        return 'mencionou você em um comentário';
      case 'story_reaction':
        return 'reagiu ao seu story';
      case 'story_reply':
        return notification.text
          ? `respondeu ao seu story: ${notification.text}`
          : 'respondeu ao seu story';
      default:
        return 'interagiu com você';
    }
  }

  function handleUserPress() {
    router.push(`/profile/${notification.fromUserId}` as any);
  }

  const showFollowButton =
    notification.type === 'follow' && !isFollowing(notification.fromUserId);

  return (
    <Pressable
      style={[styles.container, !notification.read && styles.unread]}
      onPress={onPress}
    >
      <View style={styles.avatarWrapper}>
        <UserAvatar
          uri={notification.fromAvatar}
          size={48}
          verified={user?.verified}
          onPress={handleUserPress}
        />
        {!notification.read && <View style={styles.unreadDot} />}
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.username}>{notification.fromUsername}</Text>{' '}
          <Text style={styles.action}>{getNotificationText()}</Text>
        </Text>
        <Text style={styles.time}>{formatTimeAgo(notification.createdAt)}</Text>
      </View>

      {notification.postThumbnail ? (
        <Image source={notification.postThumbnail} style={styles.thumbnail} />
      ) : showFollowButton ? (
        <FollowButton userId={notification.fromUserId} size="small" />
      ) : null}
    </Pressable>
  );
}
