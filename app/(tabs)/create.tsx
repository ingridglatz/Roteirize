import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type Step = 'destination' | 'days' | 'preferences' | 'generating';

const DESTINATIONS = [
  { id: 'ubatuba', name: 'Ubatuba', subtitle: 'Litoral Norte, SP', image: require('../../assets/images/ubatuba.jpg') },
  { id: 'paraty', name: 'Paraty', subtitle: 'Costa Verde, RJ', image: require('../../assets/images/praia2.jpg') },
  { id: 'floripa', name: 'Florianopolis', subtitle: 'Santa Catarina', image: require('../../assets/images/praia1.jpg') },
  { id: 'buzios', name: 'Buzios', subtitle: 'Regiao dos Lagos, RJ', image: require('../../assets/images/praia3.jpg') },
];

const DAY_OPTIONS = [2, 3, 5, 7];

const INTERESTS = [
  { id: 'praia', label: 'Praia', icon: 'beach' },
  { id: 'natureza', label: 'Natureza', icon: 'leaf' },
  { id: 'gastronomia', label: 'Gastronomia', icon: 'silverware-fork-knife' },
  { id: 'cultura', label: 'Cultura', icon: 'bank' },
  { id: 'aventura', label: 'Aventura', icon: 'compass' },
  { id: 'compras', label: 'Compras', icon: 'shopping' },
];

const BUDGETS = ['Economico', 'Moderado', 'Luxo'];

