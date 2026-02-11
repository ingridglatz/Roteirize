import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_GAP = 2;
const PHOTO_SIZE = (SCREEN_WIDTH - PHOTO_GAP * 2) / 3;

type TripData = {
  title: string;
  date: string;
  location: string;
  description: string;
  coverImage: any;
  photos: { id: string; uri: string }[];
  stats: { days: number; cities: number; photos: number };
};

function getTripData(t: (key: string) => string): Record<string, TripData> {
  return {
    '1': {
      title: t('mockData.tripItalyTitle'),
      date: t('mockData.tripItalyDate'),
      location: t('mockData.tripItalyLocation'),
      description: t('mockData.tripItalyDesc'),
      coverImage: require('../../assets/images/italia.jpg'),
      photos: [
        { id: '1', uri: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' },
        { id: '2', uri: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400' },
        { id: '3', uri: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=400' },
        { id: '4', uri: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=400' },
        { id: '5', uri: 'https://images.unsplash.com/photo-1513805959324-96eb66ca8713?w=400' },
        { id: '6', uri: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400' },
      ],
      stats: { days: 14, cities: 3, photos: 247 },
    },
    '2': {
      title: t('mockData.tripJapanTitle'),
      date: t('mockData.tripJapanDate'),
      location: t('mockData.tripJapanLocation'),
      description: t('mockData.tripJapanDesc'),
      coverImage: require('../../assets/images/japao.jpg'),
      photos: [
        { id: '1', uri: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400' },
        { id: '2', uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400' },
        { id: '3', uri: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400' },
        { id: '4', uri: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400' },
        { id: '5', uri: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400' },
        { id: '6', uri: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=400' },
      ],
      stats: { days: 21, cities: 3, photos: 412 },
    },
    '3': {
      title: t('mockData.tripTurkeyTitle'),
      date: t('mockData.tripTurkeyDate'),
      location: t('mockData.tripTurkeyLocation'),
      description: t('mockData.tripTurkeyDesc'),
      coverImage: require('../../assets/images/turquia.jpg'),
      photos: [
        { id: '1', uri: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400' },
        { id: '2', uri: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400' },
        { id: '3', uri: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400' },
        { id: '4', uri: 'https://images.unsplash.com/photo-1589561454226-796a8aa89b05?w=400' },
        { id: '5', uri: 'https://images.unsplash.com/photo-1604941807599-b89a5a0d29f9?w=400' },
        { id: '6', uri: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=400' },
      ],
      stats: { days: 10, cities: 2, photos: 189 },
    },
  };
}

export default function TripAlbum() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const tripData = useMemo(() => getTripData(t), [t]);
  const trip = tripData[id || '1'];

  if (!trip) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('trip.notFound')}</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Image with Gradient */}
        <View style={styles.coverContainer}>
          <Image source={trip.coverImage} style={styles.coverImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.7)']}
            style={styles.coverGradient}
          />

          {/* Header Buttons */}
          <SafeAreaView style={styles.headerButtons}>
            <Pressable
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
            <Pressable style={styles.headerButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
            </Pressable>
          </SafeAreaView>

          {/* Cover Info */}
          <View style={styles.coverInfo}>
            <Text style={styles.coverTitle}>{trip.title}</Text>
            <View style={styles.coverMeta}>
              <Ionicons name="calendar-outline" size={14} color="#FFFFFF" />
              <Text style={styles.coverDate}>{trip.date}</Text>
            </View>
            <View style={styles.coverMeta}>
              <Ionicons name="location-outline" size={14} color="#FFFFFF" />
              <Text style={styles.coverLocation}>{trip.location}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{trip.stats.days}</Text>
            <Text style={styles.statLabel}>{t('common.days')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{trip.stats.cities}</Text>
            <Text style={styles.statLabel}>{t('trip.cities')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{trip.stats.photos}</Text>
            <Text style={styles.statLabel}>{t('common.photos')}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{trip.description}</Text>
        </View>

        {/* Photos Grid */}
        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>{t('trip.photos')}</Text>
          <View style={styles.photosGrid}>
            {trip.photos.map((photo) => (
              <Pressable key={photo.id} style={styles.photoItem}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  coverContainer: {
    height: 320,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverInfo: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  coverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  coverDate: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  coverLocation: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  photosSection: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PHOTO_GAP,
  },
  photoItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
