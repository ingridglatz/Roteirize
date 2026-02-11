import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationItem from '../../components/social/NotificationItem';
import { useNotifications } from '../../context/NotificationContext';
import { getColors } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { Notification } from '../../types/Social';

type FilterType = 'all' | 'likes' | 'comments' | 'follows';

export default function Notifications() {
  const router = useRouter();
  const { t } = useTranslation();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);
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
      router.push(`/post/${notification.postId}` as any);
    } else if (notification.type === 'follow') {
      router.push(`/profile/${notification.fromUserId}` as any);
    } else if (notification.storyId) {
      // Navega para o perfil do usuário que criou o story
      router.push(`/profile/${notification.fromUserId}` as any);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.push('/(tabs)/social')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>{t('tabs.notifications.title')}</Text>
        </View>
        {notifications.some((n) => !n.read) && (
          <Pressable onPress={markAllAsRead} style={styles.markAllButton}>
            <Ionicons name="checkmark-done" size={22} color={colors.primary} />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        style={styles.filtersScrollView}
      >
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
            {t('tabs.notifications.all')}
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
            {t('tabs.notifications.likes')}
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
            {t('tabs.notifications.comments')}
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
            {t('tabs.notifications.follows')}
          </Text>
        </Pressable>
      </ScrollView>

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
            <Ionicons name="notifications-off-outline" size={64} color={colors.muted} />
            <Text style={styles.emptyText}>{t('tabs.notifications.empty')}</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
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
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      marginRight: 12,
      padding: 4,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
    },
    markAllButton: {
      padding: 6,
      marginLeft: 8,
    },
    filtersScrollView: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexGrow: 0,
    },
    filtersContainer: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 10,
    },
    filter: {
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    filterActive: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    filterText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    filterTextActive: {
      color: colors.primary,
    },
    listContent: {
      flexGrow: 1,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 70,
    },
    empty: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 80,
      gap: 16,
    },
    emptyText: {
      fontSize: 16,
      color: colors.muted,
      fontWeight: '500',
    },
  });
}
