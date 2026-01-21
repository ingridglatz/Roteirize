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
import { useState } from 'react';
import { colors } from '../theme/colors';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');

const TABS = ['Visão geral', 'Lugares', 'Posts', 'Roteiros'];

const HIGHLIGHTS = [
  {
    id: 'felix',
    title: 'Praia do Félix',
    slug: 'praia-do-felix',
    category: 'Praia',
    image: require('../assets/images/praia1.jpg'),
  },
  {
    id: 'anchieta',
    title: 'Ilha Anchieta',
    slug: 'ilha-anchieta',
    category: 'Ilha',
    image: require('../assets/images/praia2.jpg'),
  },
  {
    id: 'almada',
    title: 'Praia Almada',
    slug: 'praia-almada',
    category: 'Praia',
    image: require('../assets/images/praia3.jpg'),
  },
];

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Visão geral');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../assets/images/ubatuba.jpg')}
          style={styles.hero}
        />

        <View style={styles.header}>
          <Text style={styles.title}>Ubatuba, Brasil</Text>
          <Text style={styles.subtitle}>
            Paraíso do litoral norte de São Paulo, com mais de 100 praias,
            trilhas na Mata Atlântica e diversas ilhas.
          </Text>

          <Pressable
            style={styles.createTripButton}
            onPress={() => router.push('/select-days')}
          >
            <Text style={styles.createTripText}>
              Criar roteiro personalizado
            </Text>
          </Pressable>
        </View>

        <View style={styles.tabs}>
          {TABS.map((tab) => {
            const active = tab === activeTab;

            return (
              <Pressable
                key={tab}
                style={styles.tab}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, active && styles.tabActiveText]}>
                  {tab}
                </Text>

                {active && <View style={styles.tabIndicator} />}
              </Pressable>
            );
          })}
        </View>

        {activeTab === 'Visão geral' && (
          <>
            <Text style={styles.section}>Destaques</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
            >
              {HIGHLIGHTS.map((item) => (
                <Pressable
                  key={item.slug}
                  style={styles.card}
                  onPress={() =>
                    router.push({
                      pathname: '/place/[slug]',
                      params: { slug: item.slug },
                    })
                  }
                >
                  <Image source={item.image} style={styles.cardImage} />

                  <View style={styles.cardOverlay}>
                    <Text style={styles.cardCategory}>{item.category}</Text>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.section}>Por que visitar</Text>

            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Ubatuba é ideal para quem busca contato com a natureza, praias
                preservadas, trilhas, cachoeiras e uma atmosfera tranquila
                combinada com boa gastronomia.
              </Text>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>🌤 Clima</Text>
                <Text style={styles.infoSubtitle}>Quente o ano todo</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>🧭 Estilo</Text>
                <Text style={styles.infoSubtitle}>Natureza & Praia</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>📅 Duração</Text>
                <Text style={styles.infoSubtitle}>3 a 7 dias</Text>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <Footer active="home" />
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

  hero: {
    width: '100%',
    height: 240,
  },

  header: {
    padding: 24,
    paddingBottom: 12,
  },

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

  createTripText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  tabs: {
    flexDirection: 'row',
    marginHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },

  tabText: {
    fontSize: 15,
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

  section: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
  },

  carousel: {
    paddingLeft: 24,
    paddingRight: 8,
  },

  card: {
    width: width * 0.65,
    height: 220,
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
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
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cardCategory: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.85,
    marginBottom: 4,
  },

  infoCard: {
    marginHorizontal: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoText: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },

  infoGrid: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 16,
    gap: 12,
  },

  infoBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },

  infoSubtitle: {
    fontSize: 13,
    color: colors.muted,
  },
});
