import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import Footer from '../components/Footer';

Dimensions.get('window');

const PLACES = [
  {
    title: 'Ilhabela',
    subtitle: 'Praias, trilhas e cachoeiras',
    image: require('../assets/images/ilhabela.jpg'),
    slug: 'ilhabela-sp',
  },
  {
    title: 'Paraty',
    subtitle: 'História, natureza e mar',
    image: require('../assets/images/paraty.jpg'),
    slug: 'paraty-rj',
  },
  {
    title: 'Fernando de Noronha',
    subtitle: 'Mergulho e natureza preservada',
    image: require('../assets/images/noronha.jpg'),
    slug: 'fernando-de-noronha',
  },
  {
    title: 'Arraial do Cabo',
    subtitle: 'Mar azul e praias paradisíacas',
    image: require('../assets/images/arraial.jpg'),
    slug: 'arraial-do-cabo',
  },
];

export default function Lugares() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Lugares parecidos com Ubatuba</Text>
          <Text style={styles.subtitle}>
            Descubra destinos com natureza, praias e experiências semelhantes
          </Text>
        </View>

        <View style={styles.list}>
          {PLACES.map((place) => (
            <Pressable
              key={place.slug}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '/place/[slug]',
                  params: { slug: place.slug },
                })
              }
            >
              <Image source={place.image} style={styles.image} />

              <View style={styles.overlay}>
                <Text style={styles.cardTitle}>{place.title}</Text>
                <Text style={styles.cardSubtitle}>{place.subtitle}</Text>

                <Pressable
                  style={styles.button}
                  onPress={() => router.push('/select-days')}
                >
                  <Text style={styles.buttonText}>Criar roteiro</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <Footer active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 24,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },

  list: {
    gap: 20,
  },

  card: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  cardSubtitle: {
    fontSize: 14,
    color: '#eee',
    marginBottom: 12,
  },

  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
