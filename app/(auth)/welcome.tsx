import { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { Link, Href, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';
import Journey from '../../assets/images/Journey.png';

export default function Welcome() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F0FDFA', '#FFFFFF']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.logoBox}>
            <MaterialCommunityIcons
              name="map-marker"
              size={36}
              color={colors.primary}
            />
          </View>
          <Text style={styles.logoText}>Roteirize</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.hero,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.imageContainer}>
            <Image source={Journey} style={styles.image} resizeMode="contain" />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Descubra. Planeje. Viva.</Text>
            <View style={styles.titleUnderline} />
          </View>

          <Text style={styles.subtitle}>
            Crie roteiros de viagens personalizados em minutos e aproveite cada
            momento.
          </Text>

          <View style={styles.features}>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons
                  name="compass-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.featureText}>Roteiros inteligentes</Text>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.featureText}>Economize tempo</Text>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.featureText}>Personalizado para você</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Button
            title="Começar agora"
            onPress={() => router.push('/(auth)/signup')}
          />
          <Link href={'/(auth)/login' as Href} style={styles.link}>
            Já tenho uma conta
          </Link>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  safe: {
    flex: 1,
  },

  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },

  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },

  hero: {
    flex: 1,
    maxHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginVertical: 20,
  },

  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  content: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: 'center',
  },

  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },

  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 8,
  },

  feature: {
    alignItems: 'center',
    flex: 1,
  },

  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  featureText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    fontWeight: '600',
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },

  link: {
    marginTop: 20,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});
