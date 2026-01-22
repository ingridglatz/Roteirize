import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { colors } from '../../theme/colors';
import CommentsSheet from './CommentsSheet';

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
};

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: 'Ana Souza',
      location: 'Ubatuba, Brasil',
      avatar: 'https://i.pravatar.cc/100?img=1',
      image: require('../../assets/images/praia1.jpg'),
      caption: 'Passei um dia incrível na Praia do Félix 🌊',
      likes: 42,
      comments: 8,
      liked: false,
      saved: false,
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  function toggleLike(id: string) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
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

  function renderPost({ item }: { item: Post }) {
    return (
      <View style={styles.post}>
        <View style={styles.header}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{item.user}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>

        <Image source={item.image} style={styles.image} />

        <View style={styles.actions}>
          <View style={styles.leftActions}>
            <Pressable onPress={() => toggleLike(item.id)}>
              <Ionicons
                name={item.liked ? 'heart' : 'heart-outline'}
                size={26}
                color={item.liked ? '#E53935' : '#000'}
              />
            </Pressable>

            <Pressable onPress={() => setSelectedPost(item)}>
              <Ionicons name="chatbubble-outline" size={24} />
            </Pressable>
          </View>

          <Pressable onPress={() => toggleSave(item.id)}>
            <Ionicons
              name={item.saved ? 'bookmark' : 'bookmark-outline'}
              size={24}
            />
          </Pressable>
        </View>

        <Text style={styles.likes}>{item.likes} curtidas</Text>

        <Text style={styles.caption}>
          <Text style={styles.username}>{item.user} </Text>
          {item.caption}
        </Text>

        <Pressable onPress={() => setSelectedPost(item)}>
          <Text style={styles.comments}>
            Ver todos os {item.comments} comentários
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
      />

      <CommentsSheet
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  post: {
    marginBottom: 32,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },

  username: {
    fontWeight: '600',
    fontSize: 14,
  },

  location: {
    fontSize: 12,
    color: colors.muted,
  },

  image: {
    width: '100%',
    height: 380,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  leftActions: {
    flexDirection: 'row',
    gap: 14,
  },

  likes: {
    fontWeight: '600',
    paddingHorizontal: 12,
    marginBottom: 4,
  },

  caption: {
    paddingHorizontal: 12,
    fontSize: 14,
  },

  comments: {
    paddingHorizontal: 12,
    marginTop: 4,
    fontSize: 13,
    color: colors.muted,
  },
});
