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
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import Button from '../../components/Button';
import { useOnboarding } from '../../context/OnboardingContext';

type Option = 'economic' | 'moderate' | 'luxury';
type Pace = 'relaxed' | 'balanced' | 'intense';

interface BudgetOption {
  id: Option;
  labelKey: string;
  descKey: string;
}

interface PaceOption {
  id: Pace;
  labelKey: string;
  descKey: string;
}

const budgetOptions: BudgetOption[] = [
  {
    id: 'economic',
    labelKey: 'onboarding.travelStyle.economic',
    descKey: 'onboarding.travelStyle.economicDesc',
  },
  {
    id: 'moderate',
    labelKey: 'onboarding.travelStyle.moderate',
    descKey: 'onboarding.travelStyle.moderateDesc',
  },
  {
    id: 'luxury',
    labelKey: 'onboarding.travelStyle.luxury',
    descKey: 'onboarding.travelStyle.luxuryDesc',
  },
];

const paceOptions: PaceOption[] = [
  {
    id: 'relaxed',
    labelKey: 'onboarding.travelStyle.relaxed',
    descKey: 'onboarding.travelStyle.relaxedDesc',
  },
  {
    id: 'balanced',
    labelKey: 'onboarding.travelStyle.balanced',
    descKey: 'onboarding.travelStyle.balancedDesc',
  },
  {
    id: 'intense',
    labelKey: 'onboarding.travelStyle.intense',
    descKey: 'onboarding.travelStyle.intenseDesc',
  },
];

export default function TravelStyle() {
  const { t } = useTranslation();
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
        <Text style={styles.title}>{t('onboarding.travelStyle.title')}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('onboarding.travelStyle.budgetSection')}</Text>
          <View style={styles.optionsContainer}>
            {budgetOptions.map((option) => {
              const active = budget === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => handleBudgetSelect(option.id)}
                  style={[styles.optionCard, active && styles.optionCardActive]}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionTitle,
                        active && styles.optionTitleActive,
                      ]}
                    >
                      {t(option.labelKey)}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        active && styles.optionDescriptionActive,
                      ]}
                    >
                      {t(option.descKey)}
                    </Text>
                  </View>
                  {active && <View style={styles.activeIndicator} />}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('onboarding.travelStyle.paceSection')}</Text>
          <View style={styles.optionsContainer}>
            {paceOptions.map((option) => {
              const active = pace === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => handlePaceSelect(option.id)}
                  style={[styles.optionCard, active && styles.optionCardActive]}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionTitle,
                        active && styles.optionTitleActive,
                      ]}
                    >
                      {t(option.labelKey)}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        active && styles.optionDescriptionActive,
                      ]}
                    >
                      {t(option.descKey)}
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
              {t('onboarding.travelStyle.errorSelectBoth')}
            </Text>
          </Animated.View>
        )}

        <View style={styles.actions}>
          <Button title={t('common.continue')} onPress={handleContinue} />
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
