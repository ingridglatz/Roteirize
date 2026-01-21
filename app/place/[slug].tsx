import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '../../theme/colors';

const PLACES = {
  'praia-do-felix': {
    title: 'Praia do Félix',
    image: require('../../assets/images/praia1.jpg'),
    description:
      'Uma das praias mais bonitas de Ubatuba, com águas cristalinas e natureza preservada.',
  },
  'ilha-anchieta': {
    title: 'Ilha Anchieta',
    image: require('../../assets/images/praia2.jpg'),
    description:
      'Ilha histórica com trilhas, praias paradisíacas e acesso por barco.',
  },
  'praia-almada': {
    title: 'Praia Almada',
    image: require('../../assets/images/praia3.jpg'),
    description:
      'Praia extensa, ótima para famílias e com restaurantes locais.',
  },
};

export default function PlaceDetails() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const place = slug ? PLACES[slug as keyof typeof PLACES] : null;

  if (!place) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text>Lugar não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Image source={place.image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{place.title}</Text>
        <Text style={styles.text}>{place.description}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 260,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },
});
