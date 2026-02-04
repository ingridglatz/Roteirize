import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPlaceBySlug } from '../../data/places';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function PlaceDetails() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const place = slug ? getPlaceBySlug(slug) : null;

  if (!place) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Ionicons name="compass-outline" size={56} color={colors.disabled} />
          <Text style={styles.notFoundText}>Lugar não encontrado</Text>
          <Pressable style={styles.notFoundBtn} onPress={() => router.back()}>
            <Text style={styles.notFoundBtnText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image source={place.image} style={styles.hero} />
          <View style={styles.heroOverlay} />
          <SafeAreaView style={styles.heroTop} edges={['top']}>
            <Pressable style={styles.heroBackBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </Pressable>
          </SafeAreaView>
          <View style={styles.heroBottom}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{place.category}</Text>
            </View>
            <Text style={styles.heroTitle}>{place.title}</Text>
            <View style={styles.heroMeta}>
              <Ionicons
                name="location-outline"
                size={14}
                color="rgba(255,255,255,0.85)"
              />
              <Text style={styles.heroLocation}>{place.location}</Text>
              <View style={styles.heroRating}>
                <Ionicons name="star" size={14} color="#FFC107" />
                <Text style={styles.heroRatingText}>{place.rating}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.pillsRow}>
          <View style={styles.pill}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.pillText}>{place.bestTime}</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="fitness-outline" size={16} color={colors.primary} />
            <Text style={styles.pillText}>{place.difficulty}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.descriptionText}>{place.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Curiosidades</Text>
          {place.curiosities.map((item, idx) => (
            <View key={idx} style={styles.curiosityCard}>
              <Text style={styles.curiosityEmoji}>{item.emoji}</Text>
              <Text style={styles.curiosityText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que fazer</Text>
          <View style={styles.activitiesGrid}>
            {place.activities.map((activity, idx) => (
              <View key={idx} style={styles.activityCard}>
                <View style={styles.activityIconCircle}>
                  <Ionicons
                    name={activity.icon as any}
                    size={22}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDesc}>{activity.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dicas</Text>
          {place.tips.map((tip, idx) => (
            <View key={idx} style={styles.tipRow}>
              <View style={styles.tipIconCircle}>
                <Ionicons
                  name={tip.icon as any}
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ctaSection}>
          <Pressable
            style={styles.ctaButton}
            onPress={() => router.push('/(tabs)/create')}
          >
            <Ionicons name="sparkles" size={20} color="#fff" />
            <Text style={styles.ctaText}>Criar roteiro com este lugar</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_WIDTH = (width - 52) / 2;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  notFoundBtn: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  notFoundBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  hero: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: 300,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBottom: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  heroLocation: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginRight: 12,
  },
  heroRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroRatingText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 23,
  },
  curiosityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  curiosityEmoji: {
    fontSize: 22,
    marginTop: 1,
  },
  curiosityText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    flex: 1,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  activityIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  activityDesc: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  tipIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    flex: 1,
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
