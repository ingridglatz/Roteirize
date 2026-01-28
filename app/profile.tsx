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
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');

const TABS = ['Viagens', 'Favoritos', 'Posts', 'Roteiros'];

const TRIPS = [
  {
    title: 'Itália',
    date: 'Outubro 2024',
    image: require('../assets/images/italia.jpg'),
  },
  {
    title: 'Japão',
    date: 'Março 2025',
    image: require('../assets/images/japao.jpg'),
  },
  {
    title: 'Turquia',
    date: 'Dezembro 2023',
    image: require('../assets/images/turquia.jpg'),
  },
];

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Viagens');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Image
            source={require('../assets/images/profile.jpg')}
            style={styles.avatar}
          />
          <Text style={styles.name}>Juliana Santos</Text>

          <View style={styles.stats}>
            <Stat number="12" label="Países" />
            <Divider />
            <Stat number="45" label="Cidades" />
            <Divider />
            <Stat number="700" label="Seguidores" />
          </View>
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

        {activeTab === 'Viagens' && (
          <View style={styles.grid}>
            {TRIPS.map((trip) => (
              <Pressable
                key={trip.title}
                style={styles.card}
                onPress={() => router.push('/home')}
              >
                <Image source={trip.image} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{trip.title}</Text>
                <Text style={styles.cardDate}>{trip.date}</Text>
              </Pressable>
            ))}

            <Pressable style={[styles.card, styles.addCard]}>
              <Text style={styles.plus}>＋</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <Footer active={'profile'} />
    </SafeAreaView>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingBottom: 24,
  },

  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },

  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stat: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  statLabel: {
    fontSize: 13,
    color: colors.muted,
  },

  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
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

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },

  card: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },

  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  cardTitle: {
    paddingHorizontal: 12,
    paddingTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  cardDate: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 13,
    color: colors.muted,
  },

  addCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
  },

  plus: {
    fontSize: 40,
    color: colors.muted,
  },
});
