import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FollowButton from '../../components/social/FollowButton';
import UserAvatar from '../../components/social/UserAvatar';
import { useSocial } from '../../context/SocialContext';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';
import { formatCount } from '../../utils/socialHelpers';

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = (width - 4) / 3;

type Tab = 'posts' | 'tagged' | 'saved';

export default function UserProfile() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { currentUser } = useUser();
  const { getUser, posts, isFollowing, isBlocked, blockUser, unblockUser } =
    useSocial();

  const [activeTab, setActiveTab] = useState<Tab>('posts');

  const user = getUser(userId);
  const isOwnProfile = userId === currentUser.id;
  const blocked = isBlocked(userId);
  const following = isFollowing(userId);

  const userPosts = useMemo(
    () => posts.filter((p) => p.userId === userId),
    [posts, userId],
  );

  const savedPosts = useMemo(
    () => (isOwnProfile ? posts.filter((p) => p.saved) : []),
    [posts, isOwnProfile],
  );

  function handleBack() {
    router.back();
  }

  function handleMessage() {
    router.push(`/chat/${userId}` as any);
  }

  function handleOptions() {
    const options = isOwnProfile
      ? ['Configurações', 'Cancelar']
      : blocked
        ? ['Desbloquear', 'Denunciar', 'Cancelar']
        : following
          ? ['Deixar de seguir', 'Bloquear', 'Denunciar', 'Cancelar']
          : ['Bloquear', 'Denunciar', 'Cancelar'];

    Alert.alert('Opções', '', [
      ...options.map((option) => ({
        text: option,
        style: (option === 'Cancelar'
          ? 'cancel'
          : option === 'Bloquear' || option === 'Deixar de seguir'
            ? 'destructive'
            : 'default') as 'default' | 'cancel' | 'destructive',
        onPress: () => {
          if (option === 'Bloquear') {
            handleBlock();
          } else if (option === 'Desbloquear') {
            handleUnblock();
          } else if (option === 'Deixar de seguir') {
          } else if (option === 'Denunciar') {
            handleReport();
          } else if (option === 'Configurações') {
          }
        },
      })),
    ]);
  }

  function handleBlock() {
    Alert.alert(
      'Bloquear usuário',
      `Tem certeza que deseja bloquear @${user?.username}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Bloquear',
          style: 'destructive',
          onPress: () => {
            blockUser(userId);
            Alert.alert('Bloqueado', 'Usuário bloqueado com sucesso');
          },
        },
      ],
    );
  }

  function handleUnblock() {
    unblockUser(userId);
    Alert.alert('Desbloqueado', 'Usuário desbloqueado com sucesso');
  }

  function handleReport() {
    Alert.alert(
      'Denúncia enviada',
      'Obrigado por nos ajudar a manter a comunidade segura.',
    );
  }

  function handleFollowersPress() {
    router.push(`/profile/followers/${userId}` as any);
  }

  function handleFollowingPress() {
    router.push(`/profile/following/${userId}` as any);
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Usuário não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayPosts =
    activeTab === 'posts' ? userPosts : activeTab === 'saved' ? savedPosts : [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>@{user.username}</Text>
        <Pressable onPress={handleOptions} hitSlop={12}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <UserAvatar uri={user.avatar} size={80} verified={user.verified} />
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatCount(user.postsCount)}
                </Text>
                <Text style={styles.statLabel}>posts</Text>
              </View>
              <Pressable style={styles.statItem} onPress={handleFollowersPress}>
                <Text style={styles.statValue}>
                  {formatCount(user.followersCount)}
                </Text>
                <Text style={styles.statLabel}>seguidores</Text>
              </Pressable>
              <Pressable style={styles.statItem} onPress={handleFollowingPress}>
                <Text style={styles.statValue}>
                  {formatCount(user.followingCount)}
                </Text>
                <Text style={styles.statLabel}>seguindo</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.name}>{user.name}</Text>
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

          {!blocked && (
            <View style={styles.actionButtons}>
              {isOwnProfile ? (
                <>
                  <Pressable style={styles.editButton}>
                    <Text style={styles.editButtonText}>Editar perfil</Text>
                  </Pressable>
                  <Pressable style={styles.shareButton}>
                    <Ionicons
                      name="person-add-outline"
                      size={20}
                      color={colors.text}
                    />
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={styles.followButtonContainer}>
                    <FollowButton userId={userId} size="medium" fullWidth />
                  </View>
                  <Pressable
                    style={styles.messageButton}
                    onPress={handleMessage}
                  >
                    <Text style={styles.messageButtonText}>Mensagem</Text>
                  </Pressable>
                  <Pressable style={styles.shareButton}>
                    <Ionicons
                      name="person-add-outline"
                      size={20}
                      color={colors.text}
                    />
                  </Pressable>
                </>
              )}
            </View>
          )}

          {blocked && (
            <View style={styles.blockedContainer}>
              <Text style={styles.blockedText}>Você bloqueou este usuário</Text>
              <Pressable style={styles.unblockButton} onPress={handleUnblock}>
                <Text style={styles.unblockButtonText}>Desbloquear</Text>
              </Pressable>
            </View>
          )}
        </View>

        {!blocked && (
          <>
            <View style={styles.tabs}>
              <Pressable
                style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
                onPress={() => setActiveTab('posts')}
              >
                <Ionicons
                  name="grid-outline"
                  size={22}
                  color={activeTab === 'posts' ? colors.text : colors.muted}
                />
              </Pressable>
              {isOwnProfile && (
                <>
                  <Pressable
                    style={[
                      styles.tab,
                      activeTab === 'tagged' && styles.tabActive,
                    ]}
                    onPress={() => setActiveTab('tagged')}
                  >
                    <Ionicons
                      name="person-outline"
                      size={22}
                      color={
                        activeTab === 'tagged' ? colors.text : colors.muted
                      }
                    />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.tab,
                      activeTab === 'saved' && styles.tabActive,
                    ]}
                    onPress={() => setActiveTab('saved')}
                  >
                    <Ionicons
                      name="bookmark-outline"
                      size={22}
                      color={activeTab === 'saved' ? colors.text : colors.muted}
                    />
                  </Pressable>
                </>
              )}
            </View>

            <View style={styles.grid}>
              {displayPosts.length > 0 ? (
                displayPosts.map((post) => (
                  <Pressable
                    key={post.id}
                    style={styles.gridItem}
                    onPress={() => {}}
                  >
                    <Image source={post.image} style={styles.gridImage} />
                    {post.comments > 0 && (
                      <View style={styles.gridOverlay}>
                        <Ionicons name="chatbubble" size={18} color="#fff" />
                        <Text style={styles.gridOverlayText}>
                          {post.comments}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="images-outline"
                    size={64}
                    color={colors.muted}
                  />
                  <Text style={styles.emptyText}>Nenhuma publicação ainda</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  container: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
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
    color: colors.text,
    marginTop: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  followButtonContainer: {
    flex: 1,
  },
  editButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  messageButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockedContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  blockedText: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 12,
  },
  unblockButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  unblockButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  gridOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridOverlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  emptyState: {
    width: '100%',
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.muted,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.muted,
  },
});
