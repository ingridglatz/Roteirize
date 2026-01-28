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
  ImageSourcePropType,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');

type TabName = 'Visão geral' | 'Lugares' | 'Posts' | 'Roteiros';

type Highlight = {
  title: string;
  slug: string;
  category: string;
  image: ImageSourcePropType;
};

const TABS: TabName[] = ['Visão geral', 'Lugares', 'Posts', 'Roteiros'];

const TAB_ROUTES = {
  'Visão geral': null,
  Lugares: '/lugares',
  Posts: '/post',
  Roteiros: '/destiny',
} as const;

const HIGHLIGHTS: Highlight[] = [
  {
    title: 'Praia do Félix',
    slug: 'praia-do-felix',
    category: 'Praia',
    image: require('../assets/images/praia1.jpg'),
  },
  {
    title: 'Ilha Anchieta',
    slug: 'ilha-anchieta',
    category: 'Ilha',
    image: require('../assets/images/praia2.jpg'),
  },
  {
    title: 'Praia Almada',
    slug: 'praia-almada',
    category: 'Praia',
    image: require('../assets/images/praia3.jpg'),
  },
];

const DESTINATION = {
  name: 'Ubatuba, Brasil',
  description:
    'Paraíso do litoral norte de São Paulo, com mais de 100 praias, trilhas na Mata Atlântica e diversas ilhas.',
  whyVisit:
    'Ubatuba é ideal para quem busca contato com a natureza, praias preservadas, trilhas, cachoeiras e uma atmosfera tranquila combinada com boa gastronomia.',
  image: require('../assets/images/ubatuba.jpg'),
};

type TabBarProps = {
  tabs: TabName[];
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
};

function TabBar({ tabs, activeTab, onTabPress }: TabBarProps) {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <Pressable
            key={tab}
            style={styles.tab}
            onPress={() => onTabPress(tab)}
          >
            <Text
              style={[styles.tabText, isActive && styles.tabActiveText]}
            >
              {tab}
            </Text>
            {isActive && <View style={styles.tabIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

type HighlightCardProps = {
  item: Highlight;
  onPress: () => void;
};

function HighlightCard({ item, onPress }: HighlightCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardOverlay}>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
    </Pressable>
  );
}

type OverviewTabProps = {
  highlights: Highlight[];
  onHighlightPress: (slug: string) => void;
  whyVisitText: string;
};

function OverviewTab({ highlights, onHighlightPress, whyVisitText }: OverviewTabProps) {
  return (
    <>
      <Text style={styles.section}>Destaques</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      >
        {highlights.map((item) => (
          <HighlightCard
            key={item.slug}
            item={item}
            onPress={() => onHighlightPress(item.slug)}
          />
        ))}
      </ScrollView>

      <Text style={styles.section}>Por que visitar</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>{whyVisitText}</Text>
      </View>
    </>
  );
}

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
    [router]
  );

  const handleCreateTrip = useCallback(() => {
    router.push('/select-days');
  }, [router]);

  const handleHighlightPress = useCallback(
    (slug: string) => {
      router.push(`/place/${slug}`);
    },
    [router]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Image source={DESTINATION.image} style={styles.hero} />

        <View style={styles.header}>
          <Text style={styles.title}>{DESTINATION.name}</Text>
          <Text style={styles.subtitle}>{DESTINATION.description}</Text>

          <Pressable style={styles.createTripButton} onPress={handleCreateTrip}>
            <Text style={styles.createTripText}>
              Criar roteiro personalizado
            </Text>
          </Pressable>
        </View>

        <TabBar tabs={TABS} activeTab={activeTab} onTabPress={handleTabPress} />

        {activeTab === 'Visão geral' && (
          <OverviewTab
            highlights={HIGHLIGHTS}
            onHighlightPress={handleHighlightPress}
            whyVisitText={DESTINATION.whyVisit}
          />
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Footer active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingBottom: 24 },

  hero: { width: '100%', height: 240 },

  header: { padding: 24, paddingBottom: 12 },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },

  createTripButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },

  createTripText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  tabs: {
    flexDirection: 'row',
    marginHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },

  tabText: { fontSize: 15, color: colors.muted },

  tabActiveText: { color: colors.primary, fontWeight: '600' },

  tabIndicator: {
    marginTop: 6,
    height: 2,
    width: 28,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  section: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
  },

  carousel: { paddingLeft: 24, paddingRight: 8 },

  card: {
    width: width * 0.65,
    height: 220,
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 8,
  },

  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  cardCategory: { fontSize: 12, color: '#fff', opacity: 0.85 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },

  infoCard: {
    marginHorizontal: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoText: { fontSize: 14, color: colors.muted, lineHeight: 20 },

  bottomSpacer: { height: 120 },
});
