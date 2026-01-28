import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
  Animated as RNAnimated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useCallback } from 'react';
import { colors } from '../../theme/colors';
import CommentsSheet from './CommentsSheet';

const { width } = Dimensions.get('window');

type Post = {
  id: string;
  user: string;
  location: string;
  avatar: string;
  image: any;
  caption: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  timeAgo: string;
};

type Story = {
  id: string;
  user: string;
  avatar: string;
  seen: boolean;
};

const STORIES: Story[] = [
  { id: 'you', user: 'Seu story', avatar: 'https://i.pravatar.cc/100?img=12', seen: false },
  { id: '1', user: 'ana_souza', avatar: 'https://i.pravatar.cc/100?img=1', seen: false },
  { id: '2', user: 'lucas.oli', avatar: 'https://i.pravatar.cc/100?img=3', seen: false },
  { id: '3', user: 'mari_trip', avatar: 'https://i.pravatar.cc/100?img=5', seen: true },
  { id: '4', user: 'pedro.v', avatar: 'https://i.pravatar.cc/100?img=8', seen: false },
  { id: '5', user: 'julia_m', avatar: 'https://i.pravatar.cc/100?img=9', seen: true },
  { id: '6', user: 'rafaela', avatar: 'https://i.pravatar.cc/100?img=10', seen: true },
];

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    user: 'Ana Souza',
    location: 'Ubatuba, Brasil',
    avatar: 'https://i.pravatar.cc/100?img=1',
    image: require('../../assets/images/praia1.jpg'),
    caption: 'Passei um dia incrivel na Praia do Felix! A agua estava cristalina e o por do sol foi de tirar o folego.',
    likes: 142,
    comments: 18,
    liked: false,
    saved: false,
    timeAgo: '2h',
  },
  {
    id: '2',
    user: 'Lucas Oliveira',
    location: 'Santorini, Grecia',
    avatar: 'https://i.pravatar.cc/100?img=3',
    image: require('../../assets/images/santorini.jpg'),
    caption: 'Santorini e simplesmente magica. Cada esquina e uma foto perfeita!',
    likes: 284,
    comments: 32,
    liked: false,
    saved: false,
    timeAgo: '4h',
  },
  {
    id: '3',
    user: 'Mariana Costa',
    location: 'Bali, Indonesia',
    avatar: 'https://i.pravatar.cc/100?img=5',
    image: require('../../assets/images/bali.jpg'),
    caption: 'Templos incriveis, cultura rica e paisagens de outro mundo. Bali superou todas as expectativas.',
    likes: 531,
    comments: 47,
    liked: false,
    saved: false,
    timeAgo: '6h',
  },
  {
    id: '4',
    user: 'Pedro Vieira',
    location: 'Ilhabela, Brasil',
    avatar: 'https://i.pravatar.cc/100?img=8',
    image: require('../../assets/images/ilhabela.jpg'),
    caption: 'Trilha ate a Praia de Castelhanos concluida! Valeu cada minuto de caminhada.',
    likes: 89,
    comments: 11,
    liked: false,
    saved: false,
    timeAgo: '8h',
  },
  {
    id: '5',
    user: 'Julia Mendes',
    location: 'Paraty, Brasil',
    avatar: 'https://i.pravatar.cc/100?img=9',
    image: require('../../assets/images/paraty.jpg'),
    caption: 'As ruas de Paraty tem aquele charme unico. Centro historico lindo demais!',
    likes: 203,
    comments: 24,
    liked: false,
    saved: false,
    timeAgo: '10h',
  },
  {
    id: '6',
    user: 'Rafaela Lima',
    location: 'Ibiza, Espanha',
    avatar: 'https://i.pravatar.cc/100?img=10',
    image: require('../../assets/images/ibiza.jpg'),
    caption: 'Ibiza nao e so festa. As praias e calas sao de um azul impressionante!',
    likes: 378,
    comments: 41,
    liked: false,
    saved: false,
    timeAgo: '12h',
  },
  {
    id: '7',
    user: 'Carlos Santos',
    location: 'Fernando de Noronha, Brasil',
    avatar: 'https://i.pravatar.cc/100?img=11',
    image: require('../../assets/images/noronha.jpg'),
    caption: 'O paraiso existe e se chama Noronha. Mergulho com tartarugas hoje!',
    likes: 712,
    comments: 63,
    liked: false,
    saved: false,
    timeAgo: '1d',
  },
  {
    id: '8',
    user: 'Ana Souza',
    location: 'Arraial do Cabo, Brasil',
    avatar: 'https://i.pravatar.cc/100?img=1',
    image: require('../../assets/images/arraial.jpg'),
    caption: 'O Caribe brasileiro nao decepciona! Agua azul turquesa inacreditavel.',
    likes: 456,
    comments: 38,
    liked: false,
    saved: false,
    timeAgo: '1d',
  },
];

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const heartAnims = useRef<Record<string, RNAnimated.Value>>({});

  function getHeartAnim(id: string) {
    if (!heartAnims.current[id]) {
      heartAnims.current[id] = new RNAnimated.Value(0);
    }
    return heartAnims.current[id];
  }

  function doubleTapLike(id: string) {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    if (!post.liked) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, liked: true, likes: p.likes + 1 } : p,
        ),
      );
    }

    const anim = getHeartAnim(id);
    anim.setValue(0);
    RNAnimated.sequence([
      RNAnimated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }),
      RNAnimated.delay(600),
      RNAnimated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }

  const lastTap = useRef<Record<string, number>>({});

  function handleImagePress(id: string) {
    const now = Date.now();
    const last = lastTap.current[id] || 0;
    if (now - last < 300) {
      doubleTapLike(id);
    }
    lastTap.current[id] = now;
  }

  function toggleLike(id: string) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    );
  }

  function toggleSave(id: string) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, saved: !post.saved } : post,
      ),
    );
  }

  const renderStory = useCallback(({ item }: { item: Story }) => {
    const isYou = item.id === 'you';
    return (
      <Pressable style={styles.storyItem}>
        <View style={[styles.storyRing, item.seen && styles.storyRingSeen]}>
          <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
          {isYou && (
            <View style={styles.storyAddBadge}>
              <Ionicons name="add" size={14} color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.storyName} numberOfLines={1}>
          {item.user}
        </Text>
      </Pressable>
    );
  }, []);

  function renderPost({ item }: { item: Post }) {
    const heartAnim = getHeartAnim(item.id);
    const heartScale = heartAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1.3] });
    const heartOpacity = heartAnim;

    return (
      <View style={styles.post}>
        {/* Header */}
        <View style={styles.postHeader}>
          <View style={styles.postHeaderLeft}>
            <View style={styles.postAvatarRing}>
              <Image source={{ uri: item.avatar }} style={styles.postAvatar} />
            </View>
            <View>
              <Text style={styles.postUsername}>{item.user}</Text>
              <Text style={styles.postLocation}>{item.location}</Text>
            </View>
          </View>
          <Pressable hitSlop={12}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
          </Pressable>
        </View>

        {/* Image with double-tap */}
        <Pressable onPress={() => handleImagePress(item.id)}>
          <Image source={item.image} style={styles.postImage} />
          <RNAnimated.View
            style={[
              styles.doubleTapHeart,
              { transform: [{ scale: heartScale }], opacity: heartOpacity },
            ]}
            pointerEvents="none"
          >
            <Ionicons name="heart" size={80} color="#fff" />
          </RNAnimated.View>
        </Pressable>

        {/* Actions */}
        <View style={styles.postActions}>
          <View style={styles.postActionsLeft}>
            <Pressable onPress={() => toggleLike(item.id)} hitSlop={8}>
              <Ionicons
                name={item.liked ? 'heart' : 'heart-outline'}
                size={26}
                color={item.liked ? '#E53935' : colors.text}
              />
            </Pressable>
            <Pressable onPress={() => setSelectedPost(item)} hitSlop={8}>
              <Ionicons name="chatbubble-outline" size={24} color={colors.text} />
            </Pressable>
            <Pressable hitSlop={8}>
              <Ionicons name="paper-plane-outline" size={24} color={colors.text} />
            </Pressable>
          </View>
          <Pressable onPress={() => toggleSave(item.id)} hitSlop={8}>
            <Ionicons
              name={item.saved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={colors.text}
            />
          </Pressable>
        </View>

        {/* Likes */}
        <Text style={styles.postLikes}>
          {item.likes.toLocaleString('pt-BR')} curtidas
        </Text>

        {/* Caption */}
        <Text style={styles.postCaption} numberOfLines={3}>
          <Text style={styles.postCaptionUser}>{item.user} </Text>
          {item.caption}
        </Text>

        {/* Comments link */}
        <Pressable onPress={() => setSelectedPost(item)}>
          <Text style={styles.postCommentsLink}>
            Ver todos os {item.comments} comentarios
          </Text>
        </Pressable>

        {/* Time */}
        <Text style={styles.postTime}>{item.timeAgo}</Text>
      </View>
    );
  }

  const ListHeader = useCallback(
    () => (
      <View>
        {/* App bar */}
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Roteirize</Text>
          <View style={styles.appBarActions}>
            <Pressable hitSlop={8}>
              <Ionicons name="heart-outline" size={26} color={colors.text} />
            </Pressable>
            <Pressable hitSlop={8}>
              <Ionicons name="paper-plane-outline" size={26} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Stories */}
        <FlatList
          data={STORIES}
          keyExtractor={(s) => s.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContainer}
          renderItem={renderStory}
        />

        <View style={styles.storiesDivider} />
      </View>
    ),
    [renderStory],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <CommentsSheet post={selectedPost} onClose={() => setSelectedPost(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // App bar
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  appBarTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  appBarActions: {
    flexDirection: 'row',
    gap: 20,
  },

  // Stories
  storiesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 14,
  },
  storyItem: {
    alignItems: 'center',
    width: 72,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  storyRingSeen: {
    borderColor: colors.disabled,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyAddBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyName: {
    fontSize: 11,
    color: colors.text,
    textAlign: 'center',
  },
  storiesDivider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Post card
  post: {
    marginBottom: 8,
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
  },
  postAvatarRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  postUsername: {
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

  // Actions
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
  },
  postActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  // Likes
  postLikes: {
    fontWeight: '700',
    fontSize: 14,
    paddingHorizontal: 14,
    marginBottom: 4,
    color: colors.text,
  },

  // Caption
  postCaption: {
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  postCaptionUser: {
    fontWeight: '700',
  },

  // Comments link
  postCommentsLink: {
    paddingHorizontal: 14,
    marginTop: 4,
    fontSize: 13,
    color: colors.muted,
  },

  // Time
  postTime: {
    paddingHorizontal: 14,
    marginTop: 4,
    marginBottom: 4,
    fontSize: 11,
    color: colors.muted,
    textTransform: 'uppercase',
  },
});
