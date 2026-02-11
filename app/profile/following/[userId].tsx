import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import FollowButton from '../../../components/social/FollowButton';
import UserAvatar from '../../../components/social/UserAvatar';
import { useSocial } from '../../../context/SocialContext';
import { useTheme } from '../../../context/ThemeContext';
import { useUser } from '../../../context/UserContext';
import { getColors } from '../../../theme/colors';
import { SocialUser } from '../../../types/Social';

export default function FollowingScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { currentUser } = useUser();
  const { getUser } = useSocial();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [searchQuery, setSearchQuery] = useState('');

  const user = getUser(userId as string);

  const following = useMemo(() => {
    return [] as SocialUser[];
  }, []);

  const filteredFollowing = useMemo(() => {
    if (!searchQuery.trim()) return following;
    const query = searchQuery.toLowerCase();
    return following.filter(
      (followedUser: SocialUser) =>
        followedUser.name.toLowerCase().includes(query) ||
        followedUser.username.toLowerCase().includes(query),
    );
  }, [following, searchQuery]);

  function handleUserPress(id: string) {
    router.push(`/profile/${id}` as any);
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Usuário não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{user.username}</Text>
          <Text style={styles.headerSubtitle}>Seguindo</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

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
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={filteredFollowing}
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
            {item.id !== currentUser.id && (
              <FollowButton userId={item.id} size="small" />
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.muted} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Nenhum usuário encontrado' : 'Não segue ninguém'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Tente buscar por outro nome'
                : 'Quando este usuário seguir alguém, aparecerá aqui'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
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
    headerInfo: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 2,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 10,
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 8,
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
}
