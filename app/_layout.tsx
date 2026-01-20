import { Stack } from "expo-router";
import { OnboardingProvider } from "../context/OnboardingContext";

export default function Layout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </OnboardingProvider>
  );
}
