import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FollowButton from '../../components/social/FollowButton';
import LikesListModal from '../../components/social/LikesListModal';
import SharePostSheet from '../../components/social/SharePostSheet';
import UserAvatar from '../../components/social/UserAvatar';
import UserProfileModal from '../../components/social/UserProfileModal';
import { useNotifications } from '../../context/NotificationContext';
import { useSocial } from '../../context/SocialContext';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';
import { Post, Story } from '../../types/Social';
import CommentsSheet from '../post/CommentsSheet';
import CreateContentSheet from '../post/CreateContentSheet';
import PostActionsSheet from '../post/PostActionsSheet';
import StoryViewer from '../post/StoryViewer';

const { width } = Dimensions.get('window');

function StoryBubble({
  story,
  onPress,
}: {
  story: Story;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.storyBubble} onPress={onPress}>
      <View style={[styles.storyRing, story.seen && styles.storyRingSeen]}>
        <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyName} numberOfLines={1}>
        {story.user}
      </Text>
    </Pressable>
  );
}

export default function Social() {
  const router = useRouter();
  const { currentUser } = useUser();
  const {
    posts: allPosts,
    stories: allStories,
    toggleLikePost,
    toggleSavePost,
    deletePost: deletePostContext,
    addPost: addPostContext,
    addStory: addStoryContext,
    markStorySeen,
    isBlocked,
    isFollowing,
  } = useSocial();
  const { unreadCount } = useNotifications();

  const posts = useMemo(
    () => allPosts.filter((p) => !isBlocked(p.userId)),
    [allPosts, isBlocked],
  );

  const stories = useMemo(
    () => allStories.filter((s) => !isBlocked(s.userId)),
    [allStories, isBlocked],
  );

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPostForActions, setSelectedPostForActions] =
    useState<Post | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [createSheetVisible, setCreateSheetVisible] = useState(false);
  const [profileModalUserId, setProfileModalUserId] = useState<string | null>(null);
  const [selectedPostForLikes, setSelectedPostForLikes] = useState<string | null>(null);
  const [selectedPostForShare, setSelectedPostForShare] = useState<Post | null>(null);
  const doubleTapRef = useRef<
    Record<string, ReturnType<typeof setTimeout> | null>
  >({});
  const heartAnims = useRef<Record<string, Animated.Value>>({});

  function getHeartAnim(id: string) {
    if (!heartAnims.current[id]) {
      heartAnims.current[id] = new Animated.Value(0);
    }
    return heartAnims.current[id];
  }

  function handleDoubleTap(id: string) {
    if (doubleTapRef.current[id]) {
      clearTimeout(doubleTapRef.current[id]!);
      doubleTapRef.current[id] = null;

      const post = posts.find((p) => p.id === id);
      if (post && !post.liked) {
        toggleLikePost(id);
      }

      const anim = getHeartAnim(id);
      anim.setValue(0);
      Animated.sequence([
        Animated.spring(anim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 400,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      doubleTapRef.current[id] = setTimeout(() => {
        doubleTapRef.current[id] = null;
      }, 300);
    }
  }

  function toggleLike(id: string) {
    toggleLikePost(id);
  }

  function toggleSave(id: string) {
    toggleSavePost(id);
  }

  const handleStoryPress = useCallback(
    (index: number) => {
      const story = stories[index];
      if (story) {
        markStorySeen(story.id);
      }
      setActiveStoryIndex(index);
    },
    [stories, markStorySeen],
  );

  const handleStoryClose = useCallback(() => {
    setActiveStoryIndex(null);
  }, []);

  const handleChatPress = useCallback(() => {
    router.push('/chat');
  }, [router]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  function handlePostMenuPress(post: Post) {
    setSelectedPostForActions(post);
  }

  function handleEditPost() {
    if (!selectedPostForActions) return;

    const postId = selectedPostForActions.id;
    setSelectedPostForActions(null);

    router.push(`/post/edit/${postId}` as any);
  }

  function handleDeletePost() {
    if (!selectedPostForActions) return;

    const postId = selectedPostForActions.id;
    setSelectedPostForActions(null);

    Alert.alert(
      'Excluir publicação',
      'Tem certeza que deseja excluir esta publicação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deletePostContext(postId);
          },
        },
      ],
    );
  }

  function handleReportPost() {
    if (!selectedPostForActions) return;

    setSelectedPostForActions(null);

    Alert.alert(
      'Denúncia enviada',
      'Obrigado por nos ajudar a manter a comunidade segura. Analisaremos sua denúncia em breve.',
      [{ text: 'OK' }],
    );
  }

  function handleCreatePost(caption: string, image: any) {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser.name,
      username: currentUser.username,
      location: 'Ubatuba, SP',
      avatar: currentUser.avatar,
      image: image,
      caption: caption,
      likes: 0,
      comments: 0,
      liked: false,
      saved: false,
      time: 'agora',
      createdAt: new Date().toISOString(),
      allowComments: true,
      hideLikes: false,
    };

    addPostContext(newPost);
    setCreateSheetVisible(false);

    Alert.alert('Sucesso', 'Sua publicação foi criada!');
  }

  function handleCreateStory(image: any) {
    addStoryContext({
      userId: currentUser.id,
      user: currentUser.name,
      username: currentUser.username,
      avatar: currentUser.avatar,
      images: [image],
      seen: false,
      reactions: [],
      replies: [],
    });
    setCreateSheetVisible(false);

    Alert.alert('Sucesso', 'Seu story foi publicado!');
  }

  function renderPost({ item }: { item: Post }) {
    const heartAnim = getHeartAnim(item.id);
    const heartScale = heartAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1.2],
    });
    const heartOpacity = heartAnim;

    const user = {
      id: item.userId,
      verified:
        item.userId === 'user-1' ||
        item.userId === 'user-3' ||
        item.userId === 'user-5' ||
        item.userId === 'user-7' ||
        item.userId === 'user-10',
    };

    const shouldShowFollowButton =
      item.userId !== currentUser.id && !isFollowing(item.userId);

    return (
      <View style={styles.post}>
        <View style={styles.postHeader}>
          <Pressable style={styles.postHeaderLeft}>
            <UserAvatar
              uri={item.avatar}
              size={36}
              verified={user.verified}
              hasStory={false}
              onPress={() => setProfileModalUserId(item.userId)}
            />
            <View style={styles.postHeaderInfo}>
              <Pressable onPress={() => setProfileModalUserId(item.userId)}>
                <View style={styles.postUserRow}>
                  <Text style={styles.postUser}>{item.user}</Text>
                  {user.verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color={colors.primary}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
              </Pressable>
              <Text style={styles.postLocation}>{item.location}</Text>
            </View>
          </Pressable>
          <View style={styles.postHeaderRight}>
            {shouldShowFollowButton && (
              <FollowButton userId={item.userId} size="small" />
            )}
            <Pressable
              onPress={() => handlePostMenuPress(item)}
              style={{ marginLeft: 8 }}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color={colors.text}
              />
            </Pressable>
          </View>
        </View>

        <Pressable onPress={() => handleDoubleTap(item.id)}>
          <Image source={item.image} style={styles.postImage} />
          <Animated.View
            style={[
              styles.doubleTapHeart,
              { opacity: heartOpacity, transform: [{ scale: heartScale }] },
            ]}
          >
            <Ionicons name="heart" size={80} color="#fff" />
          </Animated.View>
        </Pressable>

        <View style={styles.postActions}>
          <View style={styles.postActionsLeft}>
            <Pressable onPress={() => toggleLike(item.id)}>
              <Ionicons
                name={item.liked ? 'heart' : 'heart-outline'}
                size={26}
                color={item.liked ? '#E53935' : colors.text}
              />
            </Pressable>
            <Pressable onPress={() => setSelectedPost(item)}>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={colors.text}
              />
            </Pressable>
            <Pressable onPress={() => setSelectedPostForShare(item)}>
              <Ionicons
                name="paper-plane-outline"
                size={24}
                color={colors.text}
              />
            </Pressable>
          </View>
          <Pressable onPress={() => toggleSave(item.id)}>
            <Ionicons
              name={item.saved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={colors.text}
            />
          </Pressable>
        </View>

        <Pressable onPress={() => setSelectedPostForLikes(item.id)}>
          <Text style={styles.postLikes}>{item.likes} curtidas</Text>
        </Pressable>

        <Text style={styles.postCaption}>
          <Text style={styles.postCaptionUser}>{item.user} </Text>
          {item.caption}
        </Text>

        <Pressable onPress={() => setSelectedPost(item)}>
          <Text style={styles.postCommentsLink}>
            Ver todos os {item.comments} comentários
          </Text>
        </Pressable>

        <Text style={styles.postTime}>{item.time} atrás</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Social</Text>
        <View style={styles.topBarActions}>
          <Pressable onPress={() => router.push('/search' as any)}>
            <Ionicons name="search-outline" size={24} color={colors.text} />
          </Pressable>
          <Pressable onPress={() => setCreateSheetVisible(true)}>
            <Ionicons name="add-circle-outline" size={24} color={colors.text} />
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/notifications' as any)}
          >
            <View>
              <Ionicons name="heart-outline" size={24} color={colors.text} />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
          <Pressable onPress={handleChatPress}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={colors.text}
            />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesRow}
          >
            {stories.map((story, idx) => (
              <StoryBubble
                key={story.id}
                story={story}
                onPress={() => handleStoryPress(idx)}
              />
            ))}
          </ScrollView>
        }
      />

      <CommentsSheet
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      <PostActionsSheet
        post={selectedPostForActions}
        isOwnPost={selectedPostForActions?.userId === currentUser.id}
        onClose={() => setSelectedPostForActions(null)}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
        onReport={handleReportPost}
      />

      <CreateContentSheet
        visible={createSheetVisible}
        onClose={() => setCreateSheetVisible(false)}
        onCreatePost={handleCreatePost}
        onCreateStory={handleCreateStory}
      />

      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={handleStoryClose}
        />
      )}

      <UserProfileModal
        userId={profileModalUserId}
        onClose={() => setProfileModalUserId(null)}
      />

      <LikesListModal
        postId={selectedPostForLikes}
        onClose={() => setSelectedPostForLikes(null)}
        onUserPress={setProfileModalUserId}
      />

      <SharePostSheet
        post={selectedPostForShare}
        onClose={() => setSelectedPostForShare(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 18,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  storiesRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 14,
  },
  storyBubble: {
    alignItems: 'center',
    width: 68,
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  storyRingSeen: {
    borderColor: '#ccc',
  },
  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  storyName: {
    fontSize: 11,
    color: colors.text,
    textAlign: 'center',
  },
  post: {
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  postHeaderInfo: {
    flex: 1,
  },
  postUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  postUser: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.text,
  },
  postLocation: {
    fontSize: 12,
    color: colors.muted,
  },
  postImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
  },
  doubleTapHeart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  postActionsLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  postLikes: {
    fontWeight: '700',
    fontSize: 14,
    paddingHorizontal: 14,
    marginBottom: 4,
    color: colors.text,
  },
  postCaption: {
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  postCaptionUser: {
    fontWeight: '700',
  },
  postCommentsLink: {
    paddingHorizontal: 14,
    marginTop: 4,
    fontSize: 13,
    color: colors.muted,
  },
  postTime: {
    paddingHorizontal: 14,
    marginTop: 4,
    fontSize: 11,
    color: colors.muted,
  },
});
