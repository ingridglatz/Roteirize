import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShareItinerarySheet from '../../components/itinerary/ShareItinerarySheet';
import { useTheme } from '../../context/ThemeContext';
import { getColors } from '../../theme/colors';
import { Itinerary } from '../../types/Itinerary';

function getMockItinerary(t: (key: string) => string): Itinerary {
  return {
    id: '1',
    title: t('mockData.itineraryTitle'),
    destinationId: 'ubatuba',
    destinationName: 'Ubatuba, SP',
    days: 3,
    budget: 'moderate',
    interests: ['beach', 'nature'],
    createdAt: t('mockData.itineraryDate'),
    dailyPlan: [
      {
        day: 1,
        title: t('mockData.day1Title'),
        activities: [
          t('mockData.day1Act1'),
          t('mockData.day1Act2'),
          t('mockData.day1Act3'),
          t('mockData.day1Act4'),
        ],
        places: [
          t('mockData.day1Place1'),
          t('mockData.day1Place2'),
          t('mockData.day1Place3'),
          t('mockData.day1Place4'),
        ],
      },
      {
        day: 2,
        title: t('mockData.day2Title'),
        activities: [
          t('mockData.day2Act1'),
          t('mockData.day2Act2'),
          t('mockData.day2Act3'),
          t('mockData.day2Act4'),
          t('mockData.day2Act5'),
        ],
        places: [
          t('mockData.day2Place1'),
          t('mockData.day2Place2'),
          t('mockData.day2Place3'),
          t('mockData.day2Place4'),
        ],
      },
      {
        day: 3,
        title: t('mockData.day3Title'),
        activities: [
          t('mockData.day3Act1'),
          t('mockData.day3Act2'),
          t('mockData.day3Act3'),
          t('mockData.day3Act4'),
        ],
        places: [t('mockData.day3Place1'), t('mockData.day3Place2'), t('mockData.day3Place3')],
      },
    ],
    restaurants: [
      {
        id: '1',
        name: 'Peixe na Telha',
        category: t('mockData.rest1Category'),
        priceLevel: '$$',
        location: 'Centro',
      },
      {
        id: '2',
        name: 'Restaurante do Celo',
        category: t('mockData.rest2Category'),
        priceLevel: '$',
        location: 'Praia Grande',
      },
      {
        id: '3',
        name: 'Vila Picinguaba',
        category: t('mockData.rest3Category'),
        priceLevel: '$$$',
        location: 'Picinguaba',
      },
    ],
    checklist: [
      { id: '1', text: t('mockData.checklist1'), done: true },
      { id: '2', text: t('mockData.checklist2'), done: true },
      { id: '3', text: t('mockData.checklist3'), done: false },
      { id: '4', text: t('mockData.checklist4'), done: false },
      { id: '5', text: t('mockData.checklist5'), done: false },
    ],
  };
}

const MOCK_IMAGE = require('../../assets/images/ubatuba.jpg');

export default function ItineraryDetail() {
  const router = useRouter();
  const { t } = useTranslation();
  useLocalSearchParams();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const itinerary = useMemo(() => getMockItinerary(t), [t]);

  return (
    <SafeAreaView style={styles.safe}>
      <View>
        <Image source={MOCK_IMAGE} style={styles.hero} />
        <View style={styles.heroOverlay} />
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Pressable
          style={styles.shareButton}
          onPress={() => setShowShareSheet(true)}
        >
          <Ionicons name="share-outline" size={22} color="#fff" />
        </Pressable>
        <View style={styles.heroContent}>
          <View style={styles.daysBadge}>
            <Text style={styles.daysBadgeText}>{itinerary.days} {t('common.days')}</Text>
          </View>
          <Text style={styles.heroTitle}>{itinerary.title}</Text>
          <View style={styles.heroMeta}>
            <Ionicons
              name="location-outline"
              size={14}
              color="rgba(255,255,255,0.8)"
            />
            <Text style={styles.heroMetaText}>
              {itinerary.destinationName}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="wallet-outline" size={18} color={colors.primary} />
            <Text style={styles.infoText}>{t(`onboarding.travelStyle.${itinerary.budget}`)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.infoText}>{itinerary.createdAt}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('itinerary.dailyPlan')}</Text>
        {itinerary.dailyPlan.map((day) => (
          <View key={day.day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>{t('itinerary.day', { number: day.day })}</Text>
              </View>
              <Text style={styles.dayTitle}>{day.title}</Text>
            </View>
            {day.activities.map((activity, idx) => (
              <View key={idx} style={styles.activityRow}>
                <View style={styles.activityDot} />
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>{t('itinerary.suggestedRestaurants')}</Text>
        <View style={styles.restaurantsContainer}>
          {itinerary.restaurants.map((r, idx) => (
            <View key={idx} style={styles.restaurantCard}>
              <View style={styles.restaurantIcon}>
                <Ionicons
                  name="restaurant-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.restaurantBody}>
                <Text style={styles.restaurantName}>{r.name}</Text>
                <Text style={styles.restaurantCategory}>{r.category}</Text>
              </View>
              <Text style={styles.restaurantPrice}>{r.priceLevel}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('itinerary.checklist')}</Text>
        <View style={styles.checklistContainer}>
          {itinerary.checklist.map((item, idx) => (
            <View key={idx} style={styles.checklistItem}>
              <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
                {item.done && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text
                style={[
                  styles.checklistText,
                  item.done && styles.checklistTextDone,
                ]}
              >
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <ShareItinerarySheet
        itinerary={showShareSheet ? itinerary : null}
        onClose={() => setShowShareSheet(false)}
        onShareToChat={() => {
          // TODO: Implementar navegação para chat interno
          console.log('Compartilhar no chat');
        }}
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
  hero: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: 220,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  daysBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  daysBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroMetaText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
    marginTop: 8,
  },
  dayCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  dayBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  activityText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  restaurantsContainer: {
    gap: 10,
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  restaurantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantBody: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  restaurantCategory: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  restaurantPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  checklistContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checklistText: {
    fontSize: 14,
    color: colors.text,
  },
  checklistTextDone: {
    textDecorationLine: 'line-through',
    color: colors.muted,
  },
  });
}
