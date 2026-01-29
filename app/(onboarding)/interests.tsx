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
import { colors } from '../../theme/colors';
import Button from '../../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const INTERESTS = [
  { label: 'Praia', icon: 'beach' },
  { label: 'Natureza', icon: 'leaf' },
  { label: 'Cultura', icon: 'bank' },
  { label: 'Vida noturna', icon: 'glass-cocktail' },
  { label: 'Aventura', icon: 'compass' },
  { label: 'Gastronomia', icon: 'silverware-fork-knife' },
  { label: 'História', icon: 'castle' },
  { label: 'Esportes', icon: 'run' },
  { label: 'Compras', icon: 'shopping' },
  { label: 'Relaxamento', icon: 'spa' },
  { label: 'Fotografia', icon: 'camera' },
  { label: 'Música', icon: 'music' },
];

const MIN_SELECTIONS = 3;

export default function Interests() {
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
          <Text style={styles.title}>Quais são seus interesses?</Text>
          <Text style={styles.subtitle}>
            Selecione pelo menos {MIN_SELECTIONS} opções para personalizarmos
            sua experiência
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
              {selected.length} de {MIN_SELECTIONS} selecionados
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
                Selecione pelo menos {MIN_SELECTIONS} interesses para continuar
              </Text>
            </View>
          )}
        </View>

        <View style={styles.grid}>
          {INTERESTS.map((item) => {
            const isActive = selected.includes(item.label);

            return (
              <Pressable
                key={item.label}
                onPress={() => toggleInterest(item.label)}
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
                  {item.label}
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
