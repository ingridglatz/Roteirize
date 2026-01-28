import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSignup() {
    router.replace('/(onboarding)/interests');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>
          Preencha os dados para comecar sua jornada
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          placeholder="Nome completo"
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Input
          placeholder="Confirmar senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <View style={styles.actions}>
        <Button
          title="Criar conta"
          onPress={handleSignup}
        />

        <Text style={styles.back} onPress={() => router.back()}>
          Voltar
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },

  header: {
    marginBottom: 32,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },

  form: {
    gap: 16,
    marginBottom: 32,
  },

  actions: {
    marginTop: 'auto',
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
