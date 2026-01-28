import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
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
      Alert.alert('Em breve', 'Login com Apple estara disponivel em breve.');
    }, 800);
  }

  function handleGoogleLogin() {
    setSocialLoading('google');

    setTimeout(() => {
      setSocialLoading(null);
      Alert.alert('Em breve', 'Login com Google estara disponivel em breve.');
    }, 800);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="map-marker"
            size={44}
            color={colors.primary}
          />
          <Text style={styles.logoText}>Roteirize</Text>
        </View>

        <View style={styles.tabs}>
          <View style={styles.tabActive}>
            <Text style={styles.tabActiveText}>Entrar</Text>
          </View>

          <Pressable
            onPress={() => {
              setTimeout(() => {
                router.push('/(auth)/signup');
              }, 120);
            }}
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
          >
            <Text style={styles.tabText}>Criar conta</Text>
          </Pressable>
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
          <Text style={styles.label}>E-mail</Text>
          <Input
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <Input
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
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

          <Link href="/(auth)/welcome" style={styles.link}>
            Voltar
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    padding: 24,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  logoText: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 24,
    marginBottom: 24,
    height: 48,
  },

  tabActive: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabActiveText: {
    color: '#fff',
    fontWeight: '600',
  },

  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabText: {
    color: colors.muted,
    fontWeight: '500',
  },

  tabPressed: {
    backgroundColor: '#e6e6e6',
  },

  social: {
    gap: 12,
    marginBottom: 24,
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
    marginVertical: 24,
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
    gap: 8,
  },

  label: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },

  forgot: {
    color: colors.primary,
    marginBottom: 36,
  },

  actions: {
    marginTop: 'auto',
  },

  link: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.primary,
  },
});
