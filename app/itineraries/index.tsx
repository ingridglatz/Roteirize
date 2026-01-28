import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_ITINERARIES } from '../../data/mockItineraries';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function Itineraries() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Meus Roteiros</Text>

      <FlatList
        data={MOCK_ITINERARIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/itineraries',
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.subtitle}>
              {item.destinationName} • {item.days} dias
            </Text>
            <Text style={styles.places}>
              {item.dailyPlan[0]?.places.join(' • ')}
            </Text>
          </Pressable>
        )}
      />

      <Pressable
        style={styles.fab}
        onPress={() => router.push('/itineraries/create')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, padding: 24 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },

  cardTitle: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 4 },
  places: { fontSize: 13, marginTop: 6 },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
