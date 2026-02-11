import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PLACES_DATA, type Place } from '../../data/places';
import { getColors } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const DESTINATION_IMAGE = require('../../assets/images/ubatuba.jpg');
const DESTINATION_NAME = 'Ubatuba';

function HighlightCard({
  item,
  onPress,
  styles,
}: {
  item: Place;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardGradient} />
      <View style={styles.cardOverlay}>
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>{item.category}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="star" size={12} color="#FFC107" />
          <Text style={styles.cardRating}>{item.rating}</Text>
          <Text style={styles.cardDifficulty}>{item.difficulty}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function Explorar() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const destination = useMemo(
    () => ({
      name: DESTINATION_NAME,
      fullName: t('tabs.explorar.destinationFullName'),
      tagline: t('tabs.explorar.destinationTagline'),
      description: t('tabs.explorar.destinationDescription'),
      whyVisit: [
        {
          icon: 'leaf-outline',
          title: t('tabs.explorar.whyNatureTitle'),
          text: t('tabs.explorar.whyNatureText'),
        },
        {
          icon: 'restaurant-outline',
          title: t('tabs.explorar.whyGastronomyTitle'),
          text: t('tabs.explorar.whyGastronomyText'),
        },
        {
          icon: 'compass-outline',
          title: t('tabs.explorar.whyAdventureTitle'),
          text: t('tabs.explorar.whyAdventureText'),
        },
      ],
      curiosities: [
        { emoji: '🏖️', text: t('tabs.explorar.curiosityBeaches') },
        { emoji: '🐢', text: t('tabs.explorar.curiosityTamar') },
        { emoji: '🌧️', text: t('tabs.explorar.curiosityRain') },
      ],
      image: DESTINATION_IMAGE,
    }),
    [t],
  );

  const notifications = useMemo(
    () => [
      {
        id: '1',
        type: 'trip',
        title: t('tabs.explorar.notifTripTitle'),
        message: t('tabs.explorar.notifTripMessage'),
        time: t('common.timeAgo', { time: '2h' }),
        read: false,
        icon: 'checkmark-circle',
      },
      {
        id: '2',
        type: 'recommendation',
        title: t('tabs.explorar.notifRecommendTitle'),
        message: t('tabs.explorar.notifRecommendMessage'),
        time: t('common.timeAgo', { time: '5h' }),
        read: false,
        icon: 'sparkles',
      },
      {
        id: '3',
        type: 'reminder',
        title: t('tabs.explorar.notifReminderTitle'),
        message: t('tabs.explorar.notifReminderMessage'),
        time: t('common.timeAgo', { time: '1d' }),
        read: true,
        icon: 'calendar',
      },
      {
        id: '4',
        type: 'update',
        title: t('tabs.explorar.notifWeatherTitle'),
        message: t('tabs.explorar.notifWeatherMessage'),
        time: t('common.timeAgo', { time: '2d' }),
        read: true,
        icon: 'sunny',
      },
    ],
    [t],
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleHighlightPress = useCallback(
    (slug: string) => {
      router.push(`/place/${slug}`);
    },
    [router],
  );

  const handleCreateTrip = useCallback(() => {
    router.push('/(tabs)/create?destination=ubatuba');
  }, [router]);

  const toggleNotifications = useCallback(() => {
    setNotificationsVisible((prev) => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Modal
        visible={notificationsVisible}
        animationType="slide"
        transparent
        onRequestClose={toggleNotifications}
      >
        <Pressable style={styles.modalOverlay} onPress={toggleNotifications}>
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('tabs.explorar.notifications')}</Text>
              <Pressable onPress={toggleNotifications}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.notificationsList}>
              {notifications.map((notification) => (
                <Pressable
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.read && styles.notificationUnread,
                  ]}
                >
                  <View
                    style={[
                      styles.notificationIconContainer,
                      !notification.read && styles.notificationIconUnread,
                    ]}
                  >
                    <Ionicons
                      name={notification.icon as any}
                      size={20}
                      color={!notification.read ? colors.primary : colors.muted}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {notification.time}
                    </Text>
                  </View>
                  {!notification.read && <View style={styles.unreadDot} />}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('tabs.explorar.title')}</Text>
          <Pressable
            onPress={toggleNotifications}
            style={styles.notificationButton}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('tabs.explorar.searchPlaceholder')}
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.heroContainer}>
          <Image source={destination.image} style={styles.hero} />
          <View style={styles.heroGradient} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTagline}>{destination.tagline}</Text>
            <Text style={styles.heroTitle}>{destination.fullName}</Text>
            <Text style={styles.heroDesc}>{destination.description}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('tabs.explorar.highlights')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          {PLACES_DATA.map((item) => (
            <HighlightCard
              key={item.slug}
              item={item}
              onPress={() => handleHighlightPress(item.slug)}
              styles={styles}
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>{t('tabs.explorar.didYouKnow')}</Text>
        <View style={styles.sectionContent}>
          {destination.curiosities.map((item, idx) => (
            <View key={idx} style={styles.curiosityRow}>
              <Text style={styles.curiosityEmoji}>{item.emoji}</Text>
              <Text style={styles.curiosityText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('tabs.explorar.whatToDo')}</Text>
        <View style={styles.sectionContent}>
          {PLACES_DATA.map((place) => (
            <Pressable
              key={place.slug}
              style={styles.activityCard}
              onPress={() => handleHighlightPress(place.slug)}
            >
              <Image source={place.image} style={styles.activityImage} />
              <View style={styles.activityBody}>
                <Text style={styles.activityTitle}>{place.title}</Text>
                <Text style={styles.activitySub} numberOfLines={2}>
                  {place.activities.map((a) => a.title).join(' · ')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('tabs.explorar.whyVisit')}</Text>
        <View style={styles.sectionContent}>
          {destination.whyVisit.map((item, idx) => (
            <View key={idx} style={styles.reasonCard}>
              <View style={styles.reasonIconCircle}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.reasonBody}>
                <Text style={styles.reasonTitle}>{item.title}</Text>
                <Text style={styles.reasonText}>{item.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.ctaButton} onPress={handleCreateTrip}>
          <Ionicons name="sparkles" size={18} color="#fff" />
          <Text style={styles.ctaText}>
            {t('tabs.explorar.createItinerary', { destination: destination.name })}
          </Text>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
  container: {
    paddingBottom: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },

  heroContainer: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 8,
  },
  hero: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTagline: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
  heroDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 24,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionContent: {
    paddingHorizontal: 24,
  },

  carousel: {
    paddingLeft: 24,
    paddingRight: 8,
  },
  card: {
    width: width * 0.55,
    height: 180,
    borderRadius: 18,
    marginRight: 14,
    overflow: 'hidden',
    backgroundColor: colors.card,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 12,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  cardBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  cardRating: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
    marginRight: 8,
  },
  cardDifficulty: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },

  curiosityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  curiosityEmoji: {
    fontSize: 20,
    marginTop: 1,
  },
  curiosityText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    flex: 1,
  },

  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    marginBottom: 10,
  },
  activityImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  activityBody: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  activitySub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    lineHeight: 17,
  },

  reasonCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    gap: 14,
  },
  reasonIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  reasonBody: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },

  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 24,
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  bottomSpacer: {
    height: 90,
  },

  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },

  notificationsList: {
    paddingHorizontal: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  notificationUnread: {
    backgroundColor: colors.surface,
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIconUnread: {
    backgroundColor: colors.surface,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.muted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
});
}
