import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';

export default function Loading() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/loading.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Estamos criando a viagem{'\n'}dos seus sonhos...
        </Text>

        <ActivityIndicator
          size="large"
          color={colors.text}
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
