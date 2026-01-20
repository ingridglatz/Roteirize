import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { useState } from 'react';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const INTERESTS = [
  { label: 'Praia', icon: 'beach' },
  { label: 'Natureza', icon: 'leaf' },
  { label: 'Cultura', icon: 'bank' },
  { label: 'Vida noturna', icon: 'glass-cocktail' },
  { label: 'Aventura', icon: 'compass' },
  { label: 'Gastronomia', icon: 'silverware-fork-knife' },
];

export default function Interests() {
  const router = useRouter();
  const { setInterests } = useOnboarding();
  const [selected, setSelected] = useState<string[]>([]);

  function toggleInterest(item: string) {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Quais são seus interesses?</Text>
        <Text style={styles.subtitle}>
          Selecione pelo menos 3 cards para personalizarmos o seu roteiro.
        </Text>

        <View style={styles.cards}>
          {INTERESTS.map((item) => {
            const isActive = selected.includes(item.label);

            return (
              <Pressable
                key={item.label}
                onPress={() => toggleInterest(item.label)}
                style={[styles.card, isActive && styles.cardActive]}
              >
                <View style={styles.cardLeft}>
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={20}
                    color={isActive ? '#fff' : colors.muted}
                  />
                  <Text
                    style={[styles.cardText, isActive && styles.cardTextActive]}
                  >
                    {item.label}
                  </Text>
                </View>

                {isActive && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#fff"
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button
            title="Continuar"
            onPress={() => {
              setInterests(selected);
              router.push('/travel-style');
            }}
          />
        </View>
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
    flexGrow: 1,
    padding: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 32,
  },

  cards: {
    gap: 16,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#f1f1f1',
  },

  cardActive: {
    backgroundColor: colors.primary,
  },

  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  cardText: {
    fontSize: 16,
    color: colors.muted,
  },

  cardTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  actions: {
    marginTop: 'auto',
    paddingBottom: 16,
  },
});
