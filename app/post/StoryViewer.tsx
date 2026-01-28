import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  TextInput,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef, useCallback } from 'react';
import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

type Story = {
  id: string;
  user: string;
  avatar: string;
  images: any[];
  seen: boolean;
};

type Props = {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
};

const REACTIONS = ['❤️', '😂', '😮', '😢', '👏', '🔥'];

export default function StoryViewer({ stories, initialIndex, onClose }: Props) {
  const [storyIndex, setStoryIndex] = useState(initialIndex);
  const [imageIndex, setImageIndex] = useState(0);
  const [reply, setReply] = useState('');
  const [sentReaction, setSentReaction] = useState<string | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const reactionScale = useRef(new Animated.Value(0)).current;

  const story = stories[storyIndex];
  const totalImages = story?.images.length ?? 0;

  const goNext = useCallback(() => {
    if (imageIndex < totalImages - 1) {
      setImageIndex((i) => i + 1);
    } else if (storyIndex < stories.length - 1) {
      setStoryIndex((i) => i + 1);
      setImageIndex(0);
    } else {
      onClose();
    }
  }, [imageIndex, totalImages, storyIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (imageIndex > 0) {
      setImageIndex((i) => i - 1);
    } else if (storyIndex > 0) {
      setStoryIndex((i) => i - 1);
      setImageIndex(stories[storyIndex - 1].images.length - 1);
    }
  }, [imageIndex, storyIndex, stories]);

  // Auto-advance timer
  useEffect(() => {
    progressAnim.setValue(0);
    const anim = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    });
    anim.start(({ finished }) => {
      if (finished) goNext();
    });
    return () => anim.stop();
  }, [storyIndex, imageIndex, progressAnim, goNext]);

  function handleTap(x: number) {
    if (x < width * 0.3) {
      goPrev();
    } else {
      goNext();
    }
  }

  function handleReaction(emoji: string) {
    setSentReaction(emoji);
    reactionScale.setValue(0);
    Animated.sequence([
      Animated.spring(reactionScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(reactionScale, {
        toValue: 0,
        duration: 400,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start(() => setSentReaction(null));
  }

  function handleSendReply() {
    if (!reply.trim()) return;
    setReply('');
  }

  if (!story) return null;

  return (
    <Modal animationType="fade" transparent={false} statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Background image */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={(e) => handleTap(e.nativeEvent.locationX)}
        >
          <Image
            source={story.images[imageIndex]}
            style={styles.storyImage}
          />
          <View style={styles.overlay} />
        </Pressable>

        {/* Progress bars */}
        <SafeAreaView style={styles.topSection} edges={['top']}>
          <View style={styles.progressRow}>
            {story.images.map((_, idx) => {
              const progressWidth =
                idx < imageIndex
                  ? '100%'
                  : idx === imageIndex
                    ? progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      })
                    : '0%';
              return (
                <View key={idx} style={styles.progressTrack}>
                  <Animated.View
                    style={[styles.progressFill, { width: progressWidth }]}
                  />
                </View>
              );
            })}
          </View>

          {/* User info + close */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Image
                source={{ uri: story.avatar }}
                style={styles.headerAvatar}
              />
              <Text style={styles.headerUser}>{story.user}</Text>
              <Text style={styles.headerTime}>2h</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={28} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>

        {/* Reaction animation */}
        {sentReaction && (
          <Animated.View
            style={[
              styles.reactionFloat,
              { transform: [{ scale: reactionScale }] },
            ]}
          >
            <Text style={styles.reactionFloatText}>{sentReaction}</Text>
          </Animated.View>
        )}

        {/* Bottom: reactions + reply */}
        <SafeAreaView style={styles.bottomSection} edges={['bottom']}>
          <View style={styles.reactionsRow}>
            {REACTIONS.map((emoji) => (
              <Pressable
                key={emoji}
                style={styles.reactionBtn}
                onPress={() => handleReaction(emoji)}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.replyRow}>
            <TextInput
              style={styles.replyInput}
              placeholder="Envie uma mensagem..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={reply}
              onChangeText={setReply}
            />
            <Pressable onPress={handleSendReply}>
              <Ionicons
                name="send"
                size={22}
                color={reply.trim() ? '#fff' : 'rgba(255,255,255,0.3)'}
              />
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyImage: {
    width,
    height,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },

  // Top
  topSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
  },
  progressTrack: {
    flex: 1,
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
  },
  headerUser: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTime: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },

  // Reaction float
  reactionFloat: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
  },
  reactionFloatText: {
    fontSize: 80,
  },

  // Bottom
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  reactionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  reactionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionEmoji: {
    fontSize: 22,
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 4,
    gap: 10,
  },
  replyInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
});
