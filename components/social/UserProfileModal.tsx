import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSocial } from '../../context/SocialContext';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';
import { formatCount } from '../../utils/socialHelpers';
import FollowButton from './FollowButton';
import UserAvatar from './UserAvatar';

const { width } = Dimensions.get('window');

type Props = {
  userId: string | null;
  onClose: () => void;
};

export default function UserProfileModal({ userId, onClose }: Props) {
  const router = useRouter();
  const { currentUser } = useUser();
  const { getUser, posts, isBlocked } = useSocial();

  if (!userId) return null;

  const user = getUser(userId);
  if (!user) return null;

  const isOwnProfile = userId === currentUser.id;
  const blocked = isBlocked(userId);
  const userPosts = posts.filter((p) => p.userId === userId).slice(0, 6);

  function handleViewFullProfile() {
    onClose();
    router.push(`/profile/${userId}` as any);
  }

  function handleSendMessage() {
    onClose();
    router.push(`/chat/${userId}` as any);
  }

  return (
    <Modal
      visible={!!userId}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.profileSection}>
              <UserAvatar
                uri={user.avatar}
                size={80}
                verified={user.verified}
                hasStory={false}
              />
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.username}>@{user.username}</Text>
              {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
            </View>

            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatCount(user.postsCount)}
                </Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatCount(user.followersCount)}
                </Text>
                <Text style={styles.statLabel}>Seguidores</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatCount(user.followingCount)}
                </Text>
                <Text style={styles.statLabel}>Seguindo</Text>
              </View>
            </View>

            {!isOwnProfile && !blocked && (
              <View style={styles.actions}>
                <FollowButton userId={userId} size="medium" fullWidth />
                <Pressable
                  style={styles.messageButton}
                  onPress={handleSendMessage}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={20}
                    color={colors.text}
                  />
                </Pressable>
              </View>
            )}

            {blocked && (
              <View style={styles.blockedMessage}>
                <Text style={styles.blockedText}>
                  Você bloqueou este usuário
                </Text>
              </View>
            )}

            {userPosts.length > 0 && !blocked && (
              <>
                <View style={styles.postsHeader}>
                  <Text style={styles.postsTitle}>Publicações</Text>
                </View>
                <View style={styles.postsGrid}>
                  {userPosts.map((post) => (
                    <Pressable
                      key={post.id}
                      style={styles.gridItem}
                      onPress={handleViewFullProfile}
                    >
                      <Image source={post.image} style={styles.gridImage} />
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            {!blocked && (
              <Pressable
                style={styles.viewProfileButton}
                onPress={handleViewFullProfile}
              >
                <Text style={styles.viewProfileText}>Ver perfil completo</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={colors.primary}
                />
              </Pressable>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: Math.min(width - 40, 400),
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  username: {
    fontSize: 15,
    color: colors.muted,
    marginTop: 4,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockedMessage: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  blockedText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  postsHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  postsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 2,
    paddingBottom: 16,
  },
  gridItem: {
    width: (width - 40 - 4) / 3,
    height: (width - 40 - 4) / 3,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  viewProfileText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
