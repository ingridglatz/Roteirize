import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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

const MOCK_ITINERARY: Itinerary = {
  id: '1',
  title: 'Fim de semana em Ubatuba',
  destinationId: 'ubatuba',
  destinationName: 'Ubatuba, SP',
  days: 3,
  budget: 'Moderado',
  interests: ['praia', 'natureza'],
  createdAt: '15 de Janeiro, 2024',
  dailyPlan: [
    {
      day: 1,
      title: 'Chegada e relaxar',
      activities: [
        'Check-in no hotel',
        'Almoco no restaurante local',
        'Praia do Felix - banho de mar',
        'Jantar na orla',
      ],
      places: [
        'Check-in no hotel',
        'Almoco no restaurante local',
        'Praia do Felix',
        'Jantar na orla',
      ],
    },
    {
      day: 2,
      title: 'Aventura na ilha',
      activities: [
        'Passeio de barco ate a Ilha Anchieta',
        'Mergulho nas aguas cristalinas',
        'Almoco na ilha',
        'Trilha do presidio',
        'Retorno e jantar',
      ],
      places: [
        'Ilha Anchieta',
        'Mergulho',
        'Almoco na ilha',
        'Trilha do presidio',
      ],
    },
    {
      day: 3,
      title: 'Explorando praias',
      activities: [
        'Cafe da manha no hotel',
        'Praia da Almada',
        'Almoco pe-na-areia',
        'Check-out e retorno',
      ],
      places: ['Praia da Almada', 'Almoco pe-na-areia', 'Check-out'],
    },
  ],
  restaurants: [
    {
      id: '1',
      name: 'Peixe na Telha',
      category: 'Frutos do mar',
      priceLevel: '$$',
      location: 'Centro',
    },
    {
      id: '2',
      name: 'Restaurante do Celo',
      category: 'Brasileira',
      priceLevel: '$',
      location: 'Praia Grande',
    },
    {
      id: '3',
      name: 'Vila Picinguaba',
      category: 'Contemporaneo',
      priceLevel: '$$$',
      location: 'Picinguaba',
    },
  ],
  checklist: [
    { id: '1', text: 'Protetor solar', done: true },
    { id: '2', text: 'Roupa de banho', done: true },
    { id: '3', text: 'Camera fotografica', done: false },
    { id: '4', text: 'Remedios pessoais', done: false },
    { id: '5', text: 'Dinheiro em especie', done: false },
  ],
};

const MOCK_IMAGE = require('../../assets/images/ubatuba.jpg');

export default function ItineraryDetail() {
  const router = useRouter();
  useLocalSearchParams();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showShareSheet, setShowShareSheet] = useState(false);

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
            <Text style={styles.daysBadgeText}>{MOCK_ITINERARY.days} dias</Text>
          </View>
          <Text style={styles.heroTitle}>{MOCK_ITINERARY.title}</Text>
          <View style={styles.heroMeta}>
            <Ionicons
              name="location-outline"
              size={14}
              color="rgba(255,255,255,0.8)"
            />
            <Text style={styles.heroMetaText}>
              {MOCK_ITINERARY.destinationName}
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
            <Text style={styles.infoText}>{MOCK_ITINERARY.budget}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.infoText}>{MOCK_ITINERARY.createdAt}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Roteiro diário</Text>
        {MOCK_ITINERARY.dailyPlan.map((day) => (
          <View key={day.day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>Dia {day.day}</Text>
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

        <Text style={styles.sectionTitle}>Restaurantes sugeridos</Text>
        <View style={styles.restaurantsContainer}>
          {MOCK_ITINERARY.restaurants.map((r, idx) => (
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

        <Text style={styles.sectionTitle}>Checklist</Text>
        <View style={styles.checklistContainer}>
          {MOCK_ITINERARY.checklist.map((item, idx) => (
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
        itinerary={showShareSheet ? MOCK_ITINERARY : null}
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