export default function Create() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('destination');
  const [destination, setDestination] = useState<string | null>(null);
  const [days, setDays] = useState<number | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [tripName, setTripName] = useState('');

  function toggleInterest(id: string) {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function handleBack() {
    switch (step) {
      case 'days':
        setStep('destination');
        break;
      case 'preferences':
        setStep('days');
        break;
      case 'generating':
        setStep('preferences');
        break;
      default:
        router.back();
    }
  }

  function handleNext() {
    switch (step) {
      case 'destination':
        if (destination) setStep('days');
        break;
      case 'days':
        if (days) setStep('preferences');
        break;
      case 'preferences':
        if (budget && interests.length > 0) setStep('generating');
        break;
    }
  }

  function canContinue() {
    switch (step) {
      case 'destination':
        return !!destination;
      case 'days':
        return !!days;
      case 'preferences':
        return !!budget && interests.length > 0;
      default:
        return false;
    }
  }

  // Auto-redirect after generating
  useEffect(() => {
    if (step === 'generating') {
      const timer = setTimeout(() => {
        router.replace('/(tabs)/roteiros');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  function renderDestinationStep() {
    return (
      <>
        <Text style={styles.stepTitle}>Para onde voce quer ir?</Text>
        <Text style={styles.stepSubtitle}>
          Selecione o destino da sua viagem
        </Text>

        <View style={styles.destinationsGrid}>
          {DESTINATIONS.map((dest) => {
            const isSelected = destination === dest.id;
            return (
              <Pressable
                key={dest.id}
                style={[styles.destCard, isSelected && styles.destCardSelected]}
                onPress={() => setDestination(dest.id)}
              >
                <Image source={dest.image} style={styles.destImage} />
                <View style={styles.destOverlay} />
                <View style={styles.destContent}>
                  <Text style={styles.destName}>{dest.name}</Text>
                  <Text style={styles.destSubtitle}>{dest.subtitle}</Text>
                </View>
                {isSelected && (
                  <View style={styles.destCheck}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </>
    );
  }

  function renderDaysStep() {
    return (
      <>
        <Text style={styles.stepTitle}>Quantos dias voce vai ficar?</Text>
        <Text style={styles.stepSubtitle}>
          Escolha a duracao da sua viagem
        </Text>

        <View style={styles.daysRow}>
          {DAY_OPTIONS.map((d) => {
            const isSelected = days === d;
            return (
              <Pressable
                key={d}
                style={[styles.dayCard, isSelected && styles.dayCardSelected]}
                onPress={() => setDays(d)}
              >
                <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                  {d}
                </Text>
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                  dias
                </Text>
              </Pressable>
            );
          })}
        </View>
      </>
    );
  }

  function renderPreferencesStep() {
    const selectedDest = DESTINATIONS.find((d) => d.id === destination);
    const defaultName = selectedDest ? `Viagem para ${selectedDest.name}` : 'Minha viagem';

    return (
      <>
        <Text style={styles.stepTitle}>Personalize sua viagem</Text>
        <Text style={styles.stepSubtitle}>
          Conte-nos sobre suas preferencias
        </Text>

        <Text style={styles.label}>Nome do roteiro</Text>
        <TextInput
          style={styles.input}
          placeholder={defaultName}
          placeholderTextColor={colors.muted}
          value={tripName}
          onChangeText={setTripName}
        />

        <Text style={styles.label}>Orcamento</Text>
        <View style={styles.budgetRow}>
          {BUDGETS.map((b) => {
            const isSelected = budget === b;
            return (
              <Pressable
                key={b}
                style={[styles.budgetCard, isSelected && styles.budgetCardSelected]}
                onPress={() => setBudget(b)}
              >
                <Text style={[styles.budgetText, isSelected && styles.budgetTextSelected]}>
                  {b}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Interesses</Text>
        <View style={styles.interestsGrid}>
          {INTERESTS.map((item) => {
            const isSelected = interests.includes(item.id);
            return (
              <Pressable
                key={item.id}
                style={[styles.interestCard, isSelected && styles.interestCardSelected]}
                onPress={() => toggleInterest(item.id)}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={20}
                  color={isSelected ? '#fff' : colors.muted}
                />
                <Text style={[styles.interestText, isSelected && styles.interestTextSelected]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </>
    );
  }

  function renderGeneratingStep() {
    const selectedDest = DESTINATIONS.find((d) => d.id === destination);

    return (
      <View style={styles.generatingContainer}>
        <View style={styles.generatingIcon}>
          <Ionicons name="sparkles" size={40} color={colors.primary} />
        </View>
        <Text style={styles.generatingTitle}>Criando seu roteiro...</Text>
        <Text style={styles.generatingSubtitle}>
          Estamos montando a viagem perfeita para {selectedDest?.name}
        </Text>

        <View style={styles.generatingSummary}>
          <View style={styles.summaryItem}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <Text style={styles.summaryText}>{selectedDest?.name}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={styles.summaryText}>{days} dias</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="wallet-outline" size={18} color={colors.primary} />
            <Text style={styles.summaryText}>{budget}</Text>
          </View>
        </View>

        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
      </View>
    );
  }

  const stepNumber = step === 'destination' ? 1 : step === 'days' ? 2 : step === 'preferences' ? 3 : 4;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      {step !== 'generating' && (
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Criar roteiro</Text>
          <View style={{ width: 24 }} />
        </View>
      )}

      {/* Progress */}
      {step !== 'generating' && (
        <View style={styles.progress}>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={[
                styles.progressDot,
                n <= stepNumber && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
      )}

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {step === 'destination' && renderDestinationStep()}
        {step === 'days' && renderDaysStep()}
        {step === 'preferences' && renderPreferencesStep()}
        {step === 'generating' && renderGeneratingStep()}
      </ScrollView>

      {/* Footer button */}
      {step !== 'generating' && (
        <View style={styles.footer}>
          <Pressable
            style={[styles.continueButton, !canContinue() && styles.continueButtonDisabled]}
            onPress={handleNext}
            disabled={!canContinue()}
          >
            <Text style={styles.continueButtonText}>
              {step === 'preferences' ? 'Gerar roteiro com IA' : 'Continuar'}
            </Text>
            {step === 'preferences' && (
              <Ionicons name="sparkles" size={18} color="#fff" />
            )}
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 28,
  },

  // Destination step
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  destCard: {
    width: '47%',
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  destCardSelected: {
    borderColor: colors.primary,
  },
  destImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  destOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  destContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  destName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  destSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  destCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Days step
  daysRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 12,
  },
  dayCard: {
    flex: 1,
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dayCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  dayNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  dayNumberSelected: {
    color: '#fff',
  },
  dayLabel: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  dayLabelSelected: {
    color: 'rgba(255,255,255,0.8)',
  },

  // Preferences step
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 10,
  },
  budgetCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  budgetCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  budgetText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  budgetTextSelected: {
    color: '#fff',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  interestCardSelected: {
    backgroundColor: colors.primary,
  },
  interestText: {
    fontSize: 14,
    color: colors.muted,
  },
  interestTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },

  // Generating step
  generatingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  generatingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  generatingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  generatingSubtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  generatingSummary: {
    marginTop: 32,
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryText: {
    fontSize: 15,
    color: colors.text,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 28,
  },
  continueButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
