import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

export default function Signup() {
  const router = useRouter();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSignup() {
    router.replace('/(onboarding)/interests');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.title}>{t('auth.signup.title')}</Text>
            <Text style={styles.subtitle}>
              {t('auth.signup.subtitle')}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              placeholder={t('auth.signup.fullName')}
              value={name}
              onChangeText={setName}
              icon="account-outline"
            />
            <Input
              placeholder={t('auth.signup.email')}
              value={email}
              onChangeText={setEmail}
              icon="email-outline"
            />
            <Input
              placeholder={t('auth.signup.password')}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              icon="lock-outline"
            />
            <Input
              placeholder={t('auth.signup.confirmPassword')}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon="lock-check-outline"
            />
          </View>

          <View style={styles.actions}>
            <Button title={t('auth.signup.createAccount')} onPress={handleSignup} />
            <Text style={styles.back} onPress={() => router.back()}>
              {t('common.back')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },

  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
  },

  form: {
    gap: 16,
  },

  actions: {
    marginTop: 'auto',
    paddingTop: 32,
    paddingBottom: 16,
  },

  back: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
