import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ProfileCountry,
  createProfileCountry,
  convertToProfileCountries,
} from '../../utils/countryUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 18;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_PADDING * 2 - CARD_GAP) / 2;

type Trip = {
  id: string;
  title: string;
  date: string;
  image: any;
  imageUri?: string;
};

const INITIAL_TRIPS: Trip[] = [
  {
    id: '1',
    title: 'Italia',
    date: 'Outubro 2024',
    image: require('../../assets/images/italia.jpg'),
  },
  {
    id: '2',
    title: 'Japao',
    date: 'Marco 2025',
    image: require('../../assets/images/japao.jpg'),
  },
  {
    id: '3',
    title: 'Turquia',
    date: 'Dezembro 2023',
    image: require('../../assets/images/turquia.jpg'),
  },
];

const INITIAL_STATS = {
  countries: 12,
  cities: 45,
  days: 180,
};

const INITIAL_COUNTRIES_LIST: ProfileCountry[] = convertToProfileCountries([
  'Brasil', 'Argentina', 'Chile', 'Peru', 'Italia', 'Franca',
  'Espanha', 'Portugal', 'Japao', 'Tailandia', 'Mexico', 'Estados Unidos'
]);

const STORAGE_KEY_COUNTRIES = '@roteirize_countries';
const STORAGE_KEY_STATS = '@roteirize_stats';

const STATS_CONFIG = [
  { id: 'countries', label: 'Paises visitados', icon: 'earth' },
  { id: 'cities', label: 'Cidades exploradas', icon: 'location' },
  { id: 'days', label: 'Dias viajando', icon: 'calendar' },
];

const MENU_OPTIONS = [
  { id: 'favorites', icon: 'heart', label: 'Favoritos', badge: 12 },
  { id: 'saved', icon: 'bookmark', label: 'Salvos', badge: 8 },
  { id: 'settings', icon: 'settings', label: 'Configuracoes' },
  { id: 'help', icon: 'help-circle', label: 'Ajuda e suporte' },
];

const FOLLOWERS = [
  { id: '1', name: 'Maria Silva', username: 'maria.silva', avatar: 'https://i.pravatar.cc/150?img=1', isFollowing: false },
  { id: '2', name: 'João Santos', username: 'joao.santos', avatar: 'https://i.pravatar.cc/150?img=3', isFollowing: true },
  { id: '3', name: 'Ana Costa', username: 'ana.costa', avatar: 'https://i.pravatar.cc/150?img=5', isFollowing: false },
  { id: '4', name: 'Pedro Lima', username: 'pedro.lima', avatar: 'https://i.pravatar.cc/150?img=8', isFollowing: true },
  { id: '5', name: 'Carla Mendes', username: 'carla.mendes', avatar: 'https://i.pravatar.cc/150?img=9', isFollowing: false },
  { id: '6', name: 'Lucas Oliveira', username: 'lucas.oliveira', avatar: 'https://i.pravatar.cc/150?img=11', isFollowing: false },
];

