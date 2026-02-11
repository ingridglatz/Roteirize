import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
} from '../i18n';

type LanguageState = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
};

const LanguageContext = createContext<LanguageState | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@roteirize:language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || 'pt-BR',
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  // Sync state when i18n language changes (e.g. async device detection)
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      if (lng in SUPPORTED_LANGUAGES) {
        setLanguageState(lng as SupportedLanguage);
      }
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  async function loadLanguage() {
    try {
      const savedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLang && savedLang in SUPPORTED_LANGUAGES) {
        setLanguageState(savedLang as SupportedLanguage);
        await i18n.changeLanguage(savedLang);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function setLanguage(newLang: SupportedLanguage) {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      await i18n.changeLanguage(newLang);
      setLanguageState(newLang);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  }

  if (isLoading) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
