import { Tabs, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../context/ThemeContext';
import type { ColorScheme } from '../../theme/colors';

const createStyles = (colors: ColorScheme) => StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    paddingVertical: 8,
  },
  createIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  createIconActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useColors();

  const styles = createStyles(colors);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarShowLabel: false,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="explorar"
        options={{
          title: t('tabBar.explore'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: t('tabBar.social'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'people' : 'people-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: t('tabBar.create'),
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.createIcon,
                focused && styles.createIconActive,
              ]}
            >
              <Ionicons name="add" size={24} color={focused ? colors.card : colors.muted} />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/(tabs)/create');
          },
        }}
      />
      <Tabs.Screen
        name="roteiros"
        options={{
          title: t('tabBar.itineraries'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: t('tabBar.profile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
