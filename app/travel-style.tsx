import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  View,
  Image,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import { useOnboarding } from '../context/OnboardingContext';

type Option = 'Econômico' | 'Moderado' | 'Luxo';
type Pace = 'Tranquilo' | 'Equilibrado' | 'Intenso';

export default function TravelStyle() {
  const router = useRouter();
  const { setBudget, setPace } = useOnboarding();

  const [budget, setLocalBudget] = useState<Option | null>(null);
  const [pace, setLocalPace] = useState<Pace | null>(null);

  function handleContinue() {
    if (!budget || !pace) return;

    setBudget(budget);
    setPace(pace);
    router.push('/loading');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Qual o seu estilo de viagem?</Text>

        <Image
          source={require('../assets/images/travel-style.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.section}>Orçamento</Text>
        <View style={styles.row}>
          {(['Econômico', 'Moderado', 'Luxo'] as Option[]).map((item) => {
            const active = budget === item;

            return (
              <Pressable
                key={item}
                onPress={() => setLocalBudget(item)}
                style={[styles.card, active && styles.cardActive]}
              >
                <Text
                  style={[styles.cardText, active && styles.cardTextActive]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>Ritmo</Text>
        <View style={styles.row}>
          {(['Tranquilo', 'Equilibrado', 'Intenso'] as Pace[]).map((item) => {
            const active = pace === item;

            return (
              <Pressable
                key={item}
                onPress={() => setLocalPace(item)}
                style={[styles.card, active && styles.cardActive]}
              >
                <Text
                  style={[styles.cardText, active && styles.cardTextActive]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button title="Continuar" onPress={handleContinue} />
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
    marginBottom: 24,
  },

  image: {
    width: '100%',
    height: 180,
    marginBottom: 32,
  },

  section: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  card: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  cardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  cardText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },

  cardTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  actions: {
    marginTop: 'auto',
    paddingBottom: 16,
  },
});
