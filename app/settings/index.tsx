import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from '../../i18n';
import { getColors } from '../../theme/colors';

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  showArrow?: boolean;
  destructive?: boolean;
  value?: string;
  colors: ReturnType<typeof getColors>;
  styles: any;
};

function SettingItem({
  icon,
  label,
  onPress,
  showArrow = true,
  destructive = false,
  value,
  colors,
  styles,
}: SettingItemProps) {
  return (
    <Pressable style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingItemLeft}>
        <Ionicons
          name={icon}
          size={24}
          color={destructive ? '#ED4956' : colors.text}
        />
        <Text
          style={[
            styles.settingItemLabel,
            destructive && styles.destructiveText,
          ]}
        >
          {label}
        </Text>
      </View>
      <View style={styles.settingItemRight}>
        {value && <Text style={styles.settingItemValue}>{value}</Text>}
        {showArrow && (
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        )}
      </View>
    </Pressable>
  );
}

type SettingToggleProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  colors: ReturnType<typeof getColors>;
  styles: any;
};

function SettingToggle({
  icon,
  label,
  value,
  onValueChange,
  colors,
  styles,
}: SettingToggleProps) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon} size={24} color={colors.text} />
        <Text style={styles.settingItemLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.disabled, true: colors.primary }}
        thumbColor={colors.card}
      />
    </View>
  );
}

export default function Settings() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  const colors = getColors(theme);
  const { t } = useTranslation();

  const { language, setLanguage } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const styles = useMemo(() => createStyles(colors), [colors]);

  function handleBack() {
    router.back();
  }

  function handleEditProfile() {
    router.back();
    setTimeout(() => {
      router.push('/(tabs)/perfil');
    }, 100);
  }

  function handleNotifications() {
    router.push('/settings/notifications' as any);
  }

  function handlePrivacy() {
    Alert.alert(t('settings.privacy'), t('settings.privacyMessage'));
  }

  function handleSecurity() {
    Alert.alert(t('settings.security'), t('settings.securityMessage'));
  }

  function handleAccount() {
    Alert.alert(t('settings.accountItem'), t('settings.manageAccount'));
  }

  function handleHelp() {
    Alert.alert(t('settings.help'), t('settings.helpMessage'));
  }

  function handleAbout() {
    Alert.alert(t('settings.about'), t('settings.aboutMessage'));
  }

  function handleLogout() {
    Alert.alert(t('settings.logout'), t('settings.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.logout'),
        style: 'destructive',
        onPress: () => {
          router.replace('/(auth)');
        },
      },
    ]);
  }

  function handleDeleteAccount() {
    Alert.alert(
      t('settings.deleteAccount'),
      t('settings.deleteAccountWarning'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('settings.accountDeleted'),
              t('settings.accountDeletedMessage'),
            );
            router.replace('/(auth)');
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
          <SettingItem
            icon="person-outline"
            label={t('settings.editProfile')}
            onPress={handleEditProfile}
            colors={colors}
            styles={styles}
          />
          <SettingItem
            icon="shield-outline"
            label={t('settings.security')}
            onPress={handleSecurity}
            colors={colors}
            styles={styles}
          />
          <SettingItem
            icon="lock-closed-outline"
            label={t('settings.privacy')}
            onPress={handlePrivacy}
            colors={colors}
            styles={styles}
          />
          <SettingItem
            icon="card-outline"
            label={t('settings.accountItem')}
            onPress={handleAccount}
            value={'@' + currentUser.username}
            colors={colors}
            styles={styles}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
          <SettingToggle
            icon="notifications-outline"
            label={t('settings.notifications')}
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            colors={colors}
            styles={styles}
          />
          <SettingToggle
            icon="eye-off-outline"
            label={t('settings.privateAccount')}
            value={privateAccount}
            onValueChange={setPrivateAccount}
            colors={colors}
            styles={styles}
          />
          <SettingToggle
            icon="moon-outline"
            label={t('settings.darkMode')}
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            colors={colors}
            styles={styles}
          />
          <SettingItem
            icon="language-outline"
            label={t('settings.language')}
            onPress={() => setLanguageModalVisible(true)}
            value={SUPPORTED_LANGUAGES[language].nativeName}
            colors={colors}
            styles={styles}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.support')}</Text>
          <SettingItem
            icon="help-circle-outline"
            label={t('settings.help')}
            onPress={handleHelp}
            colors={colors}
            styles={styles}
          />
          <SettingItem
            icon="information-circle-outline"
            label={t('settings.about')}
            onPress={handleAbout}
            colors={colors}
            styles={styles}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.loginSection')}</Text>
          <SettingItem
            icon="log-out-outline"
            label={t('settings.logout')}
            onPress={handleLogout}
            showArrow={false}
            destructive
            colors={colors}
            styles={styles}
          />
          <SettingItem
            icon="trash-outline"
            label={t('settings.deleteAccount')}
            onPress={handleDeleteAccount}
            showArrow={false}
            destructive
            colors={colors}
            styles={styles}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Roteirize</Text>
          <Text style={styles.footerVersion}>{t('settings.version', { version: '1.0.0' })}</Text>
        </View>
      </ScrollView>

      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t('settings.selectLanguage')}
            </Text>
            {(
              Object.entries(SUPPORTED_LANGUAGES) as [
                SupportedLanguage,
                { nativeName: string },
              ][]
            ).map(([key, { nativeName }]) => (
              <Pressable
                key={key}
                style={styles.languageOption}
                onPress={() => {
                  setLanguage(key);
                  setLanguageModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    key === language && styles.languageOptionSelected,
                  ]}
                >
                  {nativeName}
                </Text>
                {key === language && (
                  <Ionicons
                    name="checkmark"
                    size={22}
                    color={colors.primary}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
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
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    container: {
      flex: 1,
    },
    section: {
      paddingTop: 24,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.muted,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    settingItemLabel: {
      fontSize: 16,
      color: colors.text,
    },
    settingItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    settingItemValue: {
      fontSize: 14,
      color: colors.muted,
    },
    destructiveText: {
      color: '#ED4956',
    },
    footer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    footerText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.muted,
    },
    footerVersion: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    modalContent: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
    },
    languageOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    languageOptionText: {
      fontSize: 16,
      color: colors.text,
    },
    languageOptionSelected: {
      fontWeight: '700',
      color: colors.primary,
    },
  });
}
