import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import { useOnboarding } from '../context/OnboardingContext';

export default function Travel() {
  const router = useRouter();
  const { interests, budget, pace } = useOnboarding();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Criando seu roteiro ✨</Text>

        <Text style={styles.subtitle}>
          Estamos montando uma experiência perfeita para você
        </Text>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Suas preferências</Text>

          <Text style={styles.summaryItem}>
            🌍 Interesses: {interests.join(', ') || '—'}
          </Text>

          <Text style={styles.summaryItem}>💰 Orçamento: {budget || '—'}</Text>

          <Text style={styles.summaryItem}>⚡ Ritmo: {pace || '—'}</Text>
        </View>

        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            Pensando no melhor roteiro para você…
          </Text>
        </View>
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

  summary: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  summaryItem: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 6,
  },

  loading: {
    alignItems: 'center',
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
    color: colors.muted,
  },
});
