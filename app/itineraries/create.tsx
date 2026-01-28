// app/itineraries/create.tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { colors } from '../../theme/colors';
import { useRouter } from 'expo-router';

const INTERESTS = [
  'Praia',
  'Natureza',
  'Gastronomia',
  'Cultura',
  'Vida noturna',
  'Compras',
  'Aventura',
];

export default function CreateItinerary() {
  const router = useRouter();

  const [title, setTitle] = useState('Minha viagem');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState<'Econômico' | 'Moderado' | 'Luxo'>(
    'Moderado',
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  function toggleInterest(item: string) {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  }

  function handleGenerate() {
    router.push('/itineraries');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Criar roteiro</Text>

        <Text style={styles.label}>Nome do roteiro</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />

        <Text style={styles.label}>Quantidade de dias</Text>
        <View style={styles.row}>
          {[1, 3, 5, 7].map((d) => (
            <Pressable
              key={d}
              style={[styles.chip, days === d && styles.chipActive]}
              onPress={() => setDays(d)}
            >
              <Text
                style={days === d ? styles.chipTextActive : styles.chipText}
              >
                {d} dias
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Orçamento</Text>
        <View style={styles.row}>
          {['Econômico', 'Moderado', 'Luxo'].map((b) => (
            <Pressable
              key={b}
              style={[styles.chip, budget === b && styles.chipActive]}
              onPress={() => setBudget(b as any)}
            >
              <Text
                style={budget === b ? styles.chipTextActive : styles.chipText}
              >
                {b}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Interesses</Text>
        <View style={styles.interests}>
          {INTERESTS.map((item) => {
            const selected = selectedInterests.includes(item);
            return (
              <Pressable
                key={item}
                style={[styles.chip, selected && styles.chipActive]}
                onPress={() => toggleInterest(item)}
              >
                <Text
                  style={selected ? styles.chipTextActive : styles.chipText}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.button} onPress={handleGenerate}>
          <Text style={styles.buttonText}>Gerar roteiro com IA ✨</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  container: {
    padding: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 12,
  },

  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },

  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
  },

  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  chipText: {
    fontSize: 13,
    color: colors.text,
  },

  chipTextActive: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },

  button: {
    marginTop: 32,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
