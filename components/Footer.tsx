import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { colors } from '../theme/colors';

type Props = {
  active: 'home' | 'search' | 'map' | 'profile';
};

export default function Footer({ active }: Props) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  function animate(route: '/home' | '/search' | '/map' | '/profile') {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => router.push(route));
  }

  return (
    <View style={styles.footer}>
      <FooterItem
        icon="home"
        active={active === 'home'}
        onPress={() => animate('/home')}
        scale={scale}
      />
      <FooterItem
        icon="magnify"
        active={active === 'search'}
        onPress={() => animate('/search')}
        scale={scale}
      />
      <FooterItem
        icon="map-outline"
        active={active === 'map'}
        onPress={() => animate('/map')}
        scale={scale}
      />
      <FooterItem
        icon="account-outline"
        active={active === 'profile'}
        onPress={() => animate('/profile')}
        scale={scale}
      />
    </View>
  );
}

function FooterItem({ icon, active, onPress, scale }: any) {
  return (
    <Pressable onPress={onPress}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialCommunityIcons
          name={icon}
          size={30}
          color={active ? colors.primary : colors.muted}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    height: 68,
    backgroundColor: '#fff',
    borderRadius: 34,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
});
