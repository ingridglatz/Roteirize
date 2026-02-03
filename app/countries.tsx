import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useState } from 'react';
import { getCountryFlag, getCountryImageUrl } from '../utils/countryUtils';

type Visit = {
  id: string;
  startDate: string;
  endDate: string;
};

type Country = {
  id: string;
  name: string;
  flag: string;
  visits: Visit[];
  cities: string[];
  image: any;
  imageUrl?: string;
};

const INITIAL_COUNTRIES: Country[] = [
  {
    id: '1',
    name: 'Italia',
    flag: '🇮🇹',
    visits: [
      { id: '1', startDate: 'Out 2024', endDate: 'Out 2024' },
      { id: '2', startDate: 'Jun 2023', endDate: 'Jul 2023' },
      { id: '3', startDate: 'Dez 2022', endDate: 'Jan 2023' },
    ],
    cities: ['Roma', 'Milao', 'Veneza', 'Florenca', 'Napoles', 'Turim', 'Bologna', 'Verona'],
    image: require('../assets/images/italia.jpg'),
  },
  {
    id: '2',
    name: 'Japao',
    flag: '🇯🇵',
    visits: [
      { id: '1', startDate: 'Mar 2025', endDate: 'Mar 2025' },
      { id: '2', startDate: 'Abr 2024', endDate: 'Mai 2024' },
    ],
    cities: ['Toquio', 'Quioto', 'Osaka', 'Hiroshima', 'Nara', 'Yokohama'],
    image: require('../assets/images/japao.jpg'),
  },
  {
    id: '3',
    name: 'Turquia',
    flag: '🇹🇷',
    visits: [{ id: '1', startDate: 'Dez 2023', endDate: 'Dez 2023' }],
    cities: ['Istambul', 'Capadocia', 'Antalya', 'Izmir'],
    image: require('../assets/images/turquia.jpg'),
  },
  {
    id: '4',
    name: 'Franca',
    flag: '🇫🇷',
    visits: [
      { id: '1', startDate: 'Jul 2024', endDate: 'Ago 2024' },
      { id: '2', startDate: 'Set 2022', endDate: 'Set 2022' },
    ],
    cities: ['Paris', 'Nice', 'Lyon', 'Marselha', 'Bordeaux'],
    image: require('../assets/images/italia.jpg'),
  },
  {
    id: '5',
    name: 'Espanha',
    flag: '🇪🇸',
    visits: [
      { id: '1', startDate: 'Mai 2024', endDate: 'Mai 2024' },
      { id: '2', startDate: 'Fev 2023', endDate: 'Fev 2023' },
    ],
    cities: ['Madrid', 'Barcelona', 'Sevilha', 'Valencia', 'Granada', 'Bilbao', 'Malaga'],
    image: require('../assets/images/turquia.jpg'),
  },
  {
    id: '6',
    name: 'Portugal',
    flag: '🇵🇹',
    visits: [
      { id: '1', startDate: 'Jan 2024', endDate: 'Jan 2024' },
      { id: '2', startDate: 'Nov 2023', endDate: 'Nov 2023' },
      { id: '3', startDate: 'Jun 2022', endDate: 'Jun 2022' },
    ],
    cities: ['Lisboa', 'Porto', 'Sintra', 'Faro'],
    image: require('../assets/images/japao.jpg'),
  },
  {
    id: '7',
    name: 'Reino Unido',
    flag: '🇬🇧',
    visits: [{ id: '1', startDate: 'Ago 2023', endDate: 'Ago 2023' }],
    cities: ['Londres', 'Edimburgo', 'Manchester'],
    image: require('../assets/images/italia.jpg'),
  },
  {
    id: '8',
    name: 'Alemanha',
    flag: '🇩🇪',
    visits: [
      { id: '1', startDate: 'Nov 2023', endDate: 'Nov 2023' },
      { id: '2', startDate: 'Jul 2022', endDate: 'Jul 2022' },
    ],
    cities: ['Berlim', 'Munique', 'Frankfurt', 'Hamburgo', 'Colonia'],
    image: require('../assets/images/turquia.jpg'),
  },
  {
    id: '9',
    name: 'Estados Unidos',
    flag: '🇺🇸',
    visits: [
      { id: '1', startDate: 'Abr 2024', endDate: 'Abr 2024' },
      { id: '2', startDate: 'Dez 2022', endDate: 'Jan 2023' },
    ],
    cities: ['Nova York', 'Los Angeles', 'Miami', 'San Francisco', 'Las Vegas', 'Chicago'],
    image: require('../assets/images/japao.jpg'),
  },
  {
    id: '10',
    name: 'Argentina',
    flag: '🇦🇷',
    visits: [{ id: '1', startDate: 'Fev 2024', endDate: 'Fev 2024' }],
    cities: ['Buenos Aires', 'Mendoza', 'Bariloche'],
    image: require('../assets/images/italia.jpg'),
  },
  {
    id: '11',
    name: 'Chile',
    flag: '🇨🇱',
    visits: [{ id: '1', startDate: 'Fev 2024', endDate: 'Fev 2024' }],
    cities: ['Santiago', 'Valparaiso'],
    image: require('../assets/images/turquia.jpg'),
  },
  {
    id: '12',
    name: 'Peru',
    flag: '🇵🇪',
    visits: [{ id: '1', startDate: 'Mar 2024', endDate: 'Mar 2024' }],
    cities: ['Lima', 'Cusco'],
    image: require('../assets/images/japao.jpg'),
  },
];

