import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, iconScale, slideAnim]);

  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function handleReset() {
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Por favor, informe seu e-mail');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Por favor, informe um e-mail válido');
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEmailSent(true);

      Alert.alert(
        'Link enviado!',
        'Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ],
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o link. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F0FDFA', '#FFFFFF']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.iconContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: iconScale }],
                },
              ]}
            >
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name="lock-reset"
                  size={48}
                  color={colors.primary}
                />
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.title}>Esqueceu sua senha?</Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.subtitle}>
                Não se preocupe! Informe seu e-mail e enviaremos um link seguro
                para você redefinir sua senha.
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.form,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Input
                icon="email-outline"
                placeholder="Digite seu e-mail"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading && !emailSent}
                error={!!emailError}
              />

              {emailError ? (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={16}
                    color={colors.error}
                  />
                  <Text style={styles.errorText}>{emailError}</Text>
                </View>
              ) : null}

              {emailSent && (
                <View style={styles.successContainer}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={16}
                    color={colors.success}
                  />
                  <Text style={styles.successText}>
                    E-mail enviado com sucesso!
                  </Text>
                </View>
              )}
            </Animated.View>

            <Animated.View
              style={[
                styles.tipContainer,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.tipText}>
                Verifique também sua caixa de spam caso não encontre o e-mail.
              </Text>
            </Animated.View>
          </ScrollView>

          <Animated.View
            style={[
              styles.footer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Button
              title={loading ? 'Enviando...' : 'Enviar link de recuperação'}
              onPress={!loading && !emailSent ? handleReset : undefined}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 16,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${colors.text}08`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },

  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  header: {
    alignItems: 'center',
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  titleUnderline: {
    width: 50,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  form: {
    marginBottom: 24,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },

  errorText: {
    color: colors.error,
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },

  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
    backgroundColor: `${colors.success}15`,
    padding: 12,
    borderRadius: 8,
  },

  successText: {
    color: colors.success,
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '600',
  },

  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${colors.primary}08`,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  tipText: {
    flex: 1,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    marginLeft: 12,
  },

  footer: {
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: `${colors.text}08`,
  },
});
