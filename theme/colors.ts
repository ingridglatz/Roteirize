export type ColorScheme = {
  primary: string;
  background: string;
  surface: string; // backgrounds secundários (cards, modais)
  card: string; // backgrounds de cards
  text: string;
  muted: string;
  border: string;
  disabled: string;
  error: string;
  success: string;
  link: string; // links e textos azuis
};

export const lightColors: ColorScheme = {
  primary: '#2CBFAE',
  background: '#FFFFFF',
  surface: '#F5F5F5', // cinza muito claro para cards/modais
  card: '#FFFFFF', // branco para cards
  text: '#1E293B',
  muted: '#64748B',
  border: '#E5E7EB',
  disabled: '#CBD5E1',
  error: '#EF4444',
  success: '#10B981',
  link: '#2563EB', // azul para links
};

export const darkColors: ColorScheme = {
  primary: '#2CBFAE',
  background: '#1E293B', // azul escuro principal
  surface: '#0F172A', // azul mais escuro para cards/modais
  card: '#334155', // cinza azulado para cards
  text: '#F1F5F9',
  muted: '#94A3B8',
  border: '#334155',
  disabled: '#475569',
  error: '#F87171',
  success: '#34D399',
  link: '#60A5FA', // azul claro para links no dark
};

// Default export for backwards compatibility
export const colors = lightColors;

export function getColors(theme: 'light' | 'dark'): ColorScheme {
  return theme === 'dark' ? darkColors : lightColors;
}
