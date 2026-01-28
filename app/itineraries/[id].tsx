import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useItineraries } from '../../context/ItinerariesContext';

const DEST_IMAGES: Record<string, any> = {
  ubatuba: require('../../assets/images/ubatuba.jpg'),
  ilhabela: require('../../assets/images/ilhabela.jpg'),
  paraty: require('../../assets/images/paraty.jpg'),
  noronha: require('../../assets/images/noronha.jpg'),
  arraial: require('../../assets/images/arraial.jpg'),
  santorini: require('../../assets/images/santorini.jpg'),
  bali: require('../../assets/images/bali.jpg'),
  ibiza: require('../../assets/images/ibiza.jpg'),
};

export default function ItineraryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { itineraries } = useItineraries();

  const itinerary = itineraries.find((i) => i.id === id);

  if (!itinerary) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={56} color={colors.disabled} />
          <Text style={styles.notFoundText}>Roteiro nao encontrado</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const heroImage = DEST_IMAGES[itinerary.destinationId] ?? DEST_IMAGES['ubatuba'];
  const budgetLabel =
    itinerary.budget === 'Econômico' ? '$' : itinerary.budget === 'Moderado' ? '$$' : '$$$';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View>
          <Image source={heroImage} style={styles.hero} />
          <View style={styles.heroOverlay} />
          <SafeAreaView style={styles.heroContent} edges={['top']}>
            <Pressable style={styles.heroBack} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </Pressable>
          </SafeAreaView>
          <View style={styles.heroTitleArea}>
            <Text style={styles.heroTitle}>{itinerary.title}</Text>
            <Text style={styles.heroSubtitle}>
              {itinerary.destinationName}
            </Text>
          </View>
        </View>

        {/* Info chips */}
        <View style={styles.infoRow}>
          <View style={styles.infoChip}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            <Text style={styles.infoText}>
              {itinerary.days} dia{itinerary.days !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.infoChip}>
            <Ionicons name="wallet-outline" size={16} color={colors.primary} />
            <Text style={styles.infoText}>{itinerary.budget} ({budgetLabel})</Text>
          </View>
        </View>

        {/* Interests */}
        {itinerary.interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interesses</Text>
            <View style={styles.tagsRow}>
              {itinerary.interests.map((interest) => (
                <View key={interest} style={styles.tag}>
                  <Text style={styles.tagText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Daily plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Roteiro dia a dia</Text>
          {itinerary.dailyPlan.map((day) => (
            <View key={day.day} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>Dia {day.day}</Text>
                </View>
                <Text style={styles.dayTitle}>{day.title}</Text>
              </View>

              {day.activities.length > 0 && (
                <View style={styles.daySection}>
                  <Text style={styles.daySectionLabel}>Atividades</Text>
                  {day.activities.map((activity, idx) => (
                    <View key={idx} style={styles.activityRow}>
                      <View style={styles.bulletOuter}>
                        <View style={styles.bulletInner} />
                      </View>
                      <Text style={styles.activityText}>{activity}</Text>
                    </View>
                  ))}
                </View>
              )}

              {day.places.length > 0 && (
                <View style={styles.daySection}>
                  <Text style={styles.daySectionLabel}>Lugares</Text>
                  {day.places.map((place, idx) => (
                    <View key={idx} style={styles.activityRow}>
                      <Ionicons name="location-outline" size={16} color={colors.primary} />
                      <Text style={styles.activityText}>{place}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Restaurants */}
        {itinerary.restaurants.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Restaurantes</Text>
            {itinerary.restaurants.map((rest) => (
              <View key={rest.id} style={styles.restaurantCard}>
                <View style={styles.restaurantHeader}>
                  <Ionicons name="restaurant-outline" size={20} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.restaurantName}>{rest.name}</Text>
                    <Text style={styles.restaurantInfo}>
                      {rest.category} · {rest.priceLevel} · {rest.location}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Checklist */}
        {itinerary.checklist.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Checklist</Text>
            {itinerary.checklist.map((item) => (
              <View key={item.id} style={styles.checkItem}>
                <Ionicons
                  name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={item.done ? colors.primary : colors.disabled}
                />
                <Text
                  style={[
                    styles.checkText,
                    item.done && styles.checkTextDone,
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Created at */}
        <Text style={styles.createdAt}>
          Criado em{' '}
          {new Date(itinerary.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Not found
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  notFoundText: {
    fontSize: 16,
    color: colors.muted,
    marginTop: 12,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Hero
  hero: {
    width: '100%',
    height: 260,
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: 260,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitleArea: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },

  // Info row
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0FDFB',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },

  // Day card
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  dayBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dayBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  daySection: {
    marginTop: 8,
  },
  daySectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  bulletOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulletInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  activityText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },

  // Restaurants
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  restaurantInfo: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },

  // Checklist
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  checkText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  checkTextDone: {
    textDecorationLine: 'line-through',
    color: colors.muted,
  },

  // Footer
  createdAt: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.muted,
    marginTop: 32,
    paddingHorizontal: 20,
  },
});
