import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSocial } from '../../context/SocialContext';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';
import FollowButton from './FollowButton';
import UserAvatar from './UserAvatar';

const { width } = Dimensions.get('window');

type Props = {
  postId: string | null;
  onClose: () => void;
  onUserPress?: (userId: string) => void;
};

export default function LikesListModal({
  postId,
  onClose,
  onUserPress,
}: Props) {
  const { currentUser } = useUser();
  const { getPostLikes } = useSocial();
  const [searchQuery, setSearchQuery] = useState('');

  if (!postId) return null;

  const likes = getPostLikes(postId);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredLikes = useMemo(() => {
    if (!searchQuery.trim()) return likes;
    const query = searchQuery.toLowerCase();
    return likes.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query),
    );
  }, [likes, searchQuery]);

  return (
    <Modal
      visible={!!postId}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Curtidas</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          {likes.length > 5 && (
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={18}
                color={colors.muted}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar"
                placeholderTextColor={colors.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.muted}
                  />
                </Pressable>
              )}
            </View>
          )}

          <FlatList
            data={filteredLikes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Pressable
                  style={styles.userInfo}
                  onPress={() => onUserPress?.(item.id)}
                >
                  <UserAvatar
                    uri={item.avatar}
                    size={44}
                    verified={item.verified}
                  />
                  <View style={styles.userDetails}>
                    <View style={styles.userNameRow}>
                      <Text style={styles.userName}>{item.username}</Text>
                      {item.verified && (
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color={colors.primary}
                          style={{ marginLeft: 4 }}
                        />
                      )}
                    </View>
                    <Text style={styles.userFullName}>{item.name}</Text>
                  </View>
                </Pressable>

                {item.id !== currentUser.id && (
                  <FollowButton userId={item.id} size="small" />
                )}
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? 'Nenhum resultado encontrado'
                    : 'Nenhuma curtida ainda'}
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: Math.min(width - 40, 400),
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  searchIcon: {
    marginLeft: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 6,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  userFullName: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
  },
});
