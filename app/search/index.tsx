import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FollowButton from '../../components/social/FollowButton';
import UserAvatar from '../../components/social/UserAvatar';
import { useSocial } from '../../context/SocialContext';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';

export default function SearchScreen() {
  const router = useRouter();
  const { searchUsers, getUser } = useSocial();
  const { currentUser } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchUsers(searchQuery).filter(
      (user) => user.id !== currentUser.id,
    );
  }, [searchQuery, searchUsers, currentUser.id]);

  function handleUserPress(userId: string) {
    setRecentSearches((prev) => {
      const filtered = prev.filter((id) => id !== userId);
      return [userId, ...filtered].slice(0, 10);
    });
    router.push(`/profile/${userId}` as any);
  }

  function clearRecentSearches() {
    setRecentSearches([]);
  }

  function removeRecentSearch(userId: string) {
    setRecentSearches((prev) => prev.filter((id) => id !== userId));
  }

  const recentUsers = useMemo(() => {
    return recentSearches
      .map((id) => getUser(id))
      .filter((user) => user !== undefined);
  }, [recentSearches, getUser]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color={colors.muted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuários"
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      {searchQuery.trim() ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.userRow}
              onPress={() => handleUserPress(item.id)}
            >
              <UserAvatar
                uri={item.avatar}
                size={48}
                verified={item.verified}
                onPress={() => handleUserPress(item.id)}
              />
              <View style={styles.userInfo}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName}>{item.name}</Text>
                  {item.verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color={colors.primary}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
                <Text style={styles.userUsername}>@{item.username}</Text>
                {item.bio && (
                  <Text style={styles.userBio} numberOfLines={1}>
                    {item.bio}
                  </Text>
                )}
              </View>
              <FollowButton userId={item.id} size="small" />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={colors.muted} />
              <Text style={styles.emptyTitle}>Nenhum resultado</Text>
              <Text style={styles.emptyText}>
                Tente buscar por outro nome ou usuário
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.recentContainer}>
          {recentUsers.length > 0 && (
            <>
              <View style={styles.recentHeader}>
                <Text style={styles.recentTitle}>Recentes</Text>
                <Pressable onPress={clearRecentSearches}>
                  <Text style={styles.clearText}>Limpar tudo</Text>
                </Pressable>
              </View>
              <FlatList
                data={recentUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.recentRow}>
                    <Pressable
                      style={styles.recentUserRow}
                      onPress={() => handleUserPress(item.id)}
                    >
                      <UserAvatar
                        uri={item.avatar}
                        size={44}
                        verified={item.verified}
                      />
                      <View style={styles.recentUserInfo}>
                        <View style={styles.userNameRow}>
                          <Text style={styles.userName}>{item.name}</Text>
                          {item.verified && (
                            <Ionicons
                              name="checkmark-circle"
                              size={14}
                              color={colors.primary}
                              style={{ marginLeft: 4 }}
                            />
                          )}
                        </View>
                        <Text style={styles.userUsername}>
                          @{item.username}
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => removeRecentSearch(item.id)}
                      hitSlop={8}
                    >
                      <Ionicons name="close" size={20} color={colors.muted} />
                    </Pressable>
                  </View>
                )}
              />
            </>
          )}

          {recentUsers.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color={colors.muted} />
              <Text style={styles.emptyTitle}>Buscar pessoas</Text>
              <Text style={styles.emptyText}>
                Encontre e siga pessoas para ver suas publicações
              </Text>
            </View>
          )}
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  list: {
    paddingVertical: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  userUsername: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  userBio: {
    fontSize: 13,
    color: colors.text,
    marginTop: 4,
  },
  recentContainer: {
    flex: 1,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  clearText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  recentUserRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentUserInfo: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 8,
    textAlign: 'center',
  },
});
