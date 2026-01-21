import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import Footer from '../components/Footer';
import { useOnboarding } from '../context/OnboardingContext';

export default function Itinerary() {
  const { interests, budget, pace, days } = useOnboarding();

  const itinerary = Array.from({ length: days ?? 0 }, (_, index) => ({
    day: `Dia ${index + 1}`,
    title: `Explorando Ubatuba – Dia ${index + 1}`,
    activities: [
      'Café da manhã local',
      'Praia ou passeio principal',
      'Almoço em restaurante típico',
      'Atividade da tarde',
      'Jantar e descanso',
    ],
  }));

  if (!days) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.title}>Nenhum roteiro gerado</Text>
          <Text style={styles.subtitle}>
            Selecione a quantidade de dias para criar seu roteiro personalizado.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Seu roteiro em Ubatuba</Text>
          <Text style={styles.subtitle}>
            {days} dias • Planejado do seu jeito
          </Text>

          <View style={styles.tags}>
            {pace && <Text style={styles.tag}>⚡ {pace}</Text>}
            {budget && <Text style={styles.tag}>💰 {budget}</Text>}
            {interests.length > 0 && (
              <Text style={styles.tag}>
                🌍 {interests.slice(0, 2).join(', ')}
              </Text>
            )}
          </View>
        </View>

        {itinerary.map((day) => (
          <View key={day.day} style={styles.dayCard}>
            <Text style={styles.day}>{day.day}</Text>
            <Text style={styles.dayTitle}>{day.title}</Text>

            {day.activities.map((activity, index) => (
              <View key={index} style={styles.activity}>
                <View style={styles.dot} />
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      <Footer active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 24,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 12,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  tag: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 13,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },

  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  day: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 4,
  },

  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  activity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 10,
  },

  activityText: {
    fontSize: 14,
    color: colors.muted,
  },
});
