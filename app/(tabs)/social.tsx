import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
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
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';
import CommentsSheet from '../post/CommentsSheet';
import CreateContentSheet from '../post/CreateContentSheet';
import PostActionsSheet from '../post/PostActionsSheet';
import StoryViewer from '../post/StoryViewer';

const { width } = Dimensions.get('window');

type Story = {
  id: string;
  user: string;
  avatar: string;
  images: any[];
  seen: boolean;
};

type Post = {
  id: string;
  userId: string;
  user: string;
  location: string;
  avatar: string;
  image: any;
  caption: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  time: string;
};

const STORIES: Story[] = [
  {
    id: 's1',
    user: 'Seu story',
    avatar: 'https://i.pravatar.cc/100?img=12',
    images: [require('../../assets/images/praia1.jpg')],
    seen: false,
  },
  {
    id: 's2',
    user: 'Ana Souza',
    avatar: 'https://i.pravatar.cc/100?img=1',
    images: [
      require('../../assets/images/praia2.jpg'),
      require('../../assets/images/praia3.jpg'),
    ],
    seen: false,
  },
  {
    id: 's3',
    user: 'Lucas',
    avatar: 'https://i.pravatar.cc/100?img=3',
    images: [require('../../assets/images/praia1.jpg')],
    seen: false,
  },
  {
    id: 's4',
    user: 'Mariana',
    avatar: 'https://i.pravatar.cc/100?img=5',
    images: [
      require('../../assets/images/praia3.jpg'),
      require('../../assets/images/praia2.jpg'),
    ],
    seen: false,
  },
  {
    id: 's5',
    user: 'Pedro',
    avatar: 'https://i.pravatar.cc/100?img=7',
    images: [require('../../assets/images/praia1.jpg')],
    seen: false,
  },
  {
    id: 's6',
    user: 'Julia',
    avatar: 'https://i.pravatar.cc/100?img=9',
    images: [require('../../assets/images/praia2.jpg')],
    seen: true,
  },
];

const POSTS: Post[] = [
  {
    id: '1',
    userId: 'user-1',
    user: 'Juliana Santos',
    location: 'Praia do Felix, Ubatuba',
    avatar: 'https://i.pravatar.cc/100?img=12',
    image: require('../../assets/images/praia1.jpg'),
    caption:
      'Passei um dia incrivel na Praia do Felix! A água e cristalina demais',
    likes: 142,
    comments: 18,
    liked: false,
    saved: false,
    time: '2h',
  },
  {
    id: '2',
    userId: 'user-2',
    user: 'Lucas Oliveira',
    location: 'Ilha Anchieta, Ubatuba',
    avatar: 'https://i.pravatar.cc/100?img=3',
    image: require('../../assets/images/praia2.jpg'),
    caption: 'Mergulho na Ilha Anchieta. Visibilidade perfeita hoje!',
    likes: 89,
    comments: 12,
    liked: false,
    saved: false,
    time: '4h',
  },
  {
    id: '3',
    userId: 'user-3',
    user: 'Mariana Lima',
    location: 'Praia da Almada, Ubatuba',
    avatar: 'https://i.pravatar.cc/100?img=5',
    image: require('../../assets/images/praia3.jpg'),
    caption: 'Almoço pé-na-areia com peixe fresco do dia. Não tem preço!',
    likes: 234,
    comments: 31,
    liked: false,
    saved: false,
    time: '6h',
  },
  {
    id: '4',
    userId: 'user-4',
    user: 'Pedro Santos',
    location: 'Ubatuba, SP',
    avatar: 'https://i.pravatar.cc/100?img=7',
    image: require('../../assets/images/praia1.jpg'),
    caption: 'Surf no final da tarde. Ondas perfeitas hoje no Felix!',
    likes: 67,
    comments: 5,
    liked: false,
    saved: false,
    time: '8h',
  },
  {
    id: '5',
    userId: 'user-5',
    user: 'Julia Costa',
    location: 'Ilha Anchieta, Ubatuba',
    avatar: 'https://i.pravatar.cc/100?img=9',
    image: require('../../assets/images/praia2.jpg'),
    caption: 'Trilha do presidio com vista incrivel. Vale cada passo!',
    likes: 178,
    comments: 22,
    liked: false,
    saved: false,
    time: '1d',
  },
];

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
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [stories, setStories] = useState<Story[]>(STORIES);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPostForActions, setSelectedPostForActions] =
    useState<Post | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [createSheetVisible, setCreateSheetVisible] = useState(false);
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
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id && !p.liked
            ? { ...p, liked: true, likes: p.likes + 1 }
            : p,
        ),
      );
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
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  }

  function toggleSave(id: string) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)),
    );
  }

  const handleStoryPress = useCallback((index: number) => {
    setStories((prev) =>
      prev.map((s, i) => (i === index ? { ...s, seen: true } : s)),
    );
    setActiveStoryIndex(index);
  }, []);

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

    setSelectedPostForActions(null);

    Alert.alert(
      'Editar publicação',
      'Funcionalidade de edição será implementada em breve.',
      [{ text: 'OK' }],
    );
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
            setPosts((prev) => prev.filter((p) => p.id !== postId));
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
      location: 'Ubatuba, SP',
      avatar: currentUser.avatar,
      image: image,
      caption: caption,
      likes: 0,
      comments: 0,
      liked: false,
      saved: false,
      time: 'agora',
    };

    setPosts((prev) => [newPost, ...prev]);
    setCreateSheetVisible(false);

    Alert.alert('Sucesso', 'Sua publicação foi criada!');
  }

  function handleCreateStory(image: any) {
    const newStory: Story = {
      id: Date.now().toString(),
      user: currentUser.name,
      avatar: currentUser.avatar,
      images: [image],
      seen: false,
    };

    setStories((prev) => [newStory, ...prev]);
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

    return (
      <View style={styles.post}>
        <View style={styles.postHeader}>
          <Pressable style={styles.postHeaderLeft}>
            <Image source={{ uri: item.avatar }} style={styles.postAvatar} />
            <View>
              <Text style={styles.postUser}>{item.user}</Text>
              <Text style={styles.postLocation}>{item.location}</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => handlePostMenuPress(item)}>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={colors.text}
            />
          </Pressable>
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
            <Pressable>
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

        <Text style={styles.postLikes}>{item.likes} curtidas</Text>

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
          <Pressable onPress={() => setCreateSheetVisible(true)}>
            <Ionicons name="add-circle-outline" size={24} color={colors.text} />
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
