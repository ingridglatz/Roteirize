import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreatePost: (caption: string, image: any) => void;
  onCreateStory: (image: any) => void;
};

export default function CreateContentSheet({
  visible,
  onClose,
  onCreatePost,
  onCreateStory,
}: Props) {
  const [activeTab, setActiveTab] = useState<'post' | 'story'>('post');
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { currentUser } = useUser();

  function handleImagePick() {
    const demoImage = require('../../assets/images/praia1.jpg');
    setSelectedImage(demoImage);
  }

  function handleRemoveImage() {
    setSelectedImage(null);
  }

  function handleSubmit() {
    if (!selectedImage) {
      Alert.alert('Erro', 'Selecione uma imagem para continuar.');
      return;
    }

    if (activeTab === 'post') {
      if (!caption.trim()) {
        Alert.alert('Erro', 'Adicione uma legenda para seu post.');
        return;
      }
      onCreatePost(caption, selectedImage);
    } else {
      onCreateStory(selectedImage);
    }

    setCaption('');
    setSelectedImage(null);
    setActiveTab('post');
  }

  function handleClose() {
    setCaption('');
    setSelectedImage(null);
    setActiveTab('post');
    onClose();
  }

  if (!visible) return null;

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Pressable onPress={handleClose}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </Pressable>

            <Text style={styles.title}>Nova publicação</Text>

            <Pressable onPress={handleSubmit}>
              <Text style={styles.postButton}>Publicar</Text>
            </Pressable>
          </View>

          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, activeTab === 'post' && styles.tabActive]}
              onPress={() => setActiveTab('post')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'post' && styles.tabTextActive,
                ]}
              >
                Post
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tab, activeTab === 'story' && styles.tabActive]}
              onPress={() => setActiveTab('story')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'story' && styles.tabTextActive,
                ]}
              >
                Story
              </Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.userInfo}>
              <Image
                source={{ uri: currentUser.avatar }}
                style={styles.avatar}
              />
              <Text style={styles.userName}>{currentUser.name}</Text>
            </View>

            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image source={selectedImage} style={styles.selectedImage} />
                <Pressable
                  style={styles.removeImageButton}
                  onPress={handleRemoveImage}
                >
                  <Ionicons name="close-circle" size={28} color="#fff" />
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.imagePicker} onPress={handleImagePick}>
                <Ionicons name="image-outline" size={48} color={colors.muted} />
                <Text style={styles.imagePickerText}>Adicionar foto</Text>
              </Pressable>
            )}

            {activeTab === 'post' && (
              <TextInput
                placeholder="Escreva uma legenda..."
                placeholderTextColor={colors.muted}
                value={caption}
                onChangeText={setCaption}
                multiline
                style={styles.captionInput}
                maxLength={500}
              />
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    fontSize: 16,
    color: colors.text,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  postButton: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    color: colors.muted,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  imagePicker: {
    height: 300,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  imagePickerText: {
    fontSize: 15,
    color: colors.muted,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  selectedImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 14,
  },
  captionInput: {
    fontSize: 15,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
});
