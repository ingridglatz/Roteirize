import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Message, Conversation } from '../types/Social';
import { MOCK_MESSAGES, MOCK_CONVERSATIONS } from '../data/mockChatData';
import { useUser } from './UserContext';

type ChatContextType = {
  conversations: Conversation[];
  getConversation: (id: string) => Conversation | undefined;
  getMessages: (conversationId: string) => Message[];
  sendMessage: (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => void;
  markAsRead: (conversationId: string) => void;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  deleteMessage: (messageId: string) => void;
  deleteConversation: (conversationId: string) => void;
  createConversation: (participantId: string) => Conversation;
  sharePost: (
    conversationId: string,
    postId: string,
    thumbnail: any,
    caption: string,
    username: string
  ) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);

  const getConversation = useCallback(
    (id: string) => {
      return conversations.find((c) => c.id === id);
    },
    [conversations]
  );

  const getMessages = useCallback(
    (conversationId: string) => {
      return messages
        .filter((m) => m.conversationId === conversationId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    },
    [messages]
  );

  const sendMessage = useCallback(
    (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => {
      const newMessage: Message = {
        ...message,
        id: `msg-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessage: newMessage,
                typing: c.typing?.filter((id) => id !== currentUser.id),
              }
            : c
        )
      );

      setTimeout(() => {
        if (newMessage.senderId === currentUser.id) {
          const replies = [
            'Que legal!',
            'Concordo!',
            'Vamos sim!',
            'Adorei!',
            'Me conta mais!',
            'Incrível!',
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];

          const replyMessage: Message = {
            id: `msg-${Date.now()}`,
            conversationId,
            senderId: message.recipientId,
            recipientId: currentUser.id,
            text: randomReply,
            read: false,
            createdAt: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, replyMessage]);

          setConversations((prev) =>
            prev.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    lastMessage: replyMessage,
                    unreadCount: c.unreadCount + 1,
                  }
                : c
            )
          );
        }
      }, 1500);
    },
    [currentUser.id]
  );

  const markAsRead = useCallback(
    (conversationId: string) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.conversationId === conversationId && m.recipientId === currentUser.id
            ? { ...m, read: true, readAt: new Date().toISOString() }
            : m
        )
      );

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        )
      );
    },
    [currentUser.id]
  );

  const setTyping = useCallback(
    (conversationId: string, isTyping: boolean) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;

          const typing = c.typing || [];
          if (isTyping && !typing.includes(currentUser.id)) {
            return { ...c, typing: [...typing, currentUser.id] };
          } else if (!isTyping) {
            return { ...c, typing: typing.filter((id) => id !== currentUser.id) };
          }
          return c;
        })
      );
    },
    [currentUser.id]
  );

  const reactToMessage = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, reaction: emoji } : m))
    );
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    setMessages((prev) => prev.filter((m) => m.conversationId !== conversationId));
  }, []);

  const createConversation = useCallback(
    (participantId: string) => {
      const existingConv = conversations.find((c) =>
        c.participantIds.includes(participantId) && c.participantIds.includes(currentUser.id)
      );

      if (existingConv) return existingConv;

      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        participantIds: [currentUser.id, participantId],
        participants: [], // Will be populated by the component
        unreadCount: 0,
        typing: [],
      };

      setConversations((prev) => [newConversation, ...prev]);
      return newConversation;
    },
    [conversations, currentUser.id]
  );

  const sharePost = useCallback(
    (
      conversationId: string,
      postId: string,
      thumbnail: any,
      caption: string,
      username: string
    ) => {
      const conversation = conversations.find((c) => c.id === conversationId);
      if (!conversation) return;

      const recipient = conversation.participants.find((p) => p.id !== currentUser.id);
      if (!recipient) return;

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: currentUser.id,
        recipientId: recipient.id,
        sharedPost: {
          postId,
          thumbnail,
          caption,
          username,
        },
        read: false,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, lastMessage: newMessage }
            : c
        )
      );
    },
    [conversations, currentUser.id]
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        getConversation,
        getMessages,
        sendMessage,
        markAsRead,
        setTyping,
        reactToMessage,
        deleteMessage,
        deleteConversation,
        createConversation,
        sharePost,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
