import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Itinerary } from '../types/Itinerary';
import { MOCK_ITINERARIES } from '../data/mockItineraries';

type ItineraryCardProps = {
  item: Itinerary;
  onPress: () => void;
};

function ItineraryCard({ item, onPress }: ItineraryCardProps) {
  const places = item.dailyPlan.flatMap((day) => day.places);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>
        {item.destinationName} • {item.days} dias
      </Text>
      {places.length > 0 && (
        <Text style={styles.places}>{places.join(' • ')}</Text>
      )}
    </Pressable>
  );
}

function EmptyState() {
  return <Text style={styles.empty}>Você ainda não criou roteiros</Text>;
}

export default function Destiny() {
  const router = useRouter();

  const handleItineraryPress = useCallback(
    (id: string) => {
      router.push(`/itineraries/${id}`);
    },
    [router]
  );

  const handleCreatePress = useCallback(() => {
    router.push('/select-days');
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: Itinerary }) => (
      <ItineraryCard
        item={item}
        onPress={() => handleItineraryPress(item.id)}
      />
    ),
    [handleItineraryPress]
  );

  const keyExtractor = useCallback((item: Itinerary) => item.id, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Roteiros</Text>
      </View>

      <FlatList
        data={MOCK_ITINERARIES}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListEmptyComponent={EmptyState}
      />

      <Pressable style={styles.fab} onPress={handleCreatePress}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  listContent: {
    padding: 16,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },

  places: {
    marginTop: 8,
    fontSize: 13,
    color: colors.text,
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.muted,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
