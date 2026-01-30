import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserAvatar from '../../components/social/UserAvatar';
import { useChat } from '../../context/ChatContext';
import { useSocial } from '../../context/SocialContext';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colors';
import { Story } from '../../types/Social';
import { formatTimeAgo } from '../../utils/socialHelpers';

const { width, height } = Dimensions.get('window');

type Props = {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
};

const REACTIONS = ['❤️', '😂', '😮', '😢', '👏', '🔥'];

export default function StoryViewer({ stories, initialIndex, onClose }: Props) {
  const { currentUser } = useUser();
  const { addStoryReaction, getStoryReactions } = useSocial();
  const { conversations, sendMessage } = useChat();

  const [storyIndex, setStoryIndex] = useState(initialIndex);
  const [imageIndex, setImageIndex] = useState(0);
  const [reply, setReply] = useState('');
  const [sentReaction, setSentReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const reactionScale = useRef(new Animated.Value(0)).current;

  const story = stories[storyIndex];
  const totalImages = story?.images.length ?? 0;
  const storyReactions = story ? getStoryReactions(story.id) : [];
  const isOwnStory = story?.userId === currentUser.id;

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
    if (!story) return;

    addStoryReaction(story.id, emoji);
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
    if (!reply.trim() || !story) return;

    const conversation = conversations.find((conv) =>
      conv.participantIds.includes(story.userId),
    );

    if (conversation) {
      sendMessage(conversation.id, {
        conversationId: conversation.id,
        senderId: currentUser.id,
        recipientId: story.userId,
        text: `Respondeu ao seu story: ${reply.trim()}`,
        read: false,
      });
    }

    setReply('');
    Alert.alert(
      'Resposta enviada',
      'Sua resposta foi enviada como mensagem direta',
      [{ text: 'OK' }],
    );
  }

  function handleViewReactions() {
    if (isOwnStory && storyReactions.length > 0) {
      setShowReactions(true);
    }
  }

  if (!story) return null;

  return (
    <Modal animationType="fade" transparent={false} statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={(e) => handleTap(e.nativeEvent.locationX)}
        >
          <Image source={story.images[imageIndex]} style={styles.storyImage} />
          <View style={styles.overlay} />
        </Pressable>

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

          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <UserAvatar uri={story.avatar} size={32} hasStory={false} />
              <Text style={styles.headerUser}>{story.user}</Text>
              <Text style={styles.headerTime}>
                {formatTimeAgo(story.createdAt)}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>

        {sentReaction && (
          <Animated.View
            style={[
              styles.reactionPop,
              { transform: [{ scale: reactionScale }] },
            ]}
          >
            <Text style={styles.reactionPopEmoji}>{sentReaction}</Text>
          </Animated.View>
        )}

        {isOwnStory && storyReactions.length > 0 && (
          <Pressable
            style={styles.reactionsCount}
            onPress={handleViewReactions}
          >
            <Ionicons name="heart" size={16} color="#fff" />
            <Text style={styles.reactionsCountText}>
              {storyReactions.length}
            </Text>
          </Pressable>
        )}

        <SafeAreaView style={styles.bottomSection} edges={['bottom']}>
          <View style={styles.reactionsRow}>
            {REACTIONS.map((emoji) => (
              <Pressable
                key={emoji}
                onPress={() => handleReaction(emoji)}
                style={styles.reactionButton}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
              </Pressable>
            ))}
          </View>

          {!isOwnStory && (
            <View style={styles.replyRow}>
              <TextInput
                style={styles.replyInput}
                placeholder="Enviar mensagem..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={reply}
                onChangeText={setReply}
                maxLength={200}
              />
              <Pressable
                onPress={handleSendReply}
                disabled={!reply.trim()}
                style={[
                  styles.sendButton,
                  !reply.trim() && styles.sendButtonDisabled,
                ]}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={
                    reply.trim() ? colors.primary : 'rgba(255,255,255,0.3)'
                  }
                />
              </Pressable>
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>

      <Modal
        visible={showReactions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReactions(false)}
      >
        <Pressable
          style={styles.reactionsModalOverlay}
          onPress={() => setShowReactions(false)}
        >
          <Pressable
            style={styles.reactionsModalSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.reactionsModalHeader}>
              <View style={styles.drag} />
              <Text style={styles.reactionsModalTitle}>Reações</Text>
            </View>
            <FlatList
              data={storyReactions}
              keyExtractor={(item, index) => `${item.userId}-${index}`}
              renderItem={({ item }) => (
                <View style={styles.reactionItem}>
                  <View style={styles.reactionItemInfo}>
                    <Text style={styles.reactionItemName}>{item.username}</Text>
                    <Text style={styles.reactionItemTime}>
                      {formatTimeAgo(item.createdAt)}
                    </Text>
                  </View>
                  <Text style={styles.reactionItemEmoji}>{item.emoji}</Text>
                </View>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  topSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 14,
  },
  progressTrack: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  headerTime: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionPop: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
  },
  reactionPopEmoji: {
    fontSize: 80,
  },
  reactionsCount: {
    position: 'absolute',
    right: 16,
    top: height * 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  reactionsCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
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
    gap: 16,
    marginBottom: 12,
  },
  reactionButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 22,
  },
  reactionEmoji: {
    fontSize: 24,
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replyInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#fff',
  },
  sendButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  reactionsModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  reactionsModalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: height * 0.6,
  },
  reactionsModalHeader: {
    paddingTop: 10,
    paddingBottom: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drag: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginBottom: 12,
  },
  reactionsModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  reactionItemInfo: {
    flex: 1,
  },
  reactionItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reactionItemTime: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  reactionItemEmoji: {
    fontSize: 24,
  },
});
