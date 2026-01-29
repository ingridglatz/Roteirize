import { Stack } from 'expo-router';
import { OnboardingProvider } from '../context/OnboardingContext';
import { RoteirosProvider } from '../context/RoteirosContext';

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <RoteirosProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="place/[slug]" />
          <Stack.Screen name="itinerary/[id]" />
          <Stack.Screen name="chat" />
        </Stack>
      </RoteirosProvider>
    </OnboardingProvider>
  );
}
