import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
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

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

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
    Alert.alert('Privacidade', 'Configuracoes de privacidade');
  }

  function handleSecurity() {
    Alert.alert('Seguranca', 'Configuracoes de seguranca');
  }

  function handleAccount() {
    Alert.alert('Conta', 'Gerenciar sua conta');
  }

  function handleHelp() {
    Alert.alert('Ajuda', 'Central de ajuda do Roteirize');
  }

  function handleAbout() {
    Alert.alert('Sobre', 'Roteirize v1.0.0\n\nSeu companheiro de viagens');
  }

  function handleLogout() {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          router.replace('/(auth)');
        },
      },
    ]);
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Excluir conta',
      'Esta acao e irreversivel. Todos os seus dados serao permanentemente excluidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Conta excluida',
              'Sua conta foi excluida com sucesso.',
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
        <Text style={styles.headerTitle}>Configuracoes</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <SettingItem
            icon="person-outline"
            label="Editar perfil"
            onPress={handleEditProfile}
            colors={colors}
            styles={styles}
          />
          <SettingItem
            icon="shield-outline"
            label="Seguranca"
            onPress={handleSecurity}
            colors={colors}
            styles={styles}
          />
          <SettingItem
            icon="lock-closed-outline"
            label="Privacidade"
            onPress={handlePrivacy}
            colors={colors}
            styles={styles}
          />
          <SettingItem
            icon="card-outline"
            label="Conta"
            onPress={handleAccount}
            value={'@' + currentUser.username}
            colors={colors}
            styles={styles}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          <SettingToggle
            icon="notifications-outline"
            label="Notificacoes"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            colors={colors}
            styles={styles}
          />
          <SettingToggle
            icon="eye-off-outline"
            label="Conta privada"
            value={privateAccount}
            onValueChange={setPrivateAccount}
            colors={colors}
            styles={styles}
          />
          <SettingToggle
            icon="moon-outline"
            label="Modo escuro"
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            colors={colors}
            styles={styles}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          <SettingItem
            icon="help-circle-outline"
            label="Ajuda"
            onPress={handleHelp}
            colors={colors}
            styles={styles}
          />
          <SettingItem
            icon="information-circle-outline"
            label="Sobre"
            onPress={handleAbout}
            colors={colors}
            styles={styles}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Login</Text>
          <SettingItem
            icon="log-out-outline"
            label="Sair"
            onPress={handleLogout}
            showArrow={false}
            destructive
            colors={colors}
            styles={styles}
          />
          <SettingItem
            icon="trash-outline"
            label="Excluir conta"
            onPress={handleDeleteAccount}
            showArrow={false}
            destructive
            colors={colors}
            styles={styles}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Roteirize</Text>
          <Text style={styles.footerVersion}>Versao 1.0.0</Text>
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
  });
}