function StatCard({
  stat,
  value,
  onPress,
}: {
  stat: (typeof STATS_CONFIG)[0];
  value: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.statCard}
      onPress={onPress}
      android_ripple={{ color: colors.border }}
    >
      {({ pressed }) => (
        <View style={[styles.statCardContent, { opacity: pressed ? 0.7 : 1 }]}>
          <View style={styles.statIconContainer}>
            <Ionicons name={stat.icon as any} size={18} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel} numberOfLines={2}>
            {stat.label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function TripCard({
  trip,
  onPress,
  onEdit,
}: {
  trip: Trip;
  onPress: () => void;
  onEdit: () => void;
}) {
  return (
    <Pressable
      style={[styles.tripCard, { width: CARD_WIDTH }]}
      onPress={onPress}
      android_ripple={{ color: colors.border }}
    >
      {({ pressed }) => (
        <View style={{ opacity: pressed ? 0.8 : 1 }}>
          <Image
            source={trip.imageUri ? { uri: trip.imageUri } : trip.image}
            style={styles.tripImage}
          />
          <View style={styles.tripOverlay}>
            <Text style={styles.tripTitle}>{trip.title}</Text>
            <Text style={styles.tripDate}>{trip.date}</Text>
          </View>
          <Pressable
            style={styles.tripEditButton}
            onPress={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            hitSlop={8}
          >
            <Ionicons name="pencil" size={14} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

function MenuOption({
  option,
  onPress,
}: {
  option: (typeof MENU_OPTIONS)[0];
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.menuOption}
      onPress={onPress}
      android_ripple={{ color: colors.border }}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.menuOptionInner,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <View style={styles.menuLeft}>
            <View style={styles.menuIconWrapper}>
              <Ionicons name={option.icon as any} size={22} color={colors.text} />
            </View>
            <Text style={styles.menuLabel}>{option.label}</Text>
          </View>
          <View style={styles.menuRight}>
            {option.badge !== undefined && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{option.badge}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </View>
        </View>
      )}
    </Pressable>
  );
}

// Simulação de usernames existentes (em produção, viria do backend)
const EXISTING_USERNAMES = ['juliana.santos', 'maria.silva', 'joao.santos', 'ana.costa'];

export default function Perfil() {
  const router = useRouter();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const [name, setName] = useState('Juliana Santos');
  const [username, setUsername] = useState('juliana.santos');
  const [bio, setBio] = useState('Exploradora de mundo');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [followerSearch, setFollowerSearch] = useState('');
  const [followers, setFollowers] = useState(FOLLOWERS);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [tripModalVisible, setTripModalVisible] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [tripTitle, setTripTitle] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [tripImageUri, setTripImageUri] = useState<string | null>(null);

  // Stats state
  const [stats, setStats] = useState(INITIAL_STATS);
  const [countriesList, setCountriesList] = useState<ProfileCountry[]>(INITIAL_COUNTRIES_LIST);

  // Estados temporários para edição
  const [tempName, setTempName] = useState(name);
  const [tempUsername, setTempUsername] = useState(username);
  const [tempBio, setTempBio] = useState(bio);
  const [tempStats, setTempStats] = useState(INITIAL_STATS);
  const [tempCountriesList, setTempCountriesList] = useState<ProfileCountry[]>(INITIAL_COUNTRIES_LIST);
  const [newCountryName, setNewCountryName] = useState('');

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    async function loadSavedData() {
      try {
        const savedCountries = await AsyncStorage.getItem(STORAGE_KEY_COUNTRIES);
        if (savedCountries) {
          const parsed = JSON.parse(savedCountries) as ProfileCountry[];
          setCountriesList(parsed);
        }

        const savedStats = await AsyncStorage.getItem(STORAGE_KEY_STATS);
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
    loadSavedData();
  }, []);

  // Salvar países quando a lista mudar
  useEffect(() => {
    async function saveCountries() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY_COUNTRIES, JSON.stringify(countriesList));
      } catch (error) {
        console.error('Erro ao salvar paises:', error);
      }
    }
    saveCountries();
  }, [countriesList]);

  // Salvar stats quando mudarem
  useEffect(() => {
    async function saveStats() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
      } catch (error) {
        console.error('Erro ao salvar stats:', error);
      }
    }
    saveStats();
  }, [stats]);

  async function handlePickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para alterar a foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  }

  function validateUsername(value: string): string | null {
    const trimmed = value.trim().toLowerCase();

    if (trimmed.length < 3) {
      return 'Username deve ter pelo menos 3 caracteres';
    }

    if (trimmed.length > 30) {
      return 'Username deve ter no máximo 30 caracteres';
    }

    if (!/^[a-z0-9._]+$/.test(trimmed)) {
      return 'Apenas letras, números, pontos e underlines';
    }

    if (/^[._]|[._]$/.test(trimmed)) {
      return 'Não pode começar ou terminar com ponto ou underline';
    }

    if (/[._]{2}/.test(trimmed)) {
      return 'Não pode ter pontos ou underlines consecutivos';
    }

    // Verifica se já existe (exceto o próprio usuário)
    if (trimmed !== username && EXISTING_USERNAMES.includes(trimmed)) {
      return 'Este username já está em uso';
    }

    return null;
  }

  function handleUsernameChange(value: string) {
    const formatted = value.toLowerCase().replace(/\s/g, '');
    setTempUsername(formatted);

    setIsCheckingUsername(true);
    // Simula delay de verificação (em produção seria uma chamada API)
    setTimeout(() => {
      const error = validateUsername(formatted);
      setUsernameError(error);
      setIsCheckingUsername(false);
    }, 300);
  }

  function handleTripPress(tripId: string) {
    router.push(`/trip/${tripId}`);
  }

  function handleEditTrip(trip: Trip) {
    setEditingTrip(trip);
    setTripTitle(trip.title);
    setTripDate(trip.date);
    setTripImageUri(trip.imageUri || null);
    setTripModalVisible(true);
  }

  async function handlePickTripImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissao necessaria', 'Precisamos de acesso a sua galeria para selecionar a foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setTripImageUri(result.assets[0].uri);
    }
  }

  function handleSaveTrip() {
    if (!tripTitle.trim()) {
      Alert.alert('Erro', 'Digite um titulo para a viagem');
      return;
    }
    if (!tripDate.trim()) {
      Alert.alert('Erro', 'Digite a data da viagem');
      return;
    }

    if (editingTrip) {
      setTrips(prev =>
        prev.map(t =>
          t.id === editingTrip.id
            ? { ...t, title: tripTitle, date: tripDate, imageUri: tripImageUri || t.imageUri }
            : t
        )
      );
    } else {
      const newTrip: Trip = {
        id: Date.now().toString(),
        title: tripTitle,
        date: tripDate,
        image: require('../../assets/images/italia.jpg'),
        imageUri: tripImageUri || undefined,
      };
      setTrips(prev => [newTrip, ...prev]);
    }

    setTripModalVisible(false);
    setEditingTrip(null);
    setTripTitle('');
    setTripDate('');
    setTripImageUri(null);
    Alert.alert('Sucesso', editingTrip ? 'Viagem atualizada!' : 'Viagem adicionada!');
  }

  function handleDeleteTrip() {
    if (!editingTrip) return;

    Alert.alert(
      'Excluir viagem',
      `Tem certeza que deseja excluir "${editingTrip.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setTrips(prev => prev.filter(t => t.id !== editingTrip.id));
            setTripModalVisible(false);
            setEditingTrip(null);
            setTripTitle('');
            setTripDate('');
            setTripImageUri(null);
          },
        },
      ]
    );
  }

  function handleMenuPress(id: string) {
    switch (id) {
      case 'settings':
        Alert.alert('Configurações', 'Funcionalidade de configurações em desenvolvimento');
        break;
      case 'favorites':
        Alert.alert('Favoritos', 'Você tem 12 lugares favoritos salvos');
        break;
      case 'saved':
        Alert.alert('Salvos', 'Você tem 8 roteiros salvos');
        break;
      case 'help':
        Alert.alert(
          'Ajuda e Suporte',
          'Entre em contato conosco:\nEmail: suporte@roteirize.com\nTelefone: (11) 99999-9999'
        );
        break;
    }
  }

  function handleEditProfile() {
    setTempName(name);
    setTempUsername(username);
    setTempBio(bio);
    setTempStats({ ...stats });
    setTempCountriesList([...countriesList]);
    setNewCountryName('');
    setUsernameError(null);
    setEditModalVisible(true);
  }

  function handleAddCountry() {
    const trimmed = newCountryName.trim();
    if (!trimmed) {
      Alert.alert('Erro', 'Digite o nome do pais');
      return;
    }
    if (tempCountriesList.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert('Erro', 'Este pais ja foi adicionado');
      return;
    }
    const newCountry = createProfileCountry(trimmed);
    setTempCountriesList(prev => [...prev, newCountry]);
    setNewCountryName('');
  }

  function handleRemoveCountry(index: number) {
    setTempCountriesList(prev => prev.filter((_, i) => i !== index));
  }

  function handleSaveProfile() {
    const error = validateUsername(tempUsername);
    if (error) {
      setUsernameError(error);
      return;
    }

    setName(tempName);
    setUsername(tempUsername);
    setBio(tempBio);
    setStats(tempStats);
    setCountriesList(tempCountriesList);
    setEditModalVisible(false);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  }

  function handleAddTrip() {
    setEditingTrip(null);
    setTripTitle('');
    setTripDate('');
    setTripImageUri(null);
    setTripModalVisible(true);
  }

  function handleStatPress(statId: string) {
    if (statId === 'countries') {
      router.push('/countries');
    }
  }

  function handleFollowersPress() {
    setFollowersModalVisible(true);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Profile */}
        <View style={styles.profileHeader}>
          <Pressable onPress={handlePickImage} style={styles.avatarContainer}>
            <Image
              source={profileImage ? { uri: profileImage } : require('../../assets/images/profile.jpg')}
              style={styles.avatar}
            />
            <View style={styles.avatarOverlay}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </View>
          </Pressable>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.subtitle}>{bio}</Text>

          <Pressable
            style={styles.editButton}
            onPress={handleEditProfile}
            android_ripple={{ color: colors.border }}
          >
            {({ pressed }) => (
              <View
                style={[
                  styles.editButtonInner,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons name="create-outline" size={18} color={colors.text} />
                <Text style={styles.editButtonText}>Editar perfil</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          {STATS_CONFIG.map((stat) => (
            <StatCard
              key={stat.id}
              stat={stat}
              value={stats[stat.id as keyof typeof stats]}
              onPress={() => handleStatPress(stat.id)}
            />
          ))}
        </View>

        {/* Followers Section */}
        <Pressable
          style={styles.followersButton}
          onPress={handleFollowersPress}
          android_ripple={{ color: colors.border }}
        >
          {({ pressed }) => (
            <View style={{ opacity: pressed ? 0.7 : 1 }}>
              <Text style={styles.followersText}>
                <Text style={styles.followersCount}>700</Text> seguidores
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.muted}
                style={styles.followersIcon}
              />
            </View>
          )}
        </Pressable>

        {/* Trips Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Minhas viagens</Text>
            <Pressable
              style={styles.addButton}
              onPress={handleAddTrip}
              android_ripple={{ color: colors.border, radius: 20 }}
            >
              {({ pressed }) => (
                <Ionicons
                  name="add-circle"
                  size={24}
                  color={colors.primary}
                  style={{ opacity: pressed ? 0.7 : 1 }}
                />
              )}
            </Pressable>
          </View>

          <View style={styles.tripsGrid}>
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onPress={() => handleTripPress(trip.id)}
                onEdit={() => handleEditTrip(trip)}
              />
            ))}
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opcoes</Text>
          <View style={styles.menuContainer}>
            {MENU_OPTIONS.map((option, index) => (
              <View key={option.id}>
                <MenuOption
                  option={option}
                  onPress={() => handleMenuPress(option.id)}
                />
                {index < MENU_OPTIONS.length - 1 && (
                  <View style={styles.menuDivider} />
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <Pressable onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                value={tempName}
                onChangeText={setTempName}
                placeholder="Digite seu nome"
                placeholderTextColor={colors.muted}
              />

              <Text style={styles.inputLabel}>Username</Text>
              <View style={styles.usernameInputContainer}>
                <Text style={styles.usernamePrefix}>@</Text>
                <TextInput
                  style={styles.usernameInput}
                  value={tempUsername}
                  onChangeText={handleUsernameChange}
                  placeholder="seu.username"
                  placeholderTextColor={colors.muted}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {isCheckingUsername && (
                  <ActivityIndicator size="small" color={colors.primary} style={styles.usernameLoader} />
                )}
                {!isCheckingUsername && tempUsername && !usernameError && (
                  <Ionicons name="checkmark-circle" size={20} color="#22C55E" style={styles.usernameIcon} />
                )}
              </View>
              {usernameError && (
                <Text style={styles.usernameError}>{usernameError}</Text>
              )}
              <Text style={styles.usernameHint}>
                Apenas letras, números, pontos e underlines
              </Text>

              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={tempBio}
                onChangeText={setTempBio}
                placeholder="Conte um pouco sobre você"
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={3}
              />

              {/* Stats Section */}
              <View style={styles.statsSectionDivider} />
              <Text style={styles.statsEditTitle}>Estatisticas de Viagem</Text>

              {/* Countries */}
              <Text style={styles.inputLabel}>Paises visitados</Text>
              <TextInput
                style={styles.input}
                value={String(tempStats.countries)}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  setTempStats(prev => ({ ...prev, countries: num }));
                }}
                placeholder="Numero de paises"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
              />

              {/* Cities */}
              <Text style={styles.inputLabel}>Cidades exploradas</Text>
              <TextInput
                style={styles.input}
                value={String(tempStats.cities)}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  setTempStats(prev => ({ ...prev, cities: num }));
                }}
                placeholder="Numero de cidades"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
              />

              {/* Days */}
              <Text style={styles.inputLabel}>Dias viajando</Text>
              <TextInput
                style={styles.input}
                value={String(tempStats.days)}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  setTempStats(prev => ({ ...prev, days: num }));
                }}
                placeholder="Numero de dias"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
              />

              <Pressable
                style={[styles.saveButton, usernameError && styles.saveButtonDisabled]}
                onPress={handleSaveProfile}
                android_ripple={{ color: '#fff' }}
                disabled={!!usernameError}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.saveButtonText,
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    Salvar
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Followers Modal */}
      <Modal
        visible={followersModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFollowersModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.followersModalContent}>
            <View style={styles.followersModalHeader}>
              <View style={styles.followersModalHeaderTop}>
                <View style={{ width: 24 }} />
                <Text style={styles.followersModalTitle}>Seguidores</Text>
                <Pressable onPress={() => setFollowersModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </Pressable>
              </View>
              <View style={styles.followersSearchContainer}>
                <Ionicons name="search" size={18} color={colors.muted} style={styles.followersSearchIcon} />
                <TextInput
                  style={styles.followersSearchInput}
                  placeholder="Pesquisar"
                  placeholderTextColor={colors.muted}
                  value={followerSearch}
                  onChangeText={setFollowerSearch}
                />
              </View>
            </View>

            <ScrollView style={styles.followersListContainer} showsVerticalScrollIndicator={false}>
              {followers
                .filter(f =>
                  f.name.toLowerCase().includes(followerSearch.toLowerCase()) ||
                  f.username.toLowerCase().includes(followerSearch.toLowerCase())
                )
                .map((follower) => (
                <View key={follower.id} style={styles.followerItemNew}>
                  <Image source={{ uri: follower.avatar }} style={styles.followerAvatarImage} />
                  <View style={styles.followerInfo}>
                    <Text style={styles.followerUsername}>{follower.username}</Text>
                    <Text style={styles.followerFullName}>{follower.name}</Text>
                  </View>
                  <Pressable
                    style={[
                      styles.followButtonNew,
                      follower.isFollowing && styles.followingButton,
                    ]}
                    onPress={() => {
                      setFollowers(prev =>
                        prev.map(f =>
                          f.id === follower.id ? { ...f, isFollowing: !f.isFollowing } : f
                        )
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.followButtonTextNew,
                        follower.isFollowing && styles.followingButtonText,
                      ]}
                    >
                      {follower.isFollowing ? 'Seguindo' : 'Seguir'}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Trip Modal */}
      <Modal
        visible={tripModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTripModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTrip ? 'Editar Viagem' : 'Nova Viagem'}
              </Text>
              <Pressable onPress={() => setTripModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Pressable style={styles.tripImagePicker} onPress={handlePickTripImage}>
                {tripImageUri ? (
                  <Image source={{ uri: tripImageUri }} style={styles.tripImagePreview} />
                ) : editingTrip?.imageUri ? (
                  <Image source={{ uri: editingTrip.imageUri }} style={styles.tripImagePreview} />
                ) : editingTrip?.image ? (
                  <Image source={editingTrip.image} style={styles.tripImagePreview} />
                ) : (
                  <View style={styles.tripImagePlaceholder}>
                    <Ionicons name="image-outline" size={40} color={colors.muted} />
                    <Text style={styles.tripImagePlaceholderText}>Adicionar foto de capa</Text>
                  </View>
                )}
                <View style={styles.tripImageOverlay}>
                  <Ionicons name="camera" size={24} color="#FFFFFF" />
                </View>
              </Pressable>

              <Text style={styles.inputLabel}>Titulo</Text>
              <TextInput
                style={styles.input}
                value={tripTitle}
                onChangeText={setTripTitle}
                placeholder="Ex: Italia, Japao, Turquia..."
                placeholderTextColor={colors.muted}
              />

              <Text style={styles.inputLabel}>Data</Text>
              <TextInput
                style={styles.input}
                value={tripDate}
                onChangeText={setTripDate}
                placeholder="Ex: Outubro 2024"
                placeholderTextColor={colors.muted}
              />

              <Pressable
                style={styles.saveButton}
                onPress={handleSaveTrip}
                android_ripple={{ color: '#fff' }}
              >
                {({ pressed }) => (
                  <Text style={[styles.saveButtonText, { opacity: pressed ? 0.8 : 1 }]}>
                    {editingTrip ? 'Salvar Alteracoes' : 'Adicionar Viagem'}
                  </Text>
                )}
              </Pressable>

              {editingTrip && (
                <Pressable
                  style={styles.deleteButton}
                  onPress={handleDeleteTrip}
                  android_ripple={{ color: colors.border }}
                >
                  {({ pressed }) => (
                    <Text style={[styles.deleteButtonText, { opacity: pressed ? 0.8 : 1 }]}>
                      Excluir Viagem
                    </Text>
                  )}
                </Pressable>
              )}
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
  container: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  username: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 20,
  },
  editButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  editButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 24,
    backgroundColor: colors.background,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  statsSection: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFB',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  statIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    marginTop: 2,
  },
  statLabel: {
    fontSize: 9.5,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 12,
    paddingHorizontal: 2,
  },
  followersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 12,
    backgroundColor: '#F8FAFB',
    borderWidth: 1,
    borderColor: colors.border,
  },
  followersText: {
    fontSize: 15,
    color: colors.muted,
  },
  followersCount: {
    fontWeight: '700',
    color: colors.text,
  },
  followersIcon: {
    position: 'absolute',
    right: -20,
    top: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 24,
  },
  addButton: {
    padding: 4,
    borderRadius: 20,
  },
  tripsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: CARD_PADDING,
    gap: CARD_GAP,
  },
  tripCard: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  tripImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tripOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  tripDate: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  menuContainer: {
    backgroundColor: colors.background,
    borderRadius: 20,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuOption: {
    overflow: 'hidden',
  },
  menuOptionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 28,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
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
    maxHeight: '80%',
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
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#F8FAFB',
  },
  usernameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#F8FAFB',
    paddingHorizontal: 16,
  },
  usernamePrefix: {
    fontSize: 16,
    color: colors.muted,
    marginRight: 2,
  },
  usernameInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  usernameLoader: {
    marginLeft: 8,
  },
  usernameIcon: {
    marginLeft: 8,
  },
  usernameError: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 6,
  },
  usernameHint: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    backgroundColor: colors.muted,
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  followersModalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    height: '85%',
  },
  followersModalHeader: {
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  followersModalHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  followersModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  followersSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  followersSearchIcon: {
    marginRight: 8,
  },
  followersSearchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 10,
  },
  followersListContainer: {
    flex: 1,
    paddingTop: 8,
  },
  followerItemNew: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  followerAvatarImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  followerInfo: {
    flex: 1,
  },
  followerUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  followerFullName: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  followButtonNew: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  followButtonTextNew: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  followingButtonText: {
    color: colors.text,
  },
  tripEditButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripImagePicker: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    marginBottom: 8,
    position: 'relative',
  },
  tripImagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tripImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  tripImagePlaceholderText: {
    fontSize: 14,
    color: colors.muted,
  },
  tripImageOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  statsSectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 24,
    marginBottom: 16,
  },
  statsEditTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  countriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  countryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 20,
    gap: 4,
  },
  countryTagText: {
    fontSize: 14,
    color: colors.text,
  },
  countryRemoveButton: {
    padding: 2,
  },
  addCountryContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  addCountryInput: {
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
  addCountryButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryTagWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 10,
    borderRadius: 24,
    gap: 6,
    overflow: 'hidden',
  },
  countryTagImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  countryTagFlag: {
    fontSize: 14,
  },
});
