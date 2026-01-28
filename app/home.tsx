import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import Footer from '../components/Footer';
import { PLACES_DATA, type Place } from '../data/places';

const { width } = Dimensions.get('window');

type TabName = 'Visão geral' | 'Lugares' | 'Posts' | 'Roteiros';

const TABS: TabName[] = ['Visão geral', 'Lugares', 'Posts', 'Roteiros'];

const TAB_ROUTES = {
  'Visão geral': null,
  Lugares: '/lugares',
  Posts: '/post',
  Roteiros: '/destiny',
} as const;

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
    { emoji: '🏖️', text: 'Ubatuba tem mais de 100 praias catalogadas, muitas acessiveis apenas por trilha ou barco.' },
    { emoji: '🐢', text: 'A cidade abriga o Projeto Tamar, referencia na conservacao de tartarugas marinhas no Brasil.' },
    { emoji: '🌧️', text: 'E conhecida como "Ubachuva" pela alta umidade, mas isso mantem a mata sempre verde e exuberante.' },
  ],
  image: require('../assets/images/ubatuba.jpg'),
};

// --- Components ---

function TabBar({
  tabs,
  activeTab,
  onTabPress,
}: {
  tabs: TabName[];
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}) {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <Pressable key={tab} style={styles.tab} onPress={() => onTabPress(tab)}>
            <Text style={[styles.tabText, isActive && styles.tabActiveText]}>
              {tab}
            </Text>
            {isActive && <View style={styles.tabIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

function HighlightCard({ item, onPress }: { item: Place; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={item.image} style={styles.cardImage} />
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

function OverviewTab({
  onHighlightPress,
  onCreateTrip,
}: {
  onHighlightPress: (slug: string) => void;
  onCreateTrip: () => void;
}) {
  return (
    <View style={styles.overviewContainer}>
      {/* Highlights */}
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
            onPress={() => onHighlightPress(item.slug)}
          />
        ))}
      </ScrollView>

      {/* Curiosities */}
      <Text style={styles.sectionTitle}>Voce sabia?</Text>
      <View style={styles.sectionContent}>
        {DESTINATION.curiosities.map((item, idx) => (
          <View key={idx} style={styles.curiosityRow}>
            <Text style={styles.curiosityEmoji}>{item.emoji}</Text>
            <Text style={styles.curiosityText}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* What to do */}
      <Text style={styles.sectionTitle}>O que fazer</Text>
      <View style={styles.sectionContent}>
        {PLACES_DATA.map((place) => (
          <Pressable
            key={place.slug}
            style={styles.activityCard}
            onPress={() => onHighlightPress(place.slug)}
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

      {/* Why visit */}
      <Text style={styles.sectionTitle}>Por que visitar</Text>
      <View style={styles.sectionContent}>
        {DESTINATION.whyVisit.map((item, idx) => (
          <View key={idx} style={styles.reasonCard}>
            <View style={styles.reasonIconCircle}>
              <Ionicons name={item.icon as any} size={20} color={colors.primary} />
            </View>
            <View style={styles.reasonBody}>
              <Text style={styles.reasonTitle}>{item.title}</Text>
              <Text style={styles.reasonText}>{item.text}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA */}
      <Pressable style={styles.ctaButton} onPress={onCreateTrip}>
        <Ionicons name="sparkles" size={18} color="#fff" />
        <Text style={styles.ctaText}>Criar roteiro para {DESTINATION.name}</Text>
      </Pressable>
    </View>
  );
}

// --- Screen ---

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabName>('Visão geral');

  const handleTabPress = useCallback(
    (tab: TabName) => {
      const route = TAB_ROUTES[tab];
      if (route !== null) {
        router.push(route);
      } else {
        setActiveTab(tab);
      }
    },
    [router],
  );

  const handleCreateTrip = useCallback(() => {
    router.push('/itineraries/create');
  }, [router]);

  const handleHighlightPress = useCallback(
    (slug: string) => {
      router.push(`/place/${slug}`);
    },
    [router],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View>
          <Image source={DESTINATION.image} style={styles.hero} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTagline}>{DESTINATION.tagline}</Text>
            <Text style={styles.heroTitle}>{DESTINATION.fullName}</Text>
            <Text style={styles.heroDesc}>{DESTINATION.description}</Text>
          </View>
        </View>

        {/* Tabs */}
        <TabBar tabs={TABS} activeTab={activeTab} onTabPress={handleTabPress} />

        {/* Tab content */}
        {activeTab === 'Visão geral' && (
          <OverviewTab
            onHighlightPress={handleHighlightPress}
            onCreateTrip={handleCreateTrip}
          />
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Footer active="home" />
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingBottom: 24,
  },

  // Hero
  hero: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: 280,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  heroTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
  heroDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    marginTop: 6,
  },

  // Tabs
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  tabText: {
    fontSize: 14,
    color: colors.muted,
  },
  tabActiveText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabIndicator: {
    marginTop: 6,
    height: 2,
    width: 28,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  // Overview container
  overviewContainer: {
    paddingTop: 8,
  },

  // Section
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

  // Highlight cards
  carousel: {
    paddingLeft: 24,
    paddingRight: 8,
  },
  card: {
    width: width * 0.6,
    height: 200,
    borderRadius: 20,
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
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 14,
    paddingTop: 30,
    backgroundColor: 'rgba(0,0,0,0)',
    backgroundImage: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 6,
  },
  cardBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
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
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },

  // Curiosities
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

  // Activities list
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

  // Why visit reasons
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

  // CTA
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
    height: 120,
  },
});
