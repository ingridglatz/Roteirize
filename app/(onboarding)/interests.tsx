import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  View,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import Button from '../../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const INTERESTS = [
  { id: 'beach', icon: 'beach' },
  { id: 'nature', icon: 'leaf' },
  { id: 'culture', icon: 'bank' },
  { id: 'nightlife', icon: 'glass-cocktail' },
  { id: 'adventure', icon: 'compass' },
  { id: 'gastronomy', icon: 'silverware-fork-knife' },
  { id: 'history', icon: 'castle' },
  { id: 'sports', icon: 'run' },
  { id: 'shopping', icon: 'shopping' },
  { id: 'relaxation', icon: 'spa' },
  { id: 'photography', icon: 'camera' },
  { id: 'music', icon: 'music' },
];

const MIN_SELECTIONS = 3;

export default function Interests() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setInterests } = useOnboarding();
  const [selected, setSelected] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const isValid = selected.length >= MIN_SELECTIONS;

  function toggleInterest(item: string) {
    setShowError(false);
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  }

  function handleContinue() {
    if (!isValid) {
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

    setInterests(selected);
    router.push('/(onboarding)/travel-style');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('onboarding.interests.title')}</Text>
          <Text style={styles.subtitle}>
            {t('onboarding.interests.subtitle', { count: MIN_SELECTIONS })}
          </Text>

          <Animated.View
            style={[
              styles.counter,
              { transform: [{ translateX: shakeAnimation }] },
            ]}
          >
            <Text
              style={[styles.counterText, isValid && styles.counterTextValid]}
            >
              {t('onboarding.interests.counter', { selected: selected.length, required: MIN_SELECTIONS })}
            </Text>
            {isValid && (
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color={colors.primary}
              />
            )}
          </Animated.View>

          {showError && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={16}
                color="#ef4444"
              />
              <Text style={styles.errorText}>
                {t('onboarding.interests.errorMinimum', { count: MIN_SELECTIONS })}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.grid}>
          {INTERESTS.map((item) => {
            const isActive = selected.includes(item.id);

            return (
              <Pressable
                key={item.id}
                onPress={() => toggleInterest(item.id)}
                style={({ pressed }) => [
                  styles.card,
                  isActive && styles.cardActive,
                  pressed && styles.cardPressed,
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    isActive && styles.iconContainerActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={28}
                    color={isActive ? '#fff' : colors.primary}
                  />
                </View>
                <Text
                  style={[styles.cardText, isActive && styles.cardTextActive]}
                >
                  {t('onboarding.interests.' + item.id)}
                </Text>

                {isActive && (
                  <View style={styles.checkmark}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={22}
                      color={colors.primary}
                    />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

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
    paddingBottom: 32,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    alignSelf: 'center',
  },

  counterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
  },

  counterTextValid: {
    color: colors.primary,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
  },

  errorText: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '500',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },

  card: {
    width: '48%',
    aspectRatio: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  cardActive: {
    backgroundColor: '#f0f9ff',
    borderColor: colors.primary,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  iconContainerActive: {
    backgroundColor: colors.primary,
  },

  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },

  cardTextActive: {
    color: colors.primary,
  },

  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  actions: {
    marginTop: 'auto',
    paddingTop: 16,
  },
});
