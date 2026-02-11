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
import { useTranslation } from 'react-i18next';

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

function formatDate(month: number, year: number, t: (key: string) => string): string {
  const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  return `${t(`months.${monthKeys[month - 1]}`)} ${year}`;
}

function getInitialCountries(t: (key: string) => string): Country[] {
  return [
    {
      id: '1',
      name: t('mockData.countryItaly'),
      flag: '🇮🇹',
      visits: [
        { id: '1', startDate: formatDate(10, 2024, t), endDate: formatDate(10, 2024, t) },
        { id: '2', startDate: formatDate(6, 2023, t), endDate: formatDate(7, 2023, t) },
        { id: '3', startDate: formatDate(12, 2022, t), endDate: formatDate(1, 2023, t) },
      ],
      cities: t('mockData.citiesItaly').split(', '),
      image: require('../assets/images/italia.jpg'),
    },
    {
      id: '2',
      name: t('mockData.countryJapan'),
      flag: '🇯🇵',
      visits: [
        { id: '1', startDate: formatDate(3, 2025, t), endDate: formatDate(3, 2025, t) },
        { id: '2', startDate: formatDate(4, 2024, t), endDate: formatDate(5, 2024, t) },
      ],
      cities: t('mockData.citiesJapan').split(', '),
      image: require('../assets/images/japao.jpg'),
    },
    {
      id: '3',
      name: t('mockData.countryTurkey'),
      flag: '🇹🇷',
      visits: [{ id: '1', startDate: formatDate(12, 2023, t), endDate: formatDate(12, 2023, t) }],
      cities: t('mockData.citiesTurkey').split(', '),
      image: require('../assets/images/turquia.jpg'),
    },
    {
      id: '4',
      name: t('mockData.countryFrance'),
      flag: '🇫🇷',
      visits: [
        { id: '1', startDate: formatDate(7, 2024, t), endDate: formatDate(8, 2024, t) },
        { id: '2', startDate: formatDate(9, 2022, t), endDate: formatDate(9, 2022, t) },
      ],
      cities: t('mockData.citiesFrance').split(', '),
      image: require('../assets/images/italia.jpg'),
    },
    {
      id: '5',
      name: t('mockData.countrySpain'),
      flag: '🇪🇸',
      visits: [
        { id: '1', startDate: formatDate(5, 2024, t), endDate: formatDate(5, 2024, t) },
        { id: '2', startDate: formatDate(2, 2023, t), endDate: formatDate(2, 2023, t) },
      ],
      cities: t('mockData.citiesSpain').split(', '),
      image: require('../assets/images/turquia.jpg'),
    },
    {
      id: '6',
      name: t('mockData.countryPortugal'),
      flag: '🇵🇹',
      visits: [
        { id: '1', startDate: formatDate(1, 2024, t), endDate: formatDate(1, 2024, t) },
        { id: '2', startDate: formatDate(11, 2023, t), endDate: formatDate(11, 2023, t) },
        { id: '3', startDate: formatDate(6, 2022, t), endDate: formatDate(6, 2022, t) },
      ],
      cities: t('mockData.citiesPortugal').split(', '),
      image: require('../assets/images/japao.jpg'),
    },
    {
      id: '7',
      name: t('mockData.countryUK'),
      flag: '🇬🇧',
      visits: [{ id: '1', startDate: formatDate(8, 2023, t), endDate: formatDate(8, 2023, t) }],
      cities: t('mockData.citiesUK').split(', '),
      image: require('../assets/images/italia.jpg'),
    },
    {
      id: '8',
      name: t('mockData.countryGermany'),
      flag: '🇩🇪',
      visits: [
        { id: '1', startDate: formatDate(11, 2023, t), endDate: formatDate(11, 2023, t) },
        { id: '2', startDate: formatDate(7, 2022, t), endDate: formatDate(7, 2022, t) },
      ],
      cities: t('mockData.citiesGermany').split(', '),
      image: require('../assets/images/turquia.jpg'),
    },
    {
      id: '9',
      name: t('mockData.countryUSA'),
      flag: '🇺🇸',
      visits: [
        { id: '1', startDate: formatDate(4, 2024, t), endDate: formatDate(4, 2024, t) },
        { id: '2', startDate: formatDate(12, 2022, t), endDate: formatDate(1, 2023, t) },
      ],
      cities: t('mockData.citiesUSA').split(', '),
      image: require('../assets/images/japao.jpg'),
    },
    {
      id: '10',
      name: t('mockData.countryArgentina'),
      flag: '🇦🇷',
      visits: [{ id: '1', startDate: formatDate(2, 2024, t), endDate: formatDate(2, 2024, t) }],
      cities: t('mockData.citiesArgentina').split(', '),
      image: require('../assets/images/italia.jpg'),
    },
    {
      id: '11',
      name: t('mockData.countryChile'),
      flag: '🇨🇱',
      visits: [{ id: '1', startDate: formatDate(2, 2024, t), endDate: formatDate(2, 2024, t) }],
      cities: t('mockData.citiesChile').split(', '),
      image: require('../assets/images/turquia.jpg'),
    },
    {
      id: '12',
      name: t('mockData.countryPeru'),
      flag: '🇵🇪',
      visits: [{ id: '1', startDate: formatDate(3, 2024, t), endDate: formatDate(3, 2024, t) }],
      cities: t('mockData.citiesPeru').split(', '),
      image: require('../assets/images/japao.jpg'),
    },
  ];
}

