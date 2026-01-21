import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors } from '../theme/colors';

export default function ResetPassword() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Redefinir senha</Text>
        <Text style={styles.subtitle}>
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          placeholder="Email"
          value={''}
          onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          }}
        />
      </View>

      <View style={styles.actions}>
        <Button title="Enviar link de recuperação" />

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
