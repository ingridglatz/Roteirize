import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { colors } from '../../theme/colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useItineraries } from '../../context/ItinerariesContext';
import { Itinerary } from '../../types/Itinerary';

const INTERESTS = [
  'Praia',
  'Natureza',
  'Gastronomia',
  'Cultura',
  'Vida noturna',
  'Compras',
  'Aventura',
  'Relaxamento',
];

const DESTINATIONS = [
  { id: 'ubatuba', name: 'Ubatuba, Brasil' },
  { id: 'ilhabela', name: 'Ilhabela, Brasil' },
  { id: 'paraty', name: 'Paraty, Brasil' },
  { id: 'noronha', name: 'Fernando de Noronha, Brasil' },
  { id: 'arraial', name: 'Arraial do Cabo, Brasil' },
  { id: 'santorini', name: 'Santorini, Grecia' },
  { id: 'bali', name: 'Bali, Indonesia' },
  { id: 'ibiza', name: 'Ibiza, Espanha' },
];

const BUDGETS = ['Econômico', 'Moderado', 'Luxo'] as const;

function generateMockPlan(days: number, interests: string[]) {
  const activities: Record<string, string[]> = {
    Praia: ['Dia de praia', 'Snorkeling', 'Stand-up paddle'],
    Natureza: ['Trilha ecologica', 'Cachoeira', 'Mirante'],
    Gastronomia: ['Restaurante local', 'Feira gastronomica', 'Aula de culinaria'],
    Cultura: ['Museu', 'Centro historico', 'Artesanato local'],
    'Vida noturna': ['Bar na praia', 'Show ao vivo', 'Luau'],
    Compras: ['Feira de artesanato', 'Shopping local', 'Loja de souvenirs'],
    Aventura: ['Rapel', 'Mergulho', 'Tirolesa'],
    Relaxamento: ['Spa', 'Yoga na praia', 'Leitura ao por do sol'],
  };

  const dailyPlan = Array.from({ length: days }, (_, i) => {
    const dayInterests = interests.length > 0 ? interests : ['Praia', 'Natureza'];
    const interest = dayInterests[i % dayInterests.length];
    const acts = activities[interest] ?? ['Passeio livre'];
    return {
      day: i + 1,
      title: i === 0 ? 'Chegada e exploracao' : i === days - 1 ? 'Ultimo dia' : `Dia ${i + 1}`,
      activities: acts.slice(0, 2),
      places: acts.slice(0, 1),
    };
  });

  return dailyPlan;
}

export default function CreateItinerary() {
  const router = useRouter();
  const { addItinerary } = useItineraries();

  const [title, setTitle] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number]>('Moderado');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedDest, setSelectedDest] = useState(DESTINATIONS[0]);

  function toggleInterest(item: string) {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  }

  function handleGenerate() {
    const finalTitle =
      title.trim() || `Viagem para ${selectedDest.name.split(',')[0]}`;

    const itinerary: Itinerary = {
      id: Date.now().toString(),
      title: finalTitle,
      destinationId: selectedDest.id,
      destinationName: selectedDest.name,
      days,
      budget,
      interests: selectedInterests,
      dailyPlan: generateMockPlan(days, selectedInterests),
      restaurants: [
        {
          id: 'r' + Date.now(),
          name: 'Restaurante Recomendado',
          category: 'Local',
          priceLevel: budget === 'Econômico' ? '$' : budget === 'Moderado' ? '$$' : '$$$',
          location: selectedDest.name.split(',')[0],
        },
      ],
      checklist: [
        { id: 'c1', text: 'Reservar hospedagem', done: false },
        { id: 'c2', text: 'Comprar passagens', done: false },
        { id: 'c3', text: 'Fazer mala', done: false },
      ],
      createdAt: new Date().toISOString(),
    };

    addItinerary(itinerary);

    Alert.alert('Roteiro criado!', `"${finalTitle}" foi salvo com sucesso.`, [
      { text: 'Ver roteiros', onPress: () => router.replace('/destiny') },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>

        <Text style={styles.screenTitle}>Criar roteiro</Text>

        {/* Title */}
        <Text style={styles.label}>Nome do roteiro</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Fim de semana em Ubatuba"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        {/* Destination */}
        <Text style={styles.label}>Destino</Text>
        <View style={styles.chips}>
          {DESTINATIONS.map((dest) => (
            <Pressable
              key={dest.id}
              style={[styles.chip, selectedDest.id === dest.id && styles.chipActive]}
              onPress={() => setSelectedDest(dest)}
            >
              <Text
                style={
                  selectedDest.id === dest.id
                    ? styles.chipTextActive
                    : styles.chipText
                }
              >
                {dest.name.split(',')[0]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Days */}
        <Text style={styles.label}>Quantidade de dias</Text>
        <View style={styles.chips}>
          {[1, 2, 3, 5, 7, 10].map((d) => (
            <Pressable
              key={d}
              style={[styles.chip, days === d && styles.chipActive]}
              onPress={() => setDays(d)}
            >
              <Text style={days === d ? styles.chipTextActive : styles.chipText}>
                {d} {d === 1 ? 'dia' : 'dias'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Budget */}
        <Text style={styles.label}>Orcamento</Text>
        <View style={styles.chips}>
          {BUDGETS.map((b) => (
            <Pressable
              key={b}
              style={[styles.chip, budget === b && styles.chipActive]}
              onPress={() => setBudget(b)}
            >
              <Text style={budget === b ? styles.chipTextActive : styles.chipText}>
                {b}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Interests */}
        <Text style={styles.label}>Interesses</Text>
        <View style={styles.chips}>
          {INTERESTS.map((item) => {
            const selected = selectedInterests.includes(item);
            return (
              <Pressable
                key={item}
                style={[styles.chip, selected && styles.chipActive]}
                onPress={() => toggleInterest(item)}
              >
                <Text style={selected ? styles.chipTextActive : styles.chipText}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Generate */}
        <Pressable style={styles.button} onPress={handleGenerate}>
          <Ionicons name="sparkles" size={20} color="#fff" />
          <Text style={styles.buttonText}>Gerar roteiro</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: 24,
    paddingBottom: 60,
  },
  backBtn: {
    marginBottom: 8,
    width: 40,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
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
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
