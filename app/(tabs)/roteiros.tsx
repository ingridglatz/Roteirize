import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoteiros } from '../../context/RoteirosContext';
import { useTheme } from '../../context/ThemeContext';
import { getColors } from '../../theme/colors';
import { Itinerary } from '../../types/Itinerary';

Dimensions.get('window');

const DESTINATION_IMAGES: Record<string, any> = {
  ubatuba: require('../../assets/images/ubatuba.jpg'),
  paraty: require('../../assets/images/praia2.jpg'),
  floripa: require('../../assets/images/praia1.jpg'),
  buzios: require('../../assets/images/praia3.jpg'),
};

function EmptyState({
  onPress,
  colors,
  styles,
}: {
  onPress: () => void;
  colors: any;
  styles: any;
}) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="map-outline" size={48} color={colors.muted} />
      </View>
      <Text style={styles.emptyTitle}>Nenhum roteiro ainda</Text>
      <Text style={styles.emptyText}>
        Crie seu primeiro roteiro personalizado e comece a planejar sua proxima
        aventura!
      </Text>
      <Pressable style={styles.emptyButton} onPress={onPress}>
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.emptyButtonText}>Criar roteiro</Text>
      </Pressable>
    </View>
  );
}

function ItineraryCard({
  item,
  onPress,
  onDelete,
  styles,
}: {
  item: Itinerary;
  onPress: () => void;
  onDelete: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  const image =
    DESTINATION_IMAGES[item.destinationId] || DESTINATION_IMAGES.ubatuba;
  const places = item.dailyPlan.flatMap((day) => day.places).filter(Boolean);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.cardImage} />
      <View style={styles.cardGradient} />
      <View style={styles.cardContent}>
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>{item.days} dias</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <Ionicons
            name="location-outline"
            size={14}
            color="rgba(255,255,255,0.8)"
          />
          <Text style={styles.cardMetaText}>{item.destinationName}</Text>
        </View>
        {places.length > 0 && (
          <View style={styles.cardPlaces}>
            <Text style={styles.cardPlacesText} numberOfLines={1}>
              {places.join(' · ')}
            </Text>
          </View>
        )}
      </View>
      <Pressable
        style={styles.cardDelete}
        onPress={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Ionicons name="trash-outline" size={18} color="#fff" />
      </Pressable>
    </Pressable>
  );
}

export default function Roteiros() {
  const router = useRouter();
  const { roteiros, deleteRoteiro } = useRoteiros();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  function handleCreatePress() {
    router.push('/(tabs)/create');
  }

  function handleItineraryPress(id: string) {
    router.push(`/itinerary/${id}`);
  }

  function handleDelete(id: string) {
    Alert.alert(
      'Excluir roteiro',
      'Tem certeza que deseja excluir este roteiro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteRoteiro(id);
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Roteiros</Text>
        <Text style={styles.headerSubtitle}>
          {roteiros.length} roteiro{roteiros.length !== 1 ? 's' : ''} criado
          {roteiros.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {roteiros.length === 0 ? (
        <EmptyState
          onPress={handleCreatePress}
          colors={undefined}
          styles={undefined}
        />
      ) : (
        <FlatList
          data={roteiros}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ItineraryCard
              item={item}
              onPress={() => handleItineraryPress(item.id)}
              onDelete={() => handleDelete(item.id)}
              styles={styles}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 20,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 4,
    },
    list: {
      paddingHorizontal: 24,
      paddingBottom: 90,
    },
    card: {
      width: '100%',
      height: 200,
      borderRadius: 20,
      marginBottom: 16,
      overflow: 'hidden',
      backgroundColor: colors.card,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    cardImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    cardGradient: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    cardContent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
    },
    cardBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      marginBottom: 8,
    },
    cardBadgeText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '700',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#fff',
      marginBottom: 4,
    },
    cardMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    cardMetaText: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.8)',
    },
    cardPlaces: {
      marginTop: 6,
    },
    cardPlacesText: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.7)',
    },
    cardDelete: {
      position: 'absolute',
      top: 14,
      right: 14,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 48,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.muted,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
    emptyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 28,
    },
    emptyButtonText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '700',
    },
  });
}
