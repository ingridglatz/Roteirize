import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MOCK_ITINERARIES } from '../../data/mockItineraries';
import { colors } from '../../theme/colors';

export default function EditItinerary() {
  const { id } = useLocalSearchParams();
  const itinerary = MOCK_ITINERARIES.find((i) => i.id === id);

  if (!itinerary) return <Text>Roteiro não encontrado</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} defaultValue={itinerary.title} />

      <Text style={styles.label}>Dias</Text>
      <TextInput
        style={styles.input}
        defaultValue={String(itinerary.days)}
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Orçamento</Text>
      <TextInput style={styles.input} defaultValue={itinerary.budget} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 6,
  },
});
