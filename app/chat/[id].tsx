import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SharedPostPreview from '../../components/chat/SharedPostPreview';
import UserAvatar from '../../components/social/UserAvatar';
import { useChat } from '../../context/ChatContext';
import { useSocial } from '../../context/SocialContext';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { getColors } from '../../theme/colors';
import { Message } from '../../types/Social';
import { formatTimeAgo } from '../../utils/socialHelpers';

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    headerInfo: {
      flex: 1,
    },
    headerNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    headerStatus: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    messagesList: {
      padding: 16,
      paddingBottom: 8,
    },
    messageBubble: {
      maxWidth: '78%',
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 8,
      position: 'relative',
    },
    myMessage: {
      alignSelf: 'flex-end',
      backgroundColor: colors.primary,
      borderBottomRightRadius: 4,
    },
    theirMessage: {
      alignSelf: 'flex-start',
      backgroundColor: colors.card,
      borderBottomLeftRadius: 4,
    },
    messageText: {
      fontSize: 15,
      lineHeight: 21,
    },
    myMessageText: {
      color: '#fff',
    },
    theirMessageText: {
      color: colors.text,
    },
    messageFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    messageTime: {
      fontSize: 10,
    },
    myMessageTime: {
      color: 'rgba(255,255,255,0.6)',
    },
    theirMessageTime: {
      color: colors.muted,
    },
    reactionBadge: {
      position: 'absolute',
      bottom: -8,
      right: 8,
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    reactionEmoji: {
      fontSize: 14,
    },
    mediaImage: {
      width: 200,
      height: 200,
      borderRadius: 12,
      marginBottom: 4,
    },
    mediaVideo: {
      width: 200,
      height: 200,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
    },
    mediaVideoText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
      marginTop: 8,
    },
    documentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 8,
      marginBottom: 4,
    },
    documentName: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
      gap: 8,
    },
    attachBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 6,
    },
    chatInput: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'ios' ? 10 : 8,
      paddingBottom: Platform.OS === 'ios' ? 10 : 8,
      fontSize: 15,
      maxHeight: 100,
      color: colors.text,
    },
    sendBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendBtnDisabled: {
      backgroundColor: colors.border,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginTop: 16,
    },
    emptyUsername: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 4,
    },
    emptyText: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 12,
      textAlign: 'center',
      paddingHorizontal: 40,
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      fontSize: 16,
      color: colors.muted,
    },
  });
}

