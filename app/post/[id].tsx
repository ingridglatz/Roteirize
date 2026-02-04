import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserAvatar from '../../components/social/UserAvatar';
import { useSocial } from '../../context/SocialContext';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';
import { Post } from '../../types/Social';
import { formatTimeAgo } from '../../utils/socialHelpers';
import CommentsSheet from './CommentsSheet';

const { width } = Dimensions.get('window');

export default function PostDetailScreen() {
  const router = useRouter();
  const { id, userId, startIndex } = useLocalSearchParams<{
    id: string;
    userId?: string;
    startIndex?: string;
  }>();
  const { currentUser } = useUser();
  const { posts: allPosts, toggleLikePost, toggleSavePost, deletePost, getPost } = useSocial();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const userPosts = useMemo(() => {
    if (userId) {
      return allPosts.filter((p) => p.userId === userId);
    }
    const post = getPost(id);
    if (post) {
      return allPosts.filter((p) => p.userId === post.userId);
    }
    return [];
  }, [allPosts, userId, id, getPost]);

  const initialIndex = useMemo(() => {
    if (startIndex) {
      return parseInt(startIndex, 10);
    }
    const index = userPosts.findIndex((p) => p.id === id);
    return index >= 0 ? index : 0;
  }, [userPosts, id, startIndex]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleLike = useCallback(
    (postId: string) => {
      toggleLikePost(postId);
    },
    [toggleLikePost]
  );

  const handleSave = useCallback(
    (postId: string) => {
      toggleSavePost(postId);
    },
    [toggleSavePost]
  );

  const handleComment = useCallback((post: Post) => {
    setSelectedPost(post);
  }, []);

  const handleShare = useCallback(async (post: Post) => {
    try {
      await Share.share({
        message: `Confira essa publicacao de @${post.username}: ${post.caption}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  }, []);

  const handleUserPress = useCallback(
    (pressedUserId: string) => {
      if (pressedUserId === currentUser.id) {
        router.push('/(tabs)/perfil');
      } else {
        router.push(`/profile/${pressedUserId}` as any);
      }
    },
    [router, currentUser.id]
  );

  const handleOptions = useCallback(
    (post: Post) => {
      const isOwnPost = post.userId === currentUser.id;

      if (isOwnPost) {
        Alert.alert('Opcoes', '', [
          {
            text: 'Editar',
            onPress: () => router.push(`/post/edit/${post.id}` as any),
          },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: () => {
              Alert.alert(
                'Excluir publicacao',
                'Tem certeza que deseja excluir esta publicacao?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                      deletePost(post.id);
                      router.back();
                    },
                  },
                ]
              );
            },
          },
          { text: 'Cancelar', style: 'cancel' },
        ]);
      } else {
        Alert.alert('Opcoes', '', [
          {
            text: 'Denunciar',
            style: 'destructive',
            onPress: () =>
              Alert.alert('Denuncia enviada', 'Obrigado pelo feedback.'),
          },
          {
            text: 'Copiar link',
            onPress: () => Alert.alert('Link copiado!'),
          },
          { text: 'Cancelar', style: 'cancel' },
        ]);
      }
    },
    [currentUser.id, deletePost, router]
  );

  const handleDoubleTap = useCallback(
    (post: Post) => {
      if (!post.liked) {
        toggleLikePost(post.id);
      }
    },
    [toggleLikePost]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderPost = useCallback(
    ({ item: post }: { item: Post }) => (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Pressable
            style={styles.postHeaderLeft}
            onPress={() => handleUserPress(post.userId)}
          >
            <UserAvatar uri={post.avatar} size={36} />
            <View>
              <Text style={styles.postUsername}>{post.username}</Text>
              {post.location && (
                <Text style={styles.postLocation}>{post.location}</Text>
              )}
            </View>
          </Pressable>
          <Pressable onPress={() => handleOptions(post)} hitSlop={12}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => handleDoubleTap(post)}
          delayLongPress={200}
        >
          <Image source={post.image} style={styles.postImage} />
        </Pressable>

        <View style={styles.postActions}>
          <View style={styles.postActionsLeft}>
            <Pressable onPress={() => handleLike(post.id)} hitSlop={8}>
              <Ionicons
                name={post.liked ? 'heart' : 'heart-outline'}
                size={26}
                color={post.liked ? '#ED4956' : colors.text}
              />
            </Pressable>
            <Pressable onPress={() => handleComment(post)} hitSlop={8}>
              <Ionicons name="chatbubble-outline" size={24} color={colors.text} />
            </Pressable>
            <Pressable onPress={() => handleShare(post)} hitSlop={8}>
              <Ionicons name="paper-plane-outline" size={24} color={colors.text} />
            </Pressable>
          </View>
          <Pressable onPress={() => handleSave(post.id)} hitSlop={8}>
            <Ionicons
              name={post.saved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={colors.text}
            />
          </Pressable>
        </View>

        {!post.hideLikes && (
          <Text style={styles.postLikes}>
            {post.likes.toLocaleString()} curtidas
          </Text>
        )}

        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionText}>
              <Text style={styles.captionUsername}>{post.username}</Text>{' '}
              {post.caption}
            </Text>
          </View>
        )}

        {post.comments > 0 && (
          <Pressable onPress={() => handleComment(post)}>
            <Text style={styles.viewComments}>
              Ver todos os {post.comments} comentarios
            </Text>
          </Pressable>
        )}

        <Text style={styles.postTime}>{formatTimeAgo(post.createdAt)}</Text>
      </View>
    ),
    [
      handleUserPress,
      handleOptions,
      handleDoubleTap,
      handleLike,
      handleComment,
      handleShare,
      handleSave,
    ]
  );

  if (userPosts.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Publicacao</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Publicacao nao encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Publicacoes</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: width + 200,
          offset: (width + 200) * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
            });
          }, 100);
        }}
      />

      <CommentsSheet
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.muted,
  },
  postContainer: {
    backgroundColor: colors.background,
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  postLocation: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 1,
  },
  postImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  postActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  postLikes: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  captionContainer: {
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  captionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: '600',
  },
  viewComments: {
    fontSize: 14,
    color: colors.muted,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  postTime: {
    fontSize: 12,
    color: colors.muted,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
