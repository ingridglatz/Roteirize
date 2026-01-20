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
    title: 'Praia do Félix',
    image: require('../assets/images/praia1.jpg'),
  },
  {
    title: 'Ilha Anchieta',
    image: require('../assets/images/praia2.jpg'),
  },
  {
    title: 'Praia Almada',
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
                  key={item.title}
                  style={styles.card}
                  onPress={() => router.push('/places')}
                >
                  <Image source={item.image} style={styles.cardImage} />
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <Footer active={'home'} />
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
    width: width * 0.6,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    resizeMode: 'cover',
  },

  cardTitle: {
    padding: 12,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
});
