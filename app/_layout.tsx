import { Stack } from "expo-router";
import { OnboardingProvider } from "../context/OnboardingContext";
import { ItinerariesProvider } from "../context/ItinerariesContext";

export default function Layout() {
  return (
    <OnboardingProvider>
      <ItinerariesProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ItinerariesProvider>
    </OnboardingProvider>
  );
}
