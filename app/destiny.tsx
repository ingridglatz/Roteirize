import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Itinerary } from '../types/Itinerary';
import { useItineraries } from '../context/ItinerariesContext';

const DEST_IMAGES: Record<string, any> = {
  ubatuba: require('../assets/images/ubatuba.jpg'),
  ilhabela: require('../assets/images/ilhabela.jpg'),
  paraty: require('../assets/images/paraty.jpg'),
  noronha: require('../assets/images/noronha.jpg'),
  arraial: require('../assets/images/arraial.jpg'),
  santorini: require('../assets/images/santorini.jpg'),
  bali: require('../assets/images/bali.jpg'),
  ibiza: require('../assets/images/ibiza.jpg'),
};

function getDestImage(destinationId: string) {
  return DEST_IMAGES[destinationId] ?? DEST_IMAGES['ubatuba'];
}

type CardProps = {
  item: Itinerary;
  onPress: () => void;
  onEditTitle: (id: string, title: string) => void;
  onDelete: (id: string) => void;
};

function ItineraryCard({ item, onPress, onEditTitle, onDelete }: CardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.title);

  function handleSave() {
    const trimmed = draft.trim();
    if (trimmed) {
      onEditTitle(item.id, trimmed);
    } else {
      setDraft(item.title);
    }
    setEditing(false);
  }

  function handleDelete() {
    Alert.alert(
      'Excluir roteiro',
      `Deseja excluir "${item.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDelete(item.id) },
      ],
    );
  }

  const budgetLabel =
    item.budget === 'Econômico' ? '$' : item.budget === 'Moderado' ? '$$' : '$$$';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={getDestImage(item.destinationId)} style={styles.cardImage} />

      <View style={styles.cardBody}>
        {editing ? (
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onBlur={handleSave}
            onSubmitEditing={handleSave}
            autoFocus
            style={styles.titleInput}
            selectTextOnFocus
          />
        ) : (
          <Pressable onLongPress={() => setEditing(true)}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </Pressable>
        )}

        <Text style={styles.cardSubtitle}>
          {item.destinationName} · {item.days} dia{item.days !== 1 ? 's' : ''}
        </Text>

        <View style={styles.cardTags}>
          <View style={styles.tag}>
            <Ionicons name="wallet-outline" size={12} color={colors.primary} />
            <Text style={styles.tagText}>{budgetLabel}</Text>
          </View>
          {item.interests.slice(0, 2).map((interest) => (
            <View key={interest} style={styles.tag}>
              <Text style={styles.tagText}>{interest}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardActions}>
          <Pressable
            style={styles.cardActionBtn}
            onPress={() => setEditing(true)}
            hitSlop={8}
          >
            <Ionicons name="pencil-outline" size={16} color={colors.muted} />
          </Pressable>
          <Pressable style={styles.cardActionBtn} onPress={handleDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={16} color="#E53935" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="map-outline" size={64} color={colors.disabled} />
      <Text style={styles.emptyTitle}>Nenhum roteiro ainda</Text>
      <Text style={styles.emptyText}>
        Crie seu primeiro roteiro personalizado e ele aparecera aqui.
      </Text>
      <Pressable style={styles.emptyButton} onPress={onCreate}>
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.emptyButtonText}>Criar roteiro</Text>
      </Pressable>
    </View>
  );
}

export default function Destiny() {
  const router = useRouter();
  const { itineraries, updateItinerary, deleteItinerary } = useItineraries();

  function handleEditTitle(id: string, title: string) {
    updateItinerary(id, { title });
  }

  function handleCreate() {
    router.push('/itineraries/create');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Roteiros</Text>
        <Text style={styles.headerCount}>
          {itineraries.length} roteiro{itineraries.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={itineraries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          itineraries.length === 0 ? styles.emptyList : styles.listContent
        }
        renderItem={({ item }) => (
          <ItineraryCard
            item={item}
            onPress={() => router.push(`/itineraries/${item.id}`)}
            onEditTitle={handleEditTitle}
            onDelete={deleteItinerary}
          />
        )}
        ListEmptyComponent={<EmptyState onCreate={handleCreate} />}
        showsVerticalScrollIndicator={false}
      />

      {itineraries.length > 0 && (
        <Pressable style={styles.fab} onPress={handleCreate}>
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  headerCount: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },

  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  titleInput: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 4,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  cardTags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
  },
  cardActionBtn: {
    padding: 6,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 24,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
