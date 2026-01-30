import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSocial } from '../../context/SocialContext';
import { colors } from '../../theme/colors';

type Props = {
  postId: string;
};

export default function SharedPostPreview({ postId }: Props) {
  const { getPost, getUser } = useSocial();
  const post = getPost(postId);
  const user = post ? getUser(post.userId) : null;

  if (!post) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={24}
            color={colors.muted}
          />
          <Text style={styles.errorText}>Publicação não disponível</Text>
        </View>
      </View>
    );
  }

  function handlePress() {
    // Navigate to post detail (could be implemented later)
    // For now, just show an alert or do nothing
  }

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image source={post.image} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.username} numberOfLines={1}>
            {post.user}
          </Text>
          {user?.verified && (
            <Ionicons
              name="checkmark-circle"
              size={12}
              color={colors.primary}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
        <Text style={styles.caption} numberOfLines={2}>
          {post.caption}
        </Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={12} color={colors.muted} />
            <Text style={styles.statText}>{post.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={12} color={colors.muted} />
            <Text style={styles.statText}>{post.comments}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    maxWidth: 280,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  caption: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 16,
    marginBottom: 6,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    color: colors.muted,
  },
});
