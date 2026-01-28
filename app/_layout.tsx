import { Stack } from 'expo-router';
import { OnboardingProvider } from '../context/OnboardingContext';

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="place/[slug]" />
        <Stack.Screen name="itinerary/[id]" />
        <Stack.Screen name="chat" />
      </Stack>
    </OnboardingProvider>
  );
}