function CountryCard({
  country,
  onPress,
}: {
  country: Country;
  onPress: () => void;
}) {
  const { t } = useTranslation();
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
                <Text style={styles.statText}>{country.visits.length} {t('countries.visits')}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="location" size={14} color="#FFF" />
                <Text style={styles.statText}>{country.cities.length} {t('countries.cities')}</Text>
              </View>
            </View>
            {lastVisit && (
              <Text style={styles.lastVisit}>{t('countries.lastVisit')}: {lastVisit.startDate}</Text>
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
  const { t } = useTranslation();
  const [countries, setCountries] = useState<Country[]>(() => getInitialCountries(t));
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
      Alert.alert(t('common.error'), t('countries.enterCityName'));
      return;
    }
    if (editingCountry.cities.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert(t('common.error'), t('countries.cityAlreadyAdded'));
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
      Alert.alert(t('common.error'), t('countries.enterStartDate'));
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
      Alert.alert(t('common.error'), t('countries.minOneVisit'));
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
      Alert.alert(t('common.error'), t('countries.minOneCity'));
      return;
    }
    if (editingCountry.visits.length === 0) {
      Alert.alert(t('common.error'), t('countries.minOneVisit'));
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
      t('countries.newCountry'),
      t('countries.enterCountryName'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('countries.add'),
          onPress: (name: string | undefined) => {
            if (!name?.trim()) return;
            const countryName = name.trim();
            const newCountry: Country = {
              id: Date.now().toString(),
              name: countryName,
              flag: getCountryFlag(countryName),
              visits: [{ id: '1', startDate: t('countries.today'), endDate: t('countries.today') }],
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
      t('countries.deleteCountry'),
      t('countries.deleteConfirm', { name: editingCountry.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
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
        <Text style={styles.headerTitle}>{t('countries.title')}</Text>
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
          <Text style={styles.summaryLabel}>{t('countries.countries')}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalVisits}</Text>
          <Text style={styles.summaryLabel}>{t('countries.totalVisits')}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalCities}</Text>
          <Text style={styles.summaryLabel}>{t('countries.citiesLabel')}</Text>
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
                {t('countries.visits')} ({editingCountry?.visits.length || 0})
              </Text>
              <View style={styles.addVisitContainer}>
                <View style={styles.visitInputRow}>
                  <View style={styles.visitInputWrapper}>
                    <Text style={styles.visitInputLabel}>{t('countries.departure')}</Text>
                    <TextInput
                      style={styles.visitInput}
                      value={newVisitStart}
                      onChangeText={setNewVisitStart}
                      placeholder="Ex: Jan 2024"
                      placeholderTextColor={colors.muted}
                    />
                  </View>
                  <View style={styles.visitInputWrapper}>
                    <Text style={styles.visitInputLabel}>{t('countries.return')}</Text>
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
                {t('countries.citiesVisited')} ({editingCountry?.cities.length || 0})
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
                  placeholder={t('countries.cityName')}
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
                    {t('countries.saveChanges')}
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
                    <Text style={styles.deleteButtonText}>{t('countries.deleteCountry')}</Text>
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
