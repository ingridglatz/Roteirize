import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useMemo } from 'react';
import { getColors } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { useSocial } from '../../context/SocialContext';

type Props = {
  userId: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
};

export default function FollowButton({ userId, size = 'medium', fullWidth = false }: Props) {
  const { isFollowing, followUser, unfollowUser } = useSocial();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [loading, setLoading] = useState(false);

  const following = isFollowing(userId);

  async function handlePress() {
    setLoading(true);
    try {
      if (following) {
        unfollowUser(userId);
      } else {
        followUser(userId);
      }
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }

  const sizeStyles = {
    small: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      fontSize: 13,
    },
    medium: {
      paddingHorizontal: 24,
      paddingVertical: 8,
      fontSize: 14,
    },
    large: {
      paddingHorizontal: 32,
      paddingVertical: 10,
      fontSize: 15,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <Pressable
      style={[
        styles.button,
        following ? styles.following : styles.notFollowing,
        {
          paddingHorizontal: currentSize.paddingHorizontal,
          paddingVertical: currentSize.paddingVertical,
        },
        fullWidth && styles.fullWidth,
      ]}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={following ? colors.text : '#fff'}
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            following ? styles.followingText : styles.notFollowingText,
            { fontSize: currentSize.fontSize },
          ]}
        >
          {following ? 'Seguindo' : 'Seguir'}
        </Text>
      )}
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    button: {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 80,
    },
    notFollowing: {
      backgroundColor: colors.primary,
    },
    following: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    fullWidth: {
      width: '100%',
    },
    buttonText: {
      fontWeight: '600',
    },
    notFollowingText: {
      color: '#fff',
    },
    followingText: {
      color: colors.text,
    },
  });
}
