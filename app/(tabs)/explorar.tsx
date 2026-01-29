import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PLACES_DATA, type Place } from '../../data/places';

const { width } = Dimensions.get('window');

const DESTINATION = {
  name: 'Ubatuba',
  fullName: 'Ubatuba, Brasil',
  tagline: 'Litoral norte de Sao Paulo',
  description:
    'Mais de 100 praias, trilhas na Mata Atlantica e diversas ilhas paradisiacas.',
  whyVisit: [
    {
      icon: 'leaf-outline',
      title: 'Natureza preservada',
      text: 'Praias cercadas por Mata Atlantica, cachoeiras escondidas e trilhas com vistas incriveis.',
    },
    {
      icon: 'restaurant-outline',
      title: 'Gastronomia caicara',
      text: 'Frutos do mar frescos servidos pe-na-areia por comunidades tradicionais de pescadores.',
    },
    {
      icon: 'compass-outline',
      title: 'Aventura para todos',
      text: 'Do surf em ondas fortes ao mergulho em aguas cristalinas, ha atividades para todos os perfis.',
    },
  ],
  curiosities: [
    {
      emoji: '🏖️',
      text: 'Ubatuba tem mais de 100 praias catalogadas, muitas acessiveis apenas por trilha ou barco.',
    },
    {
      emoji: '🐢',
      text: 'A cidade abriga o Projeto Tamar, referencia na conservacao de tartarugas marinhas no Brasil.',
    },
    {
      emoji: '🌧️',
      text: 'E conhecida como "Ubachuva" pela alta umidade, mas isso mantem a mata sempre verde e exuberante.',
    },
  ],
  image: require('../../assets/images/ubatuba.jpg'),
};

function HighlightCard({
  item,
  onPress,
}: {
  item: Place;
  onPress: () => void;
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

  const handleHighlightPress = useCallback(
    (slug: string) => {
      router.push(`/place/${slug}`);
    },
    [router],
  );

  const handleCreateTrip = useCallback(() => {
    router.push('/(tabs)/create');
  }, [router]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explorar</Text>
          <Pressable>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Para onde voce quer ir?"
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.heroContainer}>
          <Image source={DESTINATION.image} style={styles.hero} />
          <View style={styles.heroGradient} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTagline}>{DESTINATION.tagline}</Text>
            <Text style={styles.heroTitle}>{DESTINATION.fullName}</Text>
            <Text style={styles.heroDesc}>{DESTINATION.description}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Destaques</Text>
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
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Voce sabia?</Text>
        <View style={styles.sectionContent}>
          {DESTINATION.curiosities.map((item, idx) => (
            <View key={idx} style={styles.curiosityRow}>
              <Text style={styles.curiosityEmoji}>{item.emoji}</Text>
              <Text style={styles.curiosityText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>O que fazer</Text>
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

        <Text style={styles.sectionTitle}>Por que visitar</Text>
        <View style={styles.sectionContent}>
          {DESTINATION.whyVisit.map((item, idx) => (
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
            Criar roteiro para {DESTINATION.name}
          </Text>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
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
    backgroundColor: '#F0FDFB',
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
    paddingVertical: 16,
    borderRadius: 28,
  },
  ctaText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  bottomSpacer: {
    height: 90,
  },
});
