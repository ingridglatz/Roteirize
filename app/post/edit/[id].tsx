import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../../../theme/colors';
import { useTheme } from '../../../context/ThemeContext';
import { useSocial } from '../../../context/SocialContext';

export default function EditPost() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts, updatePost } = useSocial();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();

  const post = posts.find((p) => p.id === id);

  const [caption, setCaption] = useState(post?.caption || '');
  const [location, setLocation] = useState(post?.location || '');
  const [allowComments, setAllowComments] = useState(post?.allowComments ?? true);
  const [hideLikes, setHideLikes] = useState(post?.hideLikes ?? false);

  if (!post) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('post.postNotFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  function handleSave() {
    updatePost(id, {
      caption: caption.trim(),
      location: location.trim(),
      allowComments,
      hideLikes,
    });

    Alert.alert(t('common.success'), t('post.postUpdated'), [
      {
        text: t('common.ok'),
        onPress: () => router.back(),
      },
    ]);
  }

  function handleCancel() {
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleCancel}>
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('post.editTitle')}</Text>
        <Pressable onPress={handleSave}>
          <Text style={styles.saveButton}>{t('common.save')}</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={post.image} style={styles.image} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('post.caption')}</Text>
          <TextInput
            style={styles.captionInput}
            value={caption}
            onChangeText={setCaption}
            placeholder={t('post.captionPlaceholder')}
            placeholderTextColor={colors.muted}
            multiline
            maxLength={2200}
          />
          <Text style={styles.charCount}>{caption.length}/2200</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('post.location')}</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder={t('post.addLocation')}
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('post.disableCommentsToggle')}</Text>
              <Text style={styles.settingDescription}>
                {t('post.disableCommentsDesc')}
              </Text>
            </View>
            <Switch
              value={!allowComments}
              onValueChange={(value) => setAllowComments(!value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('post.hideLikesToggle')}</Text>
              <Text style={styles.settingDescription}>
                {t('post.hideLikesDesc')}
              </Text>
            </View>
            <Switch
              value={hideLikes}
              onValueChange={setHideLikes}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.infoSection}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.muted}
          />
          <Text style={styles.infoText}>
            {t('post.editInfo')}
          </Text>
        </View>
      </ScrollView>
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    saveButton: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    container: {
      flex: 1,
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: colors.surface,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    section: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      fontSize: 15,
      color: colors.text,
      paddingVertical: 8,
    },
    captionInput: {
      fontSize: 15,
      color: colors.text,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    charCount: {
      fontSize: 12,
      color: colors.muted,
      textAlign: 'right',
      marginTop: 4,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
    settingTitle: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 13,
      color: colors.muted,
      lineHeight: 18,
    },
    infoSection: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      color: colors.muted,
      lineHeight: 18,
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      fontSize: 16,
      color: colors.muted,
    },
  });
}
