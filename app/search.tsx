import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  TextInput,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { colors } from '../theme/colors';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');

const FILTERS = ['Praia', 'Montanha', 'Urbano', 'Aventura'];

const DESTINATIONS = [
  {
    title: 'Ibiza, Espanha',
    rating: 4.8,
    image: require('../assets/images/ibiza.jpg'),
  },
  {
    title: 'Santorini, Grécia',
    rating: 4.5,
    image: require('../assets/images/santorini.jpg'),
  },
  {
    title: 'Bali, Indonésia',
    rating: 4.9,
    image: require('../assets/images/bali.jpg'),
  },
  {
    title: 'Ubatuba, Brasil',
    rating: 3.9,
    image: require('../assets/images/ubatuba.jpg'),
  },
];

export default function Search() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('Praia');
  const [loading, setLoading] = useState(true);

  const scaleAnim = useRef(
    FILTERS.reduce(
      (acc, item) => {
        acc[item] = new Animated.Value(1);
        return acc;
      },
      {} as Record<string, Animated.Value>,
    ),
  ).current;

  const cardsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLoading(true);
    cardsAnim.setValue(0);

    const timer = setTimeout(() => {
      setLoading(false);

      Animated.timing(cardsAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 1200);

    return () => clearTimeout(timer);
  }, [activeFilter, cardsAnim]);

  function animateFilter(item: string) {
    Animated.sequence([
      Animated.timing(scaleAnim[item], {
        toValue: 0.95,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim[item], {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={28}
              color={colors.primary}
            />
            <Text style={styles.logoText}>Roteirize</Text>
          </View>

          <View style={styles.searchBox}>
            <TextInput
              placeholder="Para onde vamos?"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
            <MaterialCommunityIcons
              name="magnify"
              size={22}
              color={colors.muted}
            />
          </View>
        </View>

        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {FILTERS.map((item) => {
              const active = item === activeFilter;

              return (
                <Pressable
                  key={item}
                  onPress={() => {
                    setActiveFilter(item);
                    animateFilter(item);
                  }}
                >
                  <Animated.View
                    style={[
                      styles.filter,
                      active && styles.filterActive,
                      { transform: [{ scale: scaleAnim[item] }] },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        active && styles.filterTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </Animated.View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.grid}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : DESTINATIONS.map((item) => (
                <Animated.View
                  key={item.title}
                  style={{
                    opacity: cardsAnim,
                    transform: [
                      {
                        translateY: cardsAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <Pressable
                    style={styles.card}
                    onPress={() => router.push('/home')}
                  >
                    <Image source={item.image} style={styles.cardImage} />
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{item.title}</Text>

                      <View style={styles.cardFooter}>
                        <Text style={styles.cardAction}>Criar roteiro</Text>
                        <View style={styles.rating}>
                          <Text>{item.rating}</Text>
                          <MaterialCommunityIcons
                            name="star"
                            size={14}
                            color="#FFC107"
                          />
                        </View>
                      </View>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <Footer active={'search'} />
    </SafeAreaView>
  );
}

function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: '40%' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingBottom: 24,
  },

  header: {
    padding: 24,
    paddingBottom: 12,
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },

  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },

  filtersWrapper: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  filters: {
    flexDirection: 'row',
    gap: 12,
  },

  filter: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterText: {
    fontSize: 14,
    color: colors.text,
  },

  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  grid: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },

  card: {
    width: (width - 24 * 2 - 16) / 2,
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  cardContent: {
    padding: 12,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardAction: {
    fontSize: 13,
    color: colors.muted,
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    fontSize: 13,
    color: colors.text,
  },

  footer: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    height: 68,
    backgroundColor: '#fff',
    borderRadius: 34,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  skeletonCard: {
    width: (width - 24 * 2 - 16) / 2,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 20,
  },

  skeletonImage: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },

  skeletonLine: {
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 7,
    marginBottom: 8,
  },
});
