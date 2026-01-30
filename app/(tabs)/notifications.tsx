import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationItem from '../../components/social/NotificationItem';
import { useNotifications } from '../../context/NotificationContext';
import { colors } from '../../theme/colors';
import { Notification } from '../../types/Social';

type FilterType = 'all' | 'likes' | 'comments' | 'follows';

export default function Notifications() {
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'likes')
      return notifications.filter((n) => n.type === 'like');
    if (activeFilter === 'comments')
      return notifications.filter(
        (n) => n.type === 'comment' || n.type === 'mention',
      );
    if (activeFilter === 'follows')
      return notifications.filter((n) => n.type === 'follow');
    return notifications;
  }, [notifications, activeFilter]);

  function handleNotificationPress(notification: Notification) {
    markAsRead(notification.id);

    if (notification.postId) {
      console.log('Navigate to post:', notification.postId);
    } else if (notification.type === 'follow') {
      router.push(`/profile/${notification.fromUserId}` as any);
    } else if (notification.storyId) {
      console.log('Navigate to story:', notification.storyId);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/(tabs)/social')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Notificações</Text>
        {notifications.some((n) => !n.read) && (
          <Pressable onPress={markAllAsRead}>
            <Text style={styles.markAllRead}>Marcar todas como lidas</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.filters}>
        <Pressable
          style={[styles.filter, activeFilter === 'all' && styles.filterActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'all' && styles.filterTextActive,
            ]}
          >
            Todas
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filter,
            activeFilter === 'likes' && styles.filterActive,
          ]}
          onPress={() => setActiveFilter('likes')}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'likes' && styles.filterTextActive,
            ]}
          >
            Curtidas
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filter,
            activeFilter === 'comments' && styles.filterActive,
          ]}
          onPress={() => setActiveFilter('comments')}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'comments' && styles.filterTextActive,
            ]}
          >
            Comentários
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filter,
            activeFilter === 'follows' && styles.filterActive,
          ]}
          onPress={() => setActiveFilter('follows')}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'follows' && styles.filterTextActive,
            ]}
          >
            Seguindo
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
          </View>
        }
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
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  markAllRead: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filter: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  filterActive: {
    backgroundColor: colors.text,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  filterTextActive: {
    color: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.muted,
  },
});
