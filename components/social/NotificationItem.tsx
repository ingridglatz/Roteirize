import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSocial } from '../../context/SocialContext';
import { colors } from '../../theme/colors';
import { Notification } from '../../types/Social';
import { formatTimeAgo } from '../../utils/socialHelpers';
import FollowButton from './FollowButton';
import UserAvatar from './UserAvatar';

type Props = {
  notification: Notification;
  onPress: () => void;
};

export default function NotificationItem({ notification, onPress }: Props) {
  const router = useRouter();
  const { getUser, isFollowing } = useSocial();
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
      <UserAvatar
        uri={notification.fromAvatar}
        size={44}
        verified={user?.verified}
        onPress={handleUserPress}
      />

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

      {!notification.read && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  unread: {
    backgroundColor: '#F0F8FF',
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  username: {
    fontWeight: '600',
    color: colors.text,
  },
  action: {
    color: colors.text,
  },
  time: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    position: 'absolute',
    left: 8,
    top: '50%',
    marginTop: -4,
  },
});
