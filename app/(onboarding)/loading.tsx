import { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';

const REDIRECT_DELAY_MS = 3000;

export default function Loading() {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/(tabs)/explorar'), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/loading.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          {t('onboarding.loading.title')}
        </Text>

        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  image: {
    width: '100%',
    height: 260,
    marginBottom: 32,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 30,
  },

  loader: {
    marginTop: 8,
  },
});