export default function Conversation() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser } = useUser();
  const {
    getConversation,
    getMessages,
    sendMessage,
    markAsRead,
    setTyping,
    reactToMessage,
    deleteMessage,
  } = useChat();
  const { getUser } = useSocial();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const conversation = getConversation(id as string);
  const messages = getMessages(id as string);
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const recipient = useMemo(() => {
    if (!conversation) return null;
    const recipientId = conversation.participants.find(
      (p) => p.id !== currentUser.id,
    );
    return recipientId ? getUser(recipientId.id) : null;
  }, [conversation, currentUser.id, getUser]);

  const isTyping = conversation?.typing && conversation.typing.length > 0;

  useEffect(() => {
    if (id) {
      markAsRead(id as string);
    }
  }, [id, markAsRead]);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout | number;
    if (text.trim()) {
      setTyping(id as string, true);
      typingTimeout = setTimeout(() => {
        setTyping(id as string, false);
      }, 2000);
    } else {
      setTyping(id as string, false);
    }
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
      setTyping(id as string, false);
    };
  }, [text, id, setTyping]);

  function handleSend() {
    if (!text.trim() || !recipient) return;

    sendMessage(id as string, {
      conversationId: id as string,
      senderId: currentUser.id,
      recipientId: recipient.id,
      text: text.trim(),
      read: false,
    });

    setText('');
  }

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de permissão para acessar suas fotos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0] && recipient) {
      sendMessage(id as string, {
        conversationId: id as string,
        senderId: currentUser.id,
        recipientId: recipient.id,
        mediaUrl: result.assets[0].uri,
        mediaType: 'image',
        read: false,
      });
    }
  }

  async function handlePickVideo() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de permissão para acessar seus vídeos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0] && recipient) {
      sendMessage(id as string, {
        conversationId: id as string,
        senderId: currentUser.id,
        recipientId: recipient.id,
        mediaUrl: result.assets[0].uri,
        mediaType: 'video',
        read: false,
      });
    }
  }

  async function handlePickDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets[0] && recipient) {
        sendMessage(id as string, {
          conversationId: id as string,
          senderId: currentUser.id,
          recipientId: recipient.id,
          mediaUrl: result.assets[0].uri,
          mediaType: 'document',
          mediaName: result.assets[0].name,
          read: false,
        });
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível selecionar o documento.');
    }
  }

  function handleAttachmentPress() {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Foto', 'Vídeo', 'Documento'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handlePickImage();
          } else if (buttonIndex === 2) {
            handlePickVideo();
          } else if (buttonIndex === 3) {
            handlePickDocument();
          }
        }
      );
    } else {
      Alert.alert('Enviar arquivo', 'Escolha o tipo de arquivo:', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Foto', onPress: handlePickImage },
        { text: 'Vídeo', onPress: handlePickVideo },
        { text: 'Documento', onPress: handlePickDocument },
      ]);
    }
  }

  function handleLongPress(message: Message) {
    if (message.senderId !== currentUser.id) {
      Alert.alert('Reagir à mensagem', '', [
        {
          text: '❤️',
          onPress: () => reactToMessage(message.id, '❤️'),
        },
        {
          text: '😂',
          onPress: () => reactToMessage(message.id, '😂'),
        },
        {
          text: '😮',
          onPress: () => reactToMessage(message.id, '😮'),
        },
        {
          text: '😢',
          onPress: () => reactToMessage(message.id, '😢'),
        },
        {
          text: '👍',
          onPress: () => reactToMessage(message.id, '👍'),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]);
    } else {
      Alert.alert('Opções da mensagem', '', [
        {
          text: 'Excluir mensagem',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Excluir mensagem',
              'Tem certeza que deseja excluir esta mensagem?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Excluir',
                  style: 'destructive',
                  onPress: () => deleteMessage(message.id),
                },
              ],
            );
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]);
    }
  }

  function renderMessage({ item }: { item: Message }) {
    const isMe = item.senderId === currentUser.id;
    const showReadReceipt = isMe && item.read;

    return (
      <Pressable
        onLongPress={() => handleLongPress(item)}
        style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        {item.mediaType === 'image' && item.mediaUrl && (
          <Image
            source={{ uri: item.mediaUrl }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        )}

        {item.mediaType === 'video' && item.mediaUrl && (
          <View style={styles.mediaVideo}>
            <Ionicons name="play-circle" size={48} color="#fff" />
            <Text style={styles.mediaVideoText}>Vídeo</Text>
          </View>
        )}

        {item.mediaType === 'document' && item.mediaUrl && (
          <View style={styles.documentContainer}>
            <Ionicons
              name="document-attach"
              size={24}
              color={isMe ? '#fff' : colors.text}
            />
            <Text
              style={[
                styles.documentName,
                isMe ? styles.myMessageText : styles.theirMessageText,
              ]}
              numberOfLines={1}
            >
              {item.mediaName || 'Documento'}
            </Text>
          </View>
        )}

        {item.text && (
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.theirMessageText,
            ]}
          >
            {item.text}
          </Text>
        )}

        {item.sharedPost && (
          <SharedPostPreview postId={item.sharedPost.postId} />
        )}

        {item.reaction && (
          <View style={styles.reactionBadge}>
            <Text style={styles.reactionEmoji}>{item.reaction}</Text>
          </View>
        )}

        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.messageTime,
              isMe ? styles.myMessageTime : styles.theirMessageTime,
            ]}
          >
            {formatTimeAgo(item.createdAt)}
          </Text>
          {showReadReceipt && (
            <Ionicons
              name="checkmark-done"
              size={14}
              color="rgba(255,255,255,0.7)"
              style={{ marginLeft: 4 }}
            />
          )}
          {isMe && !showReadReceipt && (
            <Ionicons
              name="checkmark"
              size={14}
              color="rgba(255,255,255,0.7)"
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </Pressable>
    );
  }

  if (!conversation || !recipient) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Conversa não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <UserAvatar
            uri={recipient.avatar}
            size={36}
            verified={recipient.verified}
            onPress={() => router.push(`/profile/${recipient.id}` as any)}
          />
          <Pressable
            style={styles.headerInfo}
            onPress={() => router.push(`/profile/${recipient.id}` as any)}
          >
            <View style={styles.headerNameRow}>
              <Text style={styles.headerName}>{recipient.name}</Text>
              {recipient.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={colors.primary}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <Text style={styles.headerStatus}>
              {isTyping ? 'digitando...' : 'Ativo há 5m'}
            </Text>
          </Pressable>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          renderItem={renderMessage}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <UserAvatar
                uri={recipient.avatar}
                size={80}
                verified={recipient.verified}
              />
              <Text style={styles.emptyName}>{recipient.name}</Text>
              <Text style={styles.emptyUsername}>@{recipient.username}</Text>
              <Text style={styles.emptyText}>
                Envie uma mensagem para iniciar a conversa
              </Text>
            </View>
          }
        />

        <View style={styles.inputRow}>
          <Pressable style={styles.attachBtn} onPress={handleAttachmentPress}>
            <Ionicons name="add-circle" size={28} color={colors.primary} />
          </Pressable>
          <TextInput
            style={styles.chatInput}
            placeholder="Mensagem..."
            placeholderTextColor={colors.muted}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
            maxLength={500}
          />
          <Pressable
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={text.trim() ? '#fff' : colors.muted}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
