import { Stack } from 'expo-router';
import { OnboardingProvider } from '../context/OnboardingContext';
import { RoteirosProvider } from '../context/RoteirosContext';
import { UserProvider } from '../context/UserContext';
import { SocialProvider } from '../context/SocialContext';
import { ChatProvider } from '../context/ChatContext';
import { NotificationProvider } from '../context/NotificationContext';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <SocialProvider>
          <ChatProvider>
            <NotificationProvider>
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
                    <Stack.Screen name="profile" />
                    <Stack.Screen name="post" />
                  </Stack>
                </RoteirosProvider>
              </OnboardingProvider>
            </NotificationProvider>
          </ChatProvider>
        </SocialProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
