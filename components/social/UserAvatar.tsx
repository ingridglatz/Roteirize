import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type Props = {
  uri: string;
  size?: number;
  hasStory?: boolean;
  storySeen?: boolean;
  verified?: boolean;
  online?: boolean;
  onPress?: () => void;
};

export default function UserAvatar({
  uri,
  size = 40,
  hasStory = false,
  storySeen = false,
  verified = false,
  online = false,
  onPress,
}: Props) {
  const avatarSize = size;
  const ringSize = size + 8;
  const verifiedBadgeSize = size * 0.35;
  const onlineIndicatorSize = size * 0.28;

  const content = (
    <View style={[styles.container, { width: ringSize, height: ringSize }]}>
      {hasStory && (
        <View
          style={[
            styles.storyRing,
            {
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderColor: storySeen ? '#ccc' : colors.primary,
            },
          ]}
        />
      )}
      <Image
        source={{ uri }}
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          },
        ]}
      />
      {verified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: verifiedBadgeSize,
              height: verifiedBadgeSize,
              borderRadius: verifiedBadgeSize / 2,
              right: hasStory ? 2 : -2,
              bottom: hasStory ? 2 : -2,
            },
          ]}
        >
          <Ionicons
            name="checkmark"
            size={verifiedBadgeSize * 0.65}
            color="#fff"
          />
        </View>
      )}
      {online && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: onlineIndicatorSize,
              height: onlineIndicatorSize,
              borderRadius: onlineIndicatorSize / 2,
              right: hasStory ? 2 : 0,
              bottom: hasStory ? 2 : 0,
            },
          ]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} hitSlop={8}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyRing: {
    position: 'absolute',
    borderWidth: 2.5,
  },
  avatar: {
    backgroundColor: '#f0f0f0',
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  onlineIndicator: {
    position: 'absolute',
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
