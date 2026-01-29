import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [socialLoading, setSocialLoading] = useState<'apple' | 'google' | null>(
    null,
  );

  function handleLogin() {
    router.replace('/(onboarding)/interests');
  }

  function handleAppleLogin() {
    setSocialLoading('apple');

    setTimeout(() => {
      setSocialLoading(null);
      Alert.alert('Em breve', 'Login com Apple estará disponível em breve.');
    }, 800);
  }

  function handleGoogleLogin() {
    setSocialLoading('google');

    setTimeout(() => {
      setSocialLoading(null);
      Alert.alert('Em breve', 'Login com Google estará disponível em breve.');
    }, 800);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
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
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>
          </View>

          <View style={styles.social}>
            <Pressable
              onPress={handleAppleLogin}
              disabled={socialLoading !== null}
              style={({ pressed }) => [
                styles.appleButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <MaterialCommunityIcons name="apple" size={22} color="#fff" />
              <Text style={styles.appleText}>
                {socialLoading === 'apple' ? 'Aguarde...' : 'Continuar com Apple'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleGoogleLogin}
              disabled={socialLoading !== null}
              style={({ pressed }) => [
                styles.googleButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Image
                source={require('../../assets/images/google.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>
                {socialLoading === 'google'
                  ? 'Aguarde...'
                  : 'Continuar com Google'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.form}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              icon="email-outline"
            />
            <Input
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="lock-outline"
            />

            <Text
              style={styles.forgot}
              onPress={() => router.push('/(auth)/reset-password')}
            >
              Esqueci minha senha
            </Text>
          </View>

          <View style={styles.actions}>
            <Button title="Entrar" onPress={handleLogin} />

            <Text style={styles.signupText}>
              Não tem uma conta?{' '}
              <Text
                style={styles.signupLink}
                onPress={() => router.push('/(auth)/signup')}
              >
                Criar conta
              </Text>
            </Text>

            <Link href="/(auth)/welcome" style={styles.link}>
              Voltar
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardView: {
    flex: 1,
  },

  container: {
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

  social: {
    gap: 12,
    marginBottom: 16,
  },

  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
  },

  appleText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
  },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
  },

  googleIcon: {
    width: 20,
    height: 20,
  },

  googleText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    color: colors.muted,
    fontSize: 12,
  },

  form: {
    gap: 16,
  },

  forgot: {
    color: colors.primary,
    fontSize: 14,
    textAlign: 'right',
    marginTop: -8,
  },

  actions: {
    marginTop: 'auto',
    paddingTop: 24,
  },

  signupText: {
    marginTop: 20,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 14,
  },

  signupLink: {
    color: colors.primary,
    fontWeight: '600',
  },

  link: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 14,
  },
});
