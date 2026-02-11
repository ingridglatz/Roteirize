import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import FollowButton from '../../components/social/FollowButton';
import { useChat } from '../../context/ChatContext';
import { useSocial } from '../../context/SocialContext';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { getColors } from '../../theme/colors';
import { formatCount } from '../../utils/socialHelpers';
import { Story } from '../../types/Social';
import StoryViewer from '../post/StoryViewer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const POST_SIZE = (SCREEN_WIDTH - 4) / 3;

type TabType = 'posts' | 'albums';

type Highlight = {
  id: string;
  title: string;
  cover: string;
  stories: Story[];
};

type TripAlbum = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  photos: string[];
  location?: string;
  createdAt: string;
};

function HighlightItem({ highlight, onPress, styles }: { highlight: Highlight; onPress: () => void; styles: ReturnType<typeof createStyles> }) {
  return (
    <Pressable style={styles.highlightItem} onPress={onPress}>
      <View style={styles.highlightRing}>
        <Image source={{ uri: highlight.cover }} style={styles.highlightImage} />
      </View>
      <Text style={styles.highlightTitle} numberOfLines={1}>{highlight.title}</Text>
    </Pressable>
  );
}

export default function UserProfile() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { currentUser } = useUser();
  const { getUser, posts, isFollowing, isBlocked, blockUser, unblockUser } =
    useSocial();
  const { createConversation } = useChat();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<TripAlbum | null>(null);
  const [albumViewerVisible, setAlbumViewerVisible] = useState(false);

  const user = getUser(userId);
  const isOwnProfile = userId === currentUser.id;
  const blocked = isBlocked(userId);
  const following = isFollowing(userId);

  const userPosts = useMemo(
    () => posts.filter((p) => p.userId === userId),
    [posts, userId],
  );

  // Mock highlights for the user (in a real app, this would come from the user's data)
  const userHighlights: Highlight[] = useMemo(() => {
    if (!user) return [];
    return [
      {
        id: '1',
        title: 'Viagens',
        cover: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200',
        stories: [
          {
            id: 'uh1-1',
            userId: userId,
            user: user.name,
            username: user.username,
            avatar: user.avatar,
            images: [{ uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800' }],
            seen: false,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            reactions: [],
            replies: [],
          },
        ],
      },
      {
        id: '2',
        title: 'Aventuras',
        cover: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=200',
        stories: [
          {
            id: 'uh2-1',
            userId: userId,
            user: user.name,
            username: user.username,
            avatar: user.avatar,
            images: [{ uri: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800' }],
            seen: false,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            reactions: [],
            replies: [],
          },
        ],
      },
    ];
  }, [user, userId]);

  // Mock albums for the user
  const userAlbums: TripAlbum[] = useMemo(() => {
    if (!user) return [];
    return [
      {
        id: 'album-1',
        title: 'Ferias na Europa',
        description: 'Uma viagem incrivel pela Europa',
        coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400',
        photos: [
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
          'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800',
        ],
        location: 'Paris, Franca',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'album-2',
        title: 'Praias do Nordeste',
        description: 'Explorando as praias mais bonitas',
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
        photos: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        ],
        location: 'Natal, Brasil',
        createdAt: new Date().toISOString(),
      },
    ];
  }, [user]);

  function handleBack() {
    router.back();
  }

  function handleMessage() {
    const conversation = createConversation(userId);
    router.push(`/chat/${conversation.id}` as any);
  }

  function handleOptions() {
    const options = blocked
      ? ['Desbloquear', 'Denunciar', 'Cancelar']
      : following
        ? ['Deixar de seguir', 'Bloquear', 'Denunciar', 'Cancelar']
        : ['Bloquear', 'Denunciar', 'Cancelar'];

    Alert.alert('Opcoes', '', [
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
            // Handle unfollow
          } else if (option === 'Denunciar') {
            handleReport();
          }
        },
      })),
    ]);
  }

  function handleBlock() {
    Alert.alert(
      'Bloquear usuario',
      `Tem certeza que deseja bloquear @${user?.username}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Bloquear',
          style: 'destructive',
          onPress: () => {
            blockUser(userId);
            Alert.alert('Bloqueado', 'Usuario bloqueado com sucesso');
          },
        },
      ],
    );
  }

  function handleUnblock() {
    unblockUser(userId);
    Alert.alert('Desbloqueado', 'Usuario desbloqueado com sucesso');
  }

  function handleReport() {
    Alert.alert(
      'Denuncia enviada',
      'Obrigado por nos ajudar a manter a comunidade segura.',
    );
  }

  function handleFollowersPress() {
    router.push(`/profile/followers/${userId}` as any);
  }

  function handleFollowingPress() {
    router.push(`/profile/following/${userId}` as any);
  }

  function handleHighlightPress(highlight: Highlight) {
    setSelectedHighlight(highlight);
    setStoryViewerVisible(true);
  }

  function handlePostPress(postId: string, index: number) {
    router.push({
      pathname: '/post/[id]',
      params: { id: postId, userId: userId, startIndex: index.toString() },
    } as any);
  }

  function handleSuggestUsers() {
    router.push('/search' as any);
  }

  function handleAlbumPress(album: TripAlbum) {
    setSelectedAlbum(album);
    setAlbumViewerVisible(true);
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable onPress={handleBack} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.topBarUsername}>Perfil</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Usuario nao encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isOwnProfile) {
    router.replace('/(tabs)/perfil');
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.topBarUsername}>{user.username}</Text>
        <Pressable onPress={handleOptions} hitSlop={12}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            {user.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#3897F0" />
              </View>
            )}
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatCount(user.postsCount)}</Text>
              <Text style={styles.statLabel}>publicacoes</Text>
            </View>
            <Pressable style={styles.statItem} onPress={handleFollowersPress}>
              <Text style={styles.statNumber}>{formatCount(user.followersCount)}</Text>
              <Text style={styles.statLabel}>seguidores</Text>
            </Pressable>
            <Pressable style={styles.statItem} onPress={handleFollowingPress}>
              <Text style={styles.statNumber}>{formatCount(user.followingCount)}</Text>
              <Text style={styles.statLabel}>seguindo</Text>
            </Pressable>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.bioSection}>
          <Text style={styles.displayName}>{user.name}</Text>
          {user.bio && <Text style={styles.bioText}>{user.bio}</Text>}
        </View>

        {/* Action Buttons */}
        {!blocked ? (
          <View style={styles.actionButtons}>
            <View style={styles.actionButtonWrapper}>
              <FollowButton userId={userId} size="small" fullWidth />
            </View>
            <View style={styles.actionButtonWrapper}>
              <Button
                title="Mensagem"
                variant="secondary"
                size="small"
                onPress={handleMessage}
              />
            </View>
            <Pressable style={styles.discoverButton} onPress={handleSuggestUsers}>
              <Ionicons name="person-add-outline" size={16} color={colors.text} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.blockedContainer}>
            <Text style={styles.blockedText}>Voce bloqueou este usuario</Text>
            <Pressable style={styles.unblockButton} onPress={handleUnblock}>
              <Text style={styles.unblockButtonText}>Desbloquear</Text>
            </Pressable>
          </View>
        )}

        {/* Story Highlights */}
        {!blocked && userHighlights.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightsContainer}
          >
            {userHighlights.map((highlight) => (
              <HighlightItem
                key={highlight.id}
                highlight={highlight}
                onPress={() => handleHighlightPress(highlight)}
                styles={styles}
              />
            ))}
          </ScrollView>
        )}

        {/* Tab Bar */}
        {!blocked && (
          <>
            <View style={styles.tabBar}>
              <Pressable
                style={[styles.tabItem, activeTab === 'posts' && styles.tabItemActive]}
                onPress={() => setActiveTab('posts')}
              >
                <Ionicons
                  name="grid-outline"
                  size={24}
                  color={activeTab === 'posts' ? colors.text : colors.muted}
                />
              </Pressable>
              <Pressable
                style={[styles.tabItem, activeTab === 'albums' && styles.tabItemActive]}
                onPress={() => setActiveTab('albums')}
              >
                <Ionicons
                  name="albums-outline"
                  size={24}
                  color={activeTab === 'albums' ? colors.text : colors.muted}
                />
              </Pressable>
            </View>

            {/* Posts Grid */}
            {activeTab === 'posts' && (
              <View style={styles.postsGrid}>
                {userPosts.length > 0 ? (
                  userPosts.map((post, index) => (
                    <Pressable
                      key={post.id}
                      style={styles.postGridItem}
                      onPress={() => handlePostPress(post.id, index)}
                    >
                      <Image source={post.image} style={styles.postGridImage} />
                      {post.comments > 0 && (
                        <View style={styles.postMultipleIcon}>
                          <Ionicons name="chatbubble" size={14} color="#FFFFFF" />
                        </View>
                      )}
                    </Pressable>
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                      <Ionicons name="camera-outline" size={48} color={colors.text} />
                    </View>
                    <Text style={styles.emptyTitle}>Nenhuma publicacao ainda</Text>
                  </View>
                )}
              </View>
            )}

            {/* Albums Grid */}
            {activeTab === 'albums' && (
              <View style={styles.albumsSection}>
                {userAlbums.length > 0 ? (
                  <View style={styles.albumsGrid}>
                    {userAlbums.map((album) => (
                      <Pressable
                        key={album.id}
                        style={styles.albumCard}
                        onPress={() => handleAlbumPress(album)}
                      >
                        <Image source={{ uri: album.coverImage }} style={styles.albumCoverImage} />
                        <View style={styles.albumGradient} />
                        <View style={styles.albumContent}>
                          <View style={styles.albumHeader}>
                            {album.location && (
                              <View style={styles.albumLocationBadge}>
                                <Ionicons name="location" size={10} color="#FFFFFF" />
                                <Text style={styles.albumLocationText} numberOfLines={1}>
                                  {album.location}
                                </Text>
                              </View>
                            )}
                            <View style={styles.albumPhotoBadge}>
                              <Ionicons name="images" size={10} color="#FFFFFF" />
                              <Text style={styles.albumPhotoCount}>{album.photos.length}</Text>
                            </View>
                          </View>
                          <View style={styles.albumFooter}>
                            <Text style={styles.albumTitle} numberOfLines={1}>{album.title}</Text>
                            <Text style={styles.albumDescription} numberOfLines={1}>
                              {album.description}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                      <Ionicons name="albums-outline" size={48} color={colors.text} />
                    </View>
                    <Text style={styles.emptyTitle}>Nenhum album ainda</Text>
                    <Text style={styles.emptySubtitle}>
                      Quando @{user.username} criar albuns, eles aparecerao aqui.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Story Viewer for Highlights */}
      {storyViewerVisible && selectedHighlight && (
        <StoryViewer
          stories={selectedHighlight.stories}
          initialIndex={0}
          onClose={() => {
            setStoryViewerVisible(false);
            setSelectedHighlight(null);
          }}
        />
      )}

      {/* Album Viewer Modal */}
      <Modal
        visible={albumViewerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setAlbumViewerVisible(false);
          setSelectedAlbum(null);
        }}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.albumViewerHeader}>
            <Pressable
              onPress={() => {
                setAlbumViewerVisible(false);
                setSelectedAlbum(null);
              }}
              hitSlop={12}
            >
              <Ionicons name="close" size={28} color={colors.text} />
            </Pressable>
            <Text style={styles.albumViewerTitle}>{selectedAlbum?.title}</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedAlbum && (
              <>
                <View style={styles.albumViewerInfo}>
                  {selectedAlbum.description && (
                    <Text style={styles.albumViewerDescription}>
                      {selectedAlbum.description}
                    </Text>
                  )}
                  {selectedAlbum.location && (
                    <View style={styles.albumViewerLocation}>
                      <Ionicons name="location-outline" size={16} color={colors.primary} />
                      <Text style={styles.albumViewerLocationText}>
                        {selectedAlbum.location}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.albumViewerPhotoCount}>
                    {selectedAlbum.photos.length} fotos
                  </Text>
                </View>

                <View style={styles.albumViewerPhotosGrid}>
                  {selectedAlbum.photos.map((photo, index) => (
                    <Image
                      key={index}
                      source={{ uri: photo }}
                      style={styles.albumViewerPhoto}
                    />
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderColor: colors.border,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.background,
    borderRadius: 10,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
  },
  bioSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  displayName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  bioText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  actionButtonWrapper: {
    flex: 1,
  },
  followButtonWrapper: {
    flex: 1,
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  discoverButton: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestButton: {
    backgroundColor: '#EFEFEF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockedContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  blockedText: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 12,
  },
  unblockButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  unblockButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  highlightsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 16,
  },
  highlightItem: {
    alignItems: 'center',
    width: 70,
  },
  highlightRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  highlightImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  highlightTitle: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.text,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postGridItem: {
    width: POST_SIZE,
    height: POST_SIZE,
    margin: 1,
    position: 'relative',
  },
  postGridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  postMultipleIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    width: '100%',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
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
  // Album styles
  albumsSection: {
    paddingTop: 8,
  },
  albumsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    gap: 12,
  },
  albumCard: {
    width: (SCREEN_WIDTH - 28) / 2,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  albumCoverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  albumGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  albumContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 12,
  },
  albumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  albumLocationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    maxWidth: '70%',
  },
  albumLocationText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  albumPhotoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  albumPhotoCount: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  albumFooter: {
    gap: 2,
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  albumDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Modal styles
  modalSafe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  albumViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  albumViewerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  albumViewerInfo: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  albumViewerDescription: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  albumViewerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  albumViewerLocationText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  albumViewerPhotoCount: {
    fontSize: 13,
    color: colors.muted,
  },
  albumViewerPhotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  albumViewerPhoto: {
    width: POST_SIZE,
    height: POST_SIZE,
    margin: 1,
  },
  });
}