function CountryCard({
  country,
  onPress,
}: {
  country: Country;
  onPress: () => void;
}) {
  const lastVisit = country.visits[0];
  return (
    <Pressable
      style={styles.countryCard}
      onPress={onPress}
      android_ripple={{ color: colors.border }}
    >
      {({ pressed }) => (
        <View style={[styles.cardInner, { opacity: pressed ? 0.8 : 1 }]}>
          <Image
            source={country.imageUrl ? { uri: country.imageUrl } : country.image}
            style={styles.countryImage}
          />
          <View style={styles.countryOverlay} />
          <View style={styles.countryContent}>
            <Text style={styles.countryFlag}>{country.flag}</Text>
            <Text style={styles.countryName}>{country.name}</Text>
            <View style={styles.countryStats}>
              <View style={styles.statItem}>
                <Ionicons name="repeat" size={14} color="#FFF" />
                <Text style={styles.statText}>{country.visits.length} visitas</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="location" size={14} color="#FFF" />
                <Text style={styles.statText}>{country.cities.length} cidades</Text>
              </View>
            </View>
            {lastVisit && (
              <Text style={styles.lastVisit}>Ultima visita: {lastVisit.startDate}</Text>
            )}
          </View>
          <View style={styles.editIndicator}>
            <Ionicons name="pencil" size={14} color="#FFF" />
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default function Countries() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>(INITIAL_COUNTRIES);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [newCityName, setNewCityName] = useState('');
  const [newVisitStart, setNewVisitStart] = useState('');
  const [newVisitEnd, setNewVisitEnd] = useState('');

  // Calculate totals
  const totalCountries = countries.length;
  const totalVisits = countries.reduce((sum, c) => sum + c.visits.length, 0);
  const totalCities = countries.reduce((sum, c) => sum + c.cities.length, 0);

  function handleBack() {
    router.back();
  }

  function handleCountryPress(country: Country) {
    setEditingCountry({ ...country, visits: [...country.visits], cities: [...country.cities] });
    setNewCityName('');
    setNewVisitStart('');
    setNewVisitEnd('');
    setModalVisible(true);
  }

  function handleAddCity() {
    if (!editingCountry) return;
    const trimmed = newCityName.trim();
    if (!trimmed) {
      Alert.alert('Erro', 'Digite o nome da cidade');
      return;
    }
    if (editingCountry.cities.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert('Erro', 'Esta cidade ja foi adicionada');
      return;
    }
    setEditingCountry({
      ...editingCountry,
      cities: [...editingCountry.cities, trimmed],
    });
    setNewCityName('');
  }

  function handleRemoveCity(index: number) {
    if (!editingCountry) return;
    setEditingCountry({
      ...editingCountry,
      cities: editingCountry.cities.filter((_, i) => i !== index),
    });
  }

  function handleAddVisit() {
    if (!editingCountry) return;
    if (!newVisitStart.trim()) {
      Alert.alert('Erro', 'Digite a data de ida');
      return;
    }
    const newVisit: Visit = {
      id: Date.now().toString(),
      startDate: newVisitStart.trim(),
      endDate: newVisitEnd.trim() || newVisitStart.trim(),
    };
    setEditingCountry({
      ...editingCountry,
      visits: [newVisit, ...editingCountry.visits],
    });
    setNewVisitStart('');
    setNewVisitEnd('');
  }

  function handleRemoveVisit(visitId: string) {
    if (!editingCountry) return;
    if (editingCountry.visits.length <= 1) {
      Alert.alert('Erro', 'O pais deve ter pelo menos uma visita');
      return;
    }
    setEditingCountry({
      ...editingCountry,
      visits: editingCountry.visits.filter(v => v.id !== visitId),
    });
  }

  function handleSave() {
    if (!editingCountry) return;
    if (editingCountry.cities.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos uma cidade');
      return;
    }
    if (editingCountry.visits.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos uma visita');
      return;
    }
    setCountries(prev =>
      prev.map(c => (c.id === editingCountry.id ? editingCountry : c))
    );
    setModalVisible(false);
    setEditingCountry(null);
  }

  function handleAddNewCountry() {
    Alert.prompt(
      'Novo Pais',
      'Digite o nome do pais',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Adicionar',
          onPress: (name: string | undefined) => {
            if (!name?.trim()) return;
            const countryName = name.trim();
            const newCountry: Country = {
              id: Date.now().toString(),
              name: countryName,
              flag: getCountryFlag(countryName),
              visits: [{ id: '1', startDate: 'Hoje', endDate: 'Hoje' }],
              cities: [],
              image: require('../assets/images/italia.jpg'),
              imageUrl: getCountryImageUrl(countryName),
            };
            setCountries(prev => [newCountry, ...prev]);
            handleCountryPress(newCountry);
          },
        },
      ],
      'plain-text'
    );
  }

  function handleDeleteCountry() {
    if (!editingCountry) return;

    Alert.alert(
      'Excluir pais',
      `Tem certeza que deseja excluir "${editingCountry.name}" e todas as suas visitas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setCountries(prev => prev.filter(c => c.id !== editingCountry.id));
            setModalVisible(false);
            setEditingCountry(null);
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          android_ripple={{ color: colors.border, radius: 20 }}
        >
          {({ pressed }) => (
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.text}
              style={{ opacity: pressed ? 0.6 : 1 }}
            />
          )}
        </Pressable>
        <Text style={styles.headerTitle}>Paises Visitados</Text>
        <Pressable
          style={styles.addButton}
          onPress={handleAddNewCountry}
          android_ripple={{ color: colors.border, radius: 20 }}
        >
          {({ pressed }) => (
            <Ionicons
              name="add"
              size={24}
              color={colors.primary}
              style={{ opacity: pressed ? 0.6 : 1 }}
            />
          )}
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalCountries}</Text>
          <Text style={styles.summaryLabel}>Paises</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalVisits}</Text>
          <Text style={styles.summaryLabel}>Visitas totais</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalCities}</Text>
          <Text style={styles.summaryLabel}>Cidades</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {countries.map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              onPress={() => handleCountryPress(country)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Edit Country Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalFlag}>{editingCountry?.flag}</Text>
                <Text style={styles.modalTitle}>{editingCountry?.name}</Text>
              </View>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Visits Section */}
              <Text style={styles.sectionTitle}>
                Visitas ({editingCountry?.visits.length || 0})
              </Text>
              <View style={styles.addVisitContainer}>
                <View style={styles.visitInputRow}>
                  <View style={styles.visitInputWrapper}>
                    <Text style={styles.visitInputLabel}>Ida</Text>
                    <TextInput
                      style={styles.visitInput}
                      value={newVisitStart}
                      onChangeText={setNewVisitStart}
                      placeholder="Ex: Jan 2024"
                      placeholderTextColor={colors.muted}
                    />
                  </View>
                  <View style={styles.visitInputWrapper}>
                    <Text style={styles.visitInputLabel}>Volta</Text>
                    <TextInput
                      style={styles.visitInput}
                      value={newVisitEnd}
                      onChangeText={setNewVisitEnd}
                      placeholder="Ex: Fev 2024"
                      placeholderTextColor={colors.muted}
                    />
                  </View>
                  <Pressable style={styles.addVisitButton} onPress={handleAddVisit}>
                    <Ionicons name="add" size={20} color="#FFF" />
                  </Pressable>
                </View>
              </View>

              <View style={styles.visitsList}>
                {editingCountry?.visits.map((visit) => (
                  <View key={visit.id} style={styles.visitItem}>
                    <View style={styles.visitInfo}>
                      <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                      <Text style={styles.visitDate}>
                        {visit.startDate}
                        {visit.endDate && visit.endDate !== visit.startDate
                          ? ` - ${visit.endDate}`
                          : ''}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleRemoveVisit(visit.id)}
                      hitSlop={8}
                      style={styles.removeButton}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </Pressable>
                  </View>
                ))}
              </View>

              {/* Cities Section */}
              <Text style={styles.sectionTitle}>
                Cidades visitadas ({editingCountry?.cities.length || 0})
              </Text>
              <View style={styles.citiesContainer}>
                {editingCountry?.cities.map((city, index) => (
                  <View key={index} style={styles.cityTag}>
                    <Text style={styles.cityTagText}>{city}</Text>
                    <Pressable
                      onPress={() => handleRemoveCity(index)}
                      hitSlop={8}
                      style={styles.cityRemoveButton}
                    >
                      <Ionicons name="close" size={14} color={colors.muted} />
                    </Pressable>
                  </View>
                ))}
              </View>
              <View style={styles.addCityContainer}>
                <TextInput
                  style={styles.addCityInput}
                  value={newCityName}
                  onChangeText={setNewCityName}
                  placeholder="Nome da cidade"
                  placeholderTextColor={colors.muted}
                />
                <Pressable style={styles.addCityButton} onPress={handleAddCity}>
                  <Ionicons name="add" size={20} color="#FFF" />
                </Pressable>
              </View>

              <Pressable
                style={styles.saveButton}
                onPress={handleSave}
                android_ripple={{ color: '#fff' }}
              >
                {({ pressed }) => (
                  <Text style={[styles.saveButtonText, { opacity: pressed ? 0.8 : 1 }]}>
                    Salvar Alteracoes
                  </Text>
                )}
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={handleDeleteCountry}
                android_ripple={{ color: colors.border }}
              >
                {({ pressed }) => (
                  <View style={[styles.deleteButtonInner, { opacity: pressed ? 0.8 : 1 }]}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text style={styles.deleteButtonText}>Excluir Pais</Text>
                  </View>
                )}
              </Pressable>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#FFF',
    opacity: 0.9,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#FFF',
    opacity: 0.3,
  },
  container: {
    paddingBottom: 24,
  },
  grid: {
    paddingHorizontal: 16,
    gap: 16,
  },
  countryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardInner: {
    height: 160,
    position: 'relative',
  },
  countryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  countryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  countryContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'space-between',
  },
  countryFlag: {
    fontSize: 36,
  },
  countryName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  countryStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#FFF',
    fontWeight: '500',
  },
  lastVisit: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.8,
  },
  editIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalFlag: {
    fontSize: 28,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  addVisitContainer: {
    marginBottom: 16,
  },
  visitInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  visitInputWrapper: {
    flex: 1,
  },
  visitInputLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  visitInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#F8FAFB',
  },
  addVisitButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitsList: {
    gap: 8,
    marginBottom: 24,
  },
  visitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  visitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  visitDate: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
  citiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  cityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 10,
    borderRadius: 20,
    gap: 6,
  },
  cityTagText: {
    fontSize: 14,
    color: colors.text,
  },
  cityRemoveButton: {
    padding: 2,
  },
  addCityContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  addCityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#F8FAFB',
  },
  addCityButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  deleteButton: {
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    overflow: 'hidden',
  },
  deleteButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
