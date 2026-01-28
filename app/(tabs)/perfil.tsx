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
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

const TRIPS = [
  {
    id: '1',
    title: 'Italia',
    date: 'Outubro 2024',
    image: require('../../assets/images/italia.jpg'),
  },
  {
    id: '2',
    title: 'Japao',
    date: 'Marco 2025',
    image: require('../../assets/images/japao.jpg'),
  },
  {
    id: '3',
    title: 'Turquia',
    date: 'Dezembro 2023',
    image: require('../../assets/images/turquia.jpg'),
  },
];

const MENU_ITEMS = [
  { id: 'favorites', icon: 'heart-outline', label: 'Favoritos', count: 12 },
  { id: 'saved', icon: 'bookmark-outline', label: 'Salvos', count: 8 },
  { id: 'settings', icon: 'settings-outline', label: 'Configuracoes' },
  { id: 'help', icon: 'help-circle-outline', label: 'Ajuda' },
];

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TripCard({ trip, onPress }: { trip: typeof TRIPS[0]; onPress: () => void }) {
  return (
    <Pressable style={styles.tripCard} onPress={onPress}>
      <Image source={trip.image} style={styles.tripImage} />
      <Text style={styles.tripTitle}>{trip.title}</Text>
      <Text style={styles.tripDate}>{trip.date}</Text>
    </Pressable>
  );
}

export default function Perfil() {
  const router = useRouter();

  function handleTripPress(id: string) {
    router.push('/(tabs)/explorar');
  }

  function handleMenuPress(id: string) {
    switch (id) {
      case 'settings':
        // router.push('/settings');
        break;
      case 'favorites':
        // router.push('/favorites');
        break;
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        {/* Profile info */}
        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/images/profile.jpg')}
            style={styles.avatar}
          />
          <Text style={styles.name}>Juliana Santos</Text>
          <Text style={styles.bio}>Amante de viagens e novas aventuras</Text>

          <View style={styles.stats}>
            <Stat number="12" label="Paises" />
            <View style={styles.statDivider} />
            <Stat number="45" label="Cidades" />
            <View style={styles.statDivider} />
            <Stat number="700" label="Seguidores" />
          </View>

          <Pressable style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </Pressable>
        </View>

        {/* Recent trips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Viagens recentes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tripsRow}
          >
            {TRIPS.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onPress={() => handleTripPress(trip.id)}
              />
            ))}
            <Pressable style={styles.addTripCard}>
              <Ionicons name="add" size={28} color={colors.muted} />
              <Text style={styles.addTripText}>Adicionar</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <View style={styles.menuContainer}>
            {MENU_ITEMS.map((item) => (
              <Pressable
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.id)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconCircle}>
                    <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.count !== undefined && (
                    <Text style={styles.menuItemCount}>{item.count}</Text>
                  )}
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
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
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  tripsRow: {
    paddingHorizontal: 24,
    gap: 14,
  },
  tripCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tripImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  tripTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  tripDate: {
    fontSize: 12,
    color: colors.muted,
    paddingHorizontal: 12,
    paddingBottom: 12,
    marginTop: 2,
  },
  addTripCard: {
    width: 140,
    height: 154,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addTripText: {
    fontSize: 13,
    color: colors.muted,
  },
  menuContainer: {
    paddingHorizontal: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 15,
    color: colors.text,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemCount: {
    fontSize: 14,
    color: colors.muted,
  },
});
