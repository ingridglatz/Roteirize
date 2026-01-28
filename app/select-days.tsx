import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import Button from '../components/Button';
import { useOnboarding } from '../context/OnboardingContext';

const DAYS = [2, 3, 5, 7];

export default function SelectDays() {
  const router = useRouter();
  const { setDays } = useOnboarding();
  const [selected, setSelected] = useState<number | null>(null);

  function handleContinue() {
    if (!selected) return;
    setDays(selected);
    router.push('/travel');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Quantos dias você vai ficar?</Text>
        <Text style={styles.subtitle}>
          Assim criamos um roteiro perfeito para o seu tempo de viagem
        </Text>

        <View style={styles.options}>
          {DAYS.map((day) => {
            const active = selected === day;

            return (
              <Pressable
                key={day}
                style={[styles.chip, active && styles.active]}
                onPress={() => setSelected(day)}
              >
                <Text style={[styles.chipText, active && styles.activeText]}>
                  {day} dias
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Button
          title="Criar roteiro"
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 32,
  },

  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },

  chip: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },

  active: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  chipText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },

  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
