import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Link, Href, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';
import Journey from '../../assets/images/Journey.png';

export default function Welcome() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.logoContainer}>
        <MaterialCommunityIcons
          name="map-marker"
          size={42}
          color={colors.primary}
        />
        <Text style={styles.logoText}>Roteirize</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={Journey} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Descubra. Planeje. Viva.</Text>

        <Text style={styles.subtitle}>
          Crie roteiros de viagens personalizados em minutos e aproveite cada
          momento.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button title="Comecar agora" onPress={() => router.push('/(auth)/signup')} />

        <Link href={'/(auth)/login' as Href} style={styles.link}>
          Ja tenho uma conta
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 24,
  },

  logoText: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },

  imageContainer: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  textContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 32,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    marginTop: 'auto',
  },

  link: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '500',
  },
});
