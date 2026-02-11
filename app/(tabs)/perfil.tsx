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
  Share,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/Button';
import { useState, useMemo } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useSocial } from '../../context/SocialContext';
import { useUser } from '../../context/UserContext';
import { Post, Story } from '../../types/Social';
import StoryViewer from '../post/StoryViewer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const POST_SIZE = (SCREEN_WIDTH - 4) / 3;

type TabType = 'posts' | 'albums';

type TripAlbum = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  photos: string[];
  location?: string;
  createdAt: string;
};

type Highlight = {
  id: string;
  title: string;
  cover: string;
  stories: Story[];
};

const HIGHLIGHTS: Highlight[] = [
  {
    id: '1',
    title: 'Italia',
    cover: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=200',
    stories: [
      {
        id: 'h1-1',
        userId: 'current-user',
        user: 'Juliana',
        username: 'juliana_viaja',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        images: [{ uri: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800' }],
        seen: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        reactions: [],
        replies: [],
      },
    ],
  },
  {
    id: '2',
    title: 'Japao',
    cover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200',
    stories: [
      {
        id: 'h2-1',
        userId: 'current-user',
        user: 'Juliana',
        username: 'juliana_viaja',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        images: [{ uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800' }],
        seen: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        reactions: [],
        replies: [],
      },
    ],
  },
  {
    id: '3',
    title: 'Praias',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200',
    stories: [
      {
        id: 'h3-1',
        userId: 'current-user',
        user: 'Juliana',
        username: 'juliana_viaja',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        images: [{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' }],
        seen: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        reactions: [],
        replies: [],
      },
    ],
  },
  {
    id: '4',
    title: 'Comidas',
    cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200',
    stories: [
      {
        id: 'h4-1',
        userId: 'current-user',
        user: 'Juliana',
        username: 'juliana_viaja',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        images: [{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800' }],
        seen: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        reactions: [],
        replies: [],
      },
    ],
  },
  {
    id: '5',
    title: 'Amigos',
    cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200',
    stories: [
      {
        id: 'h5-1',
        userId: 'current-user',
        user: 'Juliana',
        username: 'juliana_viaja',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        images: [{ uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800' }],
        seen: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        reactions: [],
        replies: [],
      },
    ],
  },
];

function HighlightItem({
  highlight,
  onPress,
  styles,
  colors
}: {
  highlight: Highlight;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  colors: ReturnType<typeof getColors>;
}) {
  return (
    <Pressable style={styles.highlightItem} onPress={onPress}>
      <View style={styles.highlightRing}>
        <Image source={{ uri: highlight.cover }} style={styles.highlightImage} />
      </View>
      <Text style={styles.highlightTitle} numberOfLines={1}>{highlight.title}</Text>
    </Pressable>
  );
}

function AddHighlight({
  onPress,
  styles,
  colors
}: {
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  colors: ReturnType<typeof getColors>;
}) {
  return (
    <Pressable style={styles.highlightItem} onPress={onPress}>
      <View style={styles.addHighlightCircle}>
        <Ionicons name="add" size={28} color={colors.text} />
      </View>
      <Text style={styles.highlightTitle}>Novo</Text>
    </Pressable>
  );
}

function PostGridItem({
  post,
  onPress,
  styles
}: {
  post: Post;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Pressable style={styles.postGridItem} onPress={onPress}>
      <Image source={post.image} style={styles.postGridImage} />
      {post.comments > 0 && (
        <View style={styles.postMultipleIcon}>
          <Ionicons name="copy" size={16} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}

type MenuOption = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

function MenuSheet({
  visible,
  onClose,
  options,
  styles,
  colors
}: {
  visible: boolean;
  onClose: () => void;
  options: MenuOption[];
  styles: ReturnType<typeof createStyles>;
  colors: ReturnType<typeof getColors>;
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.menuOverlay} onPress={onClose}>
        <Pressable style={styles.menuSheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.menuDrag} />
          {options.map((option, index) => (
            <Pressable
              key={index}
              style={styles.menuOption}
              onPress={() => {
                onClose();
                option.onPress();
              }}
            >
              <Ionicons
                name={option.icon}
                size={24}
                color={option.destructive ? '#ED4956' : colors.text}
              />
              <Text
                style={[
                  styles.menuOptionText,
                  option.destructive && styles.menuOptionDestructive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
          <Pressable style={styles.menuCancelButton} onPress={onClose}>
            <Text style={styles.menuCancelText}>Cancelar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function Perfil() {
  const router = useRouter();
  const { posts: allPosts } = useSocial();
  const { currentUser } = useUser();
  const { theme } = useTheme();
  const colors = getColors(theme);

  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);

  // Create styles with dynamic colors
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Album states
  const [albums, setAlbums] = useState<TripAlbum[]>([]);
  const [createAlbumModalVisible, setCreateAlbumModalVisible] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<TripAlbum | null>(null);
  const [albumViewerVisible, setAlbumViewerVisible] = useState(false);

  // Create album form states
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [newAlbumLocation, setNewAlbumLocation] = useState('');
  const [newAlbumPhotos, setNewAlbumPhotos] = useState<string[]>([]);

  // Edit profile states
  const [tempName, setTempName] = useState(currentUser.name);
  const [tempUsername, setTempUsername] = useState(currentUser.username);
  const [tempBio, setTempBio] = useState(currentUser.bio || '');
  const [tempWebsite, setTempWebsite] = useState('roteirize.app/juliana');

  // Filter posts to show only current user's posts
  const myPosts = useMemo(
    () => allPosts.filter((post) => post.userId === currentUser.id),
    [allPosts, currentUser.id]
  );

  async function handlePickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissao necessaria', 'Precisamos de acesso a sua galeria para alterar a foto.');
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

  function handleEditProfile() {
    setTempName(currentUser.name);
    setTempUsername(currentUser.username);
    setTempBio(currentUser.bio || '');
    setEditModalVisible(true);
  }

  function handleSaveProfile() {
    setEditModalVisible(false);
    Alert.alert('Sucesso', 'Perfil atualizado!');
  }

  function handlePostPress(postId: string, index: number) {
    router.push({
      pathname: '/post/[id]',
      params: { id: postId, userId: currentUser.id, startIndex: index.toString() },
    } as any);
  }

  function handleHighlightPress(highlight: Highlight) {
    setSelectedHighlight(highlight);
    setStoryViewerVisible(true);
  }

  function handleAddHighlight() {
    Alert.alert(
      'Novo destaque',
      'Selecione stories para adicionar ao destaque',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Selecionar',
          onPress: () => {
            Alert.alert('Em breve', 'Esta funcionalidade estara disponivel em breve!');
          },
        },
      ]
    );
  }

  function handleSettingsPress() {
    router.push('/settings' as any);
  }

  function handleMenuPress() {
    setMenuVisible(true);
  }

  async function handleShareProfile() {
    try {
      await Share.share({
        message: `Confira o perfil de @${currentUser.username} no Roteirize!\nhttps://roteirize.app/${currentUser.username}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  }

  function handleDiscoverPeople() {
    router.push('/search' as any);
  }

  function handleFollowersPress() {
    router.push(`/profile/followers/${currentUser.id}` as any);
  }

  function handleFollowingPress() {
    router.push(`/profile/following/${currentUser.id}` as any);
  }

  function handleWebsitePress() {
    Linking.openURL(`https://${tempWebsite}`).catch(() => {
      Alert.alert('Erro', 'Nao foi possivel abrir o link');
    });
  }

  function handleCreateAlbum() {
    setNewAlbumTitle('');
    setNewAlbumDescription('');
    setNewAlbumLocation('');
    setNewAlbumPhotos([]);
    setCreateAlbumModalVisible(true);
  }

  async function handlePickAlbumPhotos() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissao necessaria', 'Precisamos de acesso a sua galeria para adicionar fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map((asset) => asset.uri);
      setNewAlbumPhotos((prev) => [...prev, ...uris]);
    }
  }

  function handleRemoveAlbumPhoto(index: number) {
    setNewAlbumPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSaveAlbum() {
    if (!newAlbumTitle.trim()) {
      Alert.alert('Erro', 'Digite um titulo para o album');
      return;
    }

    if (newAlbumPhotos.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos uma foto ao album');
      return;
    }

    const newAlbum: TripAlbum = {
      id: Date.now().toString(),
      title: newAlbumTitle.trim(),
      description: newAlbumDescription.trim(),
      location: newAlbumLocation.trim() || undefined,
      coverImage: newAlbumPhotos[0],
      photos: newAlbumPhotos,
      createdAt: new Date().toISOString(),
    };

    setAlbums((prev) => [newAlbum, ...prev]);
    setCreateAlbumModalVisible(false);
    Alert.alert('Sucesso', 'Album criado com sucesso!');
  }

  function handleAlbumPress(album: TripAlbum) {
    setSelectedAlbum(album);
    setAlbumViewerVisible(true);
  }

  function handleDeleteAlbum(albumId: string) {
    Alert.alert(
      'Excluir album',
      'Tem certeza que deseja excluir este album?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setAlbums((prev) => prev.filter((a) => a.id !== albumId));
            setAlbumViewerVisible(false);
            setSelectedAlbum(null);
          },
        },
      ]
    );
  }

  const menuOptions: MenuOption[] = [
    {
      icon: 'settings-outline',
      label: 'Configuracoes',
      onPress: handleSettingsPress,
    },
    {
      icon: 'time-outline',
      label: 'Seu historico',
      onPress: () => Alert.alert('Historico', 'Seu historico de atividades'),
    },
    {
      icon: 'bookmark-outline',
      label: 'Salvos',
      onPress: () => router.push('/saved' as any),
    },
    {
      icon: 'qr-code-outline',
      label: 'Codigo QR',
      onPress: () => Alert.alert('QR Code', 'Seu codigo QR pessoal'),
    },
    {
      icon: 'star-outline',
      label: 'Favoritos',
      onPress: () => Alert.alert('Favoritos', 'Lista de amigos favoritos'),
    },
    {
      icon: 'people-outline',
      label: 'Melhores amigos',
      onPress: () => Alert.alert('Melhores amigos', 'Gerenciar lista de melhores amigos'),
    },
  ];

  function renderHeader() {
    return (
      <View>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Ionicons name="lock-closed-outline" size={16} color={colors.text} />
            <Text style={styles.topBarUsername}>{currentUser.username}</Text>
          </View>
          <View style={styles.topBarRight}>
            <Pressable onPress={handleMenuPress} style={styles.topBarIcon}>
              <Ionicons name="menu-outline" size={28} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Pressable onPress={handlePickImage} style={styles.avatarContainer}>
            <Image
              source={profileImage ? { uri: profileImage } : { uri: currentUser.avatar }}
              style={styles.avatar}
            />
          </Pressable>

          <View style={styles.statsContainer}>
            <Pressable style={styles.statItem}>
              <Text style={styles.statNumber}>{myPosts.length}</Text>
              <Text style={styles.statLabel}>publicacoes</Text>
            </Pressable>
            <Pressable style={styles.statItem} onPress={handleFollowersPress}>
              <Text style={styles.statNumber}>{currentUser.followersCount}</Text>
              <Text style={styles.statLabel}>seguidores</Text>
            </Pressable>
            <Pressable style={styles.statItem} onPress={handleFollowingPress}>
              <Text style={styles.statNumber}>{currentUser.followingCount}</Text>
              <Text style={styles.statLabel}>seguindo</Text>
            </Pressable>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.bioSection}>
          <Text style={styles.displayName}>{currentUser.name}</Text>
          <Text style={styles.bioText}>{currentUser.bio}</Text>
          <Pressable onPress={handleWebsitePress}>
            <Text style={styles.websiteLink}>{tempWebsite}</Text>
          </Pressable>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <View style={styles.actionButtonWrapper}>
            <Button
              title="Editar perfil"
              variant="secondary"
              size="small"
              onPress={handleEditProfile}
            />
          </View>
          <View style={styles.actionButtonWrapper}>
            <Button
              title="Compartilhar perfil"
              variant="secondary"
              size="small"
              onPress={handleShareProfile}
            />
          </View>
          <Pressable style={styles.discoverButton} onPress={handleDiscoverPeople}>
            <Ionicons name="person-add-outline" size={16} color={colors.text} />
          </Pressable>
        </View>

        {/* Story Highlights */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.highlightsContainer}
        >
          <AddHighlight onPress={handleAddHighlight} styles={styles} colors={colors} />
          {HIGHLIGHTS.map((highlight) => (
            <HighlightItem
              key={highlight.id}
              highlight={highlight}
              onPress={() => handleHighlightPress(highlight)}
              styles={styles}
              colors={colors}
            />
          ))}
        </ScrollView>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabItem, activeTab === 'posts' && styles.tabItemActive]}
            onPress={() => setActiveTab('posts')}
          >
            <Ionicons
              name="grid-outline"
              size={24}
              color={activeTab === 'posts' ? colors.text : colors.muted}
            />
          </Pressable>
          <Pressable
            style={[styles.tabItem, activeTab === 'albums' && styles.tabItemActive]}
            onPress={() => setActiveTab('albums')}
          >
            <Ionicons
              name="albums-outline"
              size={24}
              color={activeTab === 'albums' ? colors.text : colors.muted}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  function renderEmptyPosts() {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="camera-outline" size={48} color={colors.text} />
        </View>
        <Text style={styles.emptyTitle}>Compartilhe fotos</Text>
        <Text style={styles.emptySubtitle}>
          Quando voce compartilhar fotos, elas aparecerao no seu perfil.
        </Text>
        <Pressable onPress={() => router.push('/post/create' as any)}>
          <Text style={styles.emptyLink}>Compartilhe sua primeira foto</Text>
        </Pressable>
      </View>
    );
  }

  function renderContent() {
    if (activeTab === 'posts') {
      if (myPosts.length === 0) {
        return renderEmptyPosts();
      }
      return (
        <View style={styles.postsGrid}>
          {myPosts.map((post, index) => (
            <PostGridItem
              key={post.id}
              post={post}
              onPress={() => handlePostPress(post.id, index)}
              styles={styles}
            />
          ))}
        </View>
      );
    }

    if (albums.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="albums-outline" size={48} color={colors.text} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum album ainda</Text>
          <Text style={styles.emptySubtitle}>
            Crie albuns para organizar e compartilhar suas viagens.
          </Text>
          <Pressable onPress={handleCreateAlbum}>
            <Text style={styles.emptyLink}>Criar primeiro album</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View>
        <Pressable style={styles.addAlbumButton} onPress={handleCreateAlbum}>
          <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.addAlbumButtonText}>Criar novo album</Text>
        </Pressable>
        <View style={styles.albumsGrid}>
          {albums.map((album) => (
            <Pressable
              key={album.id}
              style={styles.albumGridItem}
              onPress={() => handleAlbumPress(album)}
            >
              <Image source={{ uri: album.coverImage }} style={styles.albumCoverImage} />
              <View style={styles.albumOverlay}>
                <Text style={styles.albumTitle} numberOfLines={1}>{album.title}</Text>
                <Text style={styles.albumPhotoCount}>{album.photos.length} fotos</Text>
              </View>
              {album.location && (
                <View style={styles.albumLocationBadge}>
                  <Ionicons name="location" size={12} color="#FFFFFF" />
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderContent()}
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setEditModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancelar</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Editar perfil</Text>
            <Pressable onPress={handleSaveProfile}>
              <Text style={styles.modalDone}>Concluir</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Profile Photo */}
            <Pressable style={styles.editPhotoContainer} onPress={handlePickImage}>
              <Image
                source={profileImage ? { uri: profileImage } : { uri: currentUser.avatar }}
                style={styles.editAvatar}
              />
              <Text style={styles.editPhotoText}>Editar foto</Text>
            </Pressable>

            {/* Edit Fields */}
            <View style={styles.editFieldsContainer}>
              <View style={styles.editField}>
                <Text style={styles.editFieldLabel}>Nome</Text>
                <TextInput
                  style={styles.editFieldInput}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Nome"
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View style={styles.editField}>
                <Text style={styles.editFieldLabel}>Nome de usuario</Text>
                <TextInput
                  style={styles.editFieldInput}
                  value={tempUsername}
                  onChangeText={setTempUsername}
                  placeholder="Nome de usuario"
                  placeholderTextColor={colors.muted}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.editField}>
                <Text style={styles.editFieldLabel}>Bio</Text>
                <TextInput
                  style={styles.editFieldInput}
                  value={tempBio}
                  onChangeText={setTempBio}
                  placeholder="Bio"
                  placeholderTextColor={colors.muted}
                  multiline
                />
              </View>

              <View style={styles.editField}>
                <Text style={styles.editFieldLabel}>Link</Text>
                <TextInput
                  style={styles.editFieldInput}
                  value={tempWebsite}
                  onChangeText={setTempWebsite}
                  placeholder="Adicionar link"
                  placeholderTextColor={colors.muted}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.editSectionDivider} />

            <Pressable
              style={styles.editOption}
              onPress={() => Alert.alert('Conta profissional', 'Mude para conta profissional')}
            >
              <Text style={styles.editOptionText}>Mudar para conta profissional</Text>
            </Pressable>

            <Pressable
              style={styles.editOption}
              onPress={() => {
                setEditModalVisible(false);
                router.push('/settings' as any);
              }}
            >
              <Text style={styles.editOptionText}>Configuracoes de privacidade</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Menu Bottom Sheet */}
      <MenuSheet
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        options={menuOptions}
        styles={styles}
        colors={colors}
      />

      {/* Story Viewer for Highlights */}
      {storyViewerVisible && selectedHighlight && (
        <StoryViewer
          stories={selectedHighlight.stories}
          initialIndex={0}
          onClose={() => {
            setStoryViewerVisible(false);
            setSelectedHighlight(null);
          }}
        />
      )}

      {/* Create Album Modal */}
      <Modal
        visible={createAlbumModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCreateAlbumModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.createAlbumHeader}>
            <Pressable onPress={() => setCreateAlbumModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancelar</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Novo Album</Text>
            <Pressable onPress={handleSaveAlbum}>
              <Text style={styles.modalDone}>Criar</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.createAlbumBody}>
            {/* Photo Picker */}
            <View style={styles.photoPickerSection}>
              <Pressable style={styles.photoPickerButton} onPress={handlePickAlbumPhotos}>
                <Ionicons name="images-outline" size={32} color={colors.muted} />
                <Text style={styles.photoPickerText}>Adicionar fotos</Text>
              </Pressable>

              {newAlbumPhotos.length > 0 && (
                <View style={styles.selectedPhotosContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedPhotosScroll}>
                    {newAlbumPhotos.map((photo, index) => (
                      <View key={index} style={styles.selectedPhotoWrapper}>
                        <Image source={{ uri: photo }} style={styles.selectedPhoto} />
                        <Pressable
                          style={styles.removePhotoButton}
                          onPress={() => handleRemoveAlbumPhoto(index)}
                        >
                          <Ionicons name="close" size={16} color="#FFFFFF" />
                        </Pressable>
                      </View>
                    ))}
                  </ScrollView>
                  <Text style={styles.photosCount}>{newAlbumPhotos.length} foto(s) selecionada(s)</Text>
                </View>
              )}
            </View>

            {/* Album Form */}
            <View style={styles.albumFormSection}>
              <View style={styles.albumFormField}>
                <Text style={styles.albumFormLabel}>Titulo do album *</Text>
                <TextInput
                  style={styles.albumFormInput}
                  value={newAlbumTitle}
                  onChangeText={setNewAlbumTitle}
                  placeholder="Ex: Viagem a Paris"
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View style={styles.albumFormField}>
                <Text style={styles.albumFormLabel}>Descricao</Text>
                <TextInput
                  style={styles.albumFormTextArea}
                  value={newAlbumDescription}
                  onChangeText={setNewAlbumDescription}
                  placeholder="Conte um pouco sobre essa viagem..."
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.albumFormField}>
                <Text style={styles.albumFormLabel}>Localizacao</Text>
                <TextInput
                  style={styles.albumFormInput}
                  value={newAlbumLocation}
                  onChangeText={setNewAlbumLocation}
                  placeholder="Ex: Paris, Franca"
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Album Viewer Modal */}
      <Modal
        visible={albumViewerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setAlbumViewerVisible(false);
          setSelectedAlbum(null);
        }}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.albumViewerHeader}>
            <Pressable onPress={() => {
              setAlbumViewerVisible(false);
              setSelectedAlbum(null);
            }}>
              <Ionicons name="close" size={28} color={colors.text} />
            </Pressable>
            <Text style={styles.albumViewerTitle}>{selectedAlbum?.title}</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView>
            {selectedAlbum?.description && (
              <View style={styles.albumViewerInfo}>
                <Text style={styles.albumViewerDescription}>{selectedAlbum.description}</Text>
                {selectedAlbum.location && (
                  <View style={styles.albumViewerLocation}>
                    <Ionicons name="location-outline" size={16} color={colors.muted} />
                    <Text style={styles.albumViewerLocationText}>{selectedAlbum.location}</Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.albumViewerPhotosGrid}>
              {selectedAlbum?.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.albumViewerPhoto} />
              ))}
            </View>

            <Pressable
              style={styles.deleteAlbumButton}
              onPress={() => selectedAlbum && handleDeleteAlbum(selectedAlbum.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#ED4956" />
              <Text style={styles.deleteAlbumText}>Excluir album</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
  scrollContent: {
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topBarUsername: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarIcon: {
    padding: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarAddButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
  },
  bioSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  displayName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  bioText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  websiteLink: {
    fontSize: 14,
    color: colors.link,
    fontWeight: '500',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  actionButtonWrapper: {
    flex: 1,
  },
  discoverButton: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 16,
  },
  highlightItem: {
    alignItems: 'center',
    width: 70,
  },
  highlightRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  highlightImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  highlightTitle: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  addHighlightCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.text,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postGridItem: {
    width: POST_SIZE,
    height: POST_SIZE,
    margin: 1,
  },
  postGridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  postMultipleIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  // Modal styles
  modalSafe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalCancel: {
    fontSize: 16,
    color: colors.text,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalDone: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  modalBody: {
    flex: 1,
  },
  editPhotoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  editAvatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    marginBottom: 12,
  },
  editPhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  editFieldsContainer: {
    paddingHorizontal: 16,
  },
  editField: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
  },
  editFieldLabel: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  editFieldInput: {
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  editSectionDivider: {
    height: 8,
    backgroundColor: colors.surface,
    marginVertical: 16,
  },
  editOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  editOptionText: {
    fontSize: 16,
    color: colors.primary,
  },
  // Menu styles
  menuOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  menuDrag: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.disabled,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  menuOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  menuOptionDestructive: {
    color: '#ED4956',
  },
  menuCancelButton: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  menuCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  // Album styles
  addAlbumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  addAlbumButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  albumsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 1,
  },
  albumGridItem: {
    width: (SCREEN_WIDTH - 4) / 2,
    height: (SCREEN_WIDTH - 4) / 2,
    margin: 1,
    position: 'relative',
  },
  albumCoverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  albumOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  albumPhotoCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  albumLocationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  // Create album modal styles
  createAlbumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  createAlbumBody: {
    flex: 1,
  },
  photoPickerSection: {
    padding: 16,
  },
  photoPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 40,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
  },
  photoPickerText: {
    fontSize: 16,
    color: colors.muted,
  },
  selectedPhotosContainer: {
    marginTop: 16,
  },
  selectedPhotosScroll: {
    gap: 8,
  },
  selectedPhotoWrapper: {
    position: 'relative',
  },
  selectedPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ED4956',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photosCount: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 8,
  },
  albumFormSection: {
    paddingHorizontal: 16,
  },
  albumFormField: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
  },
  albumFormLabel: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  albumFormInput: {
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  albumFormTextArea: {
    fontSize: 16,
    color: colors.text,
    padding: 0,
    minHeight: 60,
  },
  // Album viewer modal styles
  albumViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  albumViewerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  albumViewerInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  albumViewerDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  albumViewerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  albumViewerLocationText: {
    fontSize: 14,
    color: colors.muted,
  },
  albumViewerPhotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  albumViewerPhoto: {
    width: POST_SIZE,
    height: POST_SIZE,
    margin: 1,
  },
  deleteAlbumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
  },
  deleteAlbumText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ED4956',
  },
  });
}
