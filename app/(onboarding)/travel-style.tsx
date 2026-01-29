import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  View,
  Animated,
} from 'react-native';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import Button from '../../components/Button';
import { useOnboarding } from '../../context/OnboardingContext';

type Option = 'Econômico' | 'Moderado' | 'Luxo';
type Pace = 'Tranquilo' | 'Equilibrado' | 'Intenso';

interface BudgetOption {
  value: Option;
  description: string;
}

interface PaceOption {
  value: Pace;
  description: string;
}

const budgetOptions: BudgetOption[] = [
  {
    value: 'Econômico',
    description: 'Viagem com foco em economia',
  },
  {
    value: 'Moderado',
    description: 'Equilíbrio entre custo e conforto',
  },
  {
    value: 'Luxo',
    description: 'Experiências premium e exclusivas',
  },
];

const paceOptions: PaceOption[] = [
  {
    value: 'Tranquilo',
    description: 'Mais tempo para relaxar',
  },
  {
    value: 'Equilibrado',
    description: 'Mix de atividades e descanso',
  },
  {
    value: 'Intenso',
    description: 'Muitas atividades e aventuras',
  },
];

export default function TravelStyle() {
  const router = useRouter();
  const { setBudget, setPace } = useOnboarding();

  const [budget, setLocalBudget] = useState<Option | null>(null);
  const [pace, setLocalPace] = useState<Pace | null>(null);
  const [showError, setShowError] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  function handleContinue() {
    if (!budget || !pace) {
      setShowError(true);
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    setBudget(budget);
    setPace(pace);
    router.push('/(onboarding)/loading');
  }

  function handleBudgetSelect(value: Option) {
    setLocalBudget(value);
    if (showError) setShowError(false);
  }

  function handlePaceSelect(value: Pace) {
    setLocalPace(value);
    if (showError) setShowError(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Seu estilo de viagem</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orçamento</Text>
          <View style={styles.optionsContainer}>
            {budgetOptions.map((option) => {
              const active = budget === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleBudgetSelect(option.value)}
                  style={[styles.optionCard, active && styles.optionCardActive]}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionTitle,
                        active && styles.optionTitleActive,
                      ]}
                    >
                      {option.value}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        active && styles.optionDescriptionActive,
                      ]}
                    >
                      {option.description}
                    </Text>
                  </View>
                  {active && <View style={styles.activeIndicator} />}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ritmo</Text>
          <View style={styles.optionsContainer}>
            {paceOptions.map((option) => {
              const active = pace === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => handlePaceSelect(option.value)}
                  style={[styles.optionCard, active && styles.optionCardActive]}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionTitle,
                        active && styles.optionTitleActive,
                      ]}
                    >
                      {option.value}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        active && styles.optionDescriptionActive,
                      ]}
                    >
                      {option.description}
                    </Text>
                  </View>
                  {active && <View style={styles.activeIndicator} />}
                </Pressable>
              );
            })}
          </View>
        </View>

        {showError && (
          <Animated.View
            style={[
              styles.errorContainer,
              { transform: [{ translateX: shakeAnimation }] },
            ]}
          >
            <Text style={styles.errorText}>
              Selecione o orçamento e o ritmo para continuar
            </Text>
          </Animated.View>
        )}

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
    paddingTop: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 40,
    letterSpacing: -0.5,
  },

  section: {
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  optionsContainer: {
    gap: 10,
  },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },

  optionCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },

  optionTitleActive: {
    color: colors.primary,
  },

  optionDescription: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },

  optionDescriptionActive: {
    color: colors.text,
  },

  activeIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginLeft: 12,
  },

  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },

  errorText: {
    fontSize: 13,
    color: colors.error,
    lineHeight: 18,
  },

  actions: {
    marginTop: 'auto',
    paddingTop: 20,
    paddingBottom: 16,
  },
});
