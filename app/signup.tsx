import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors } from '../theme/colors';

export default function Signup() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>
          Preencha os dados para começar sua jornada
        </Text>
      </View>

      {/* FORM */}
      <View style={styles.form}>
        <Input
          placeholder="Nome completo"
          value={''}
          onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          }}
        />
        <Input
          placeholder="Email"
          value={''}
          onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          }}
        />
        <Input
          placeholder="Senha"
          secureTextEntry
          value={''}
          onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          }}
        />
        <Input
          placeholder="Confirmar senha"
          secureTextEntry
          value={''}
          onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          }}
        />
      </View>

      {/* CTA */}
      <View style={styles.actions}>
        <Button
          title="Criar conta"
          onPress={() => router.replace('/interests')}
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
