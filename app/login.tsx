import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    console.log({ email, password });
    router.push('/interests');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
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
          <View style={styles.tab}>
            <Text style={styles.tabText}>Criar conta</Text>
          </View>
        </View>

        <View style={styles.social}>
          <Pressable style={styles.appleButton}>
            <MaterialCommunityIcons name="apple" size={22} color="#fff" />
            <Text style={styles.appleText}>Continuar com Apple</Text>
          </Pressable>

          <Pressable style={styles.googleButton}>
            <Image
              source={require('../assets/images/google.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Continuar com Google</Text>
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

          <Text style={styles.forgot}>Esqueci minha senha</Text>
        </View>

        <View>
          <Button title="Entrar" onPress={handleLogin} />
          <Link href="/welcome" style={styles.link}>
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
  },

  tabActive: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },

  tabActiveText: {
    color: '#fff',
    fontWeight: '600',
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },

  tabText: {
    color: colors.text,
    fontWeight: '500',
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

  link: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.primary,
  },
});
