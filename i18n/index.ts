import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ptBR from './locales/pt-BR';
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import it from './locales/it';
import de from './locales/de';

const LANGUAGE_STORAGE_KEY = '@roteirize:language';

export const SUPPORTED_LANGUAGES = {
  'pt-BR': { nativeName: 'Português (Brasil)' },
  en: { nativeName: 'English' },
  es: { nativeName: 'Español' },
  fr: { nativeName: 'Français' },
  it: { nativeName: 'Italiano' },
  de: { nativeName: 'Deutsch' },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

const resources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  it: { translation: it },
  de: { translation: de },
};

function getDeviceLanguage(): SupportedLanguage {
  const locales = getLocales();
  const deviceLocale = locales[0]?.languageTag || 'pt-BR';

  if (deviceLocale in resources) {
    return deviceLocale as SupportedLanguage;
  }

  const languageCode = deviceLocale.split('-')[0];
  if (languageCode === 'pt') return 'pt-BR';
  if (languageCode in resources) return languageCode as SupportedLanguage;

  return 'pt-BR';
}

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && savedLanguage in resources) {
        callback(savedLanguage);
        return;
      }
    } catch (error) {
      console.log('Error loading language preference:', error);
    }
    callback(getDeviceLanguage());
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    } catch (error) {
      console.log('Error saving language preference:', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
