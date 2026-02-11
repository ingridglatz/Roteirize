import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useChat } from '../../context/ChatContext';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { getColors } from '../../theme/colors';
import { Itinerary } from '../../types/Itinerary';
import UserAvatar from '../social/UserAvatar';

type Props = {
  itinerary: Itinerary | null;
  onClose: () => void;
  onShareToChat?: () => void;
};

type ShareOption = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  action: () => void;
};

export default function ShareItinerarySheet({
  itinerary,
  onClose,
  onShareToChat,
}: Props) {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { t, i18n } = useTranslation();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { conversations, sendMessage } = useChat();
  const { currentUser } = useUser();
  const router = useRouter();

  async function generatePdfContent(itinerary: Itinerary): Promise<string> {
    // Gerar HTML para o roteiro diário
    const dailyPlanHtml = itinerary.dailyPlan
      .map(
        (day) => `
        <div class="day-card">
          <div class="day-header">
            <div class="day-badge">${t('shareItinerary.day')} ${day.day}</div>
            <h3 class="day-title">${day.title || `${t('shareItinerary.dayLabel')} ${day.day}`}</h3>
          </div>
          <div class="activities-list">
            ${day.places
              .map(
                (place, idx) =>
                  `<div class="activity-item">
                    <span class="activity-number">${idx + 1}</span>
                    <span class="activity-text">${place}</span>
                  </div>`,
              )
              .join('')}
          </div>
        </div>
      `,
      )
      .join('');

    // Gerar HTML para restaurantes (se houver)
    const restaurantsHtml =
      itinerary.restaurants && itinerary.restaurants.length > 0
        ? `
      <div class="section">
        <h2 class="section-title">${t('shareItinerary.suggestedRestaurants')}</h2>
        <div class="restaurants-grid">
          ${itinerary.restaurants
            .map(
              (restaurant) => `
            <div class="restaurant-item">
              <div class="restaurant-name">${restaurant.name}</div>
              <div class="restaurant-details">
                <span>${restaurant.category}</span>
                <span class="price-level">${restaurant.priceLevel}</span>
              </div>
              ${restaurant.location ? `<div class="restaurant-location">📍 ${restaurant.location}</div>` : ''}
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    `
        : '';

    // Gerar HTML para checklist (se houver)
    const checklistHtml =
      itinerary.checklist && itinerary.checklist.length > 0
        ? `
      <div class="section">
        <h2 class="section-title">${t('shareItinerary.travelChecklist')}</h2>
        <div class="checklist">
          ${itinerary.checklist
            .map(
              (item) => `
            <div class="checklist-item">
              <span class="checkbox">☐</span>
              <span class="checklist-text">${item.text}</span>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    `
        : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
              color: #1E293B;
              background: #FFFFFF;
            }

            .header {
              background: linear-gradient(135deg, #2CBFAE 0%, #1F9A88 100%);
              padding: 32px;
              border-radius: 16px;
              margin-bottom: 40px;
              color: white;
            }

            .title {
              font-size: 32px;
              font-weight: 800;
              margin-bottom: 16px;
              line-height: 1.2;
            }

            .meta-info {
              display: flex;
              gap: 24px;
              font-size: 15px;
              opacity: 0.95;
            }

            .meta-item {
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }

            .section-title {
              font-size: 22px;
              font-weight: 700;
              color: #1E293B;
              margin-bottom: 20px;
              padding-bottom: 12px;
              border-bottom: 3px solid #2CBFAE;
            }

            .day-card {
              background: #F8FAFC;
              border: 2px solid #E2E8F0;
              border-radius: 12px;
              padding: 24px;
              margin-bottom: 20px;
              page-break-inside: avoid;
            }

            .day-header {
              margin-bottom: 16px;
            }

            .day-badge {
              display: inline-block;
              background: #2CBFAE;
              color: white;
              padding: 6px 14px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.5px;
              margin-bottom: 12px;
            }

            .day-title {
              font-size: 20px;
              font-weight: 700;
              color: #1E293B;
            }

            .activities-list {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            .activity-item {
              display: flex;
              align-items: flex-start;
              gap: 12px;
              padding: 12px;
              background: white;
              border-radius: 8px;
              border-left: 3px solid #2CBFAE;
            }

            .activity-number {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 24px;
              height: 24px;
              background: #2CBFAE;
              color: white;
              border-radius: 50%;
              font-size: 12px;
              font-weight: 700;
              flex-shrink: 0;
            }

            .activity-text {
              flex: 1;
              font-size: 15px;
              line-height: 1.6;
              color: #334155;
            }

            .restaurants-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
            }

            .restaurant-item {
              background: #F8FAFC;
              border: 1px solid #E2E8F0;
              border-radius: 10px;
              padding: 16px;
            }

            .restaurant-name {
              font-size: 16px;
              font-weight: 700;
              color: #1E293B;
              margin-bottom: 8px;
            }

            .restaurant-details {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 14px;
              color: #64748B;
              margin-bottom: 6px;
            }

            .price-level {
              color: #2CBFAE;
              font-weight: 600;
            }

            .restaurant-location {
              font-size: 13px;
              color: #64748B;
              margin-top: 6px;
            }

            .checklist {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }

            .checklist-item {
              display: flex;
              align-items: center;
              gap: 10px;
              padding: 10px;
              background: #F8FAFC;
              border-radius: 6px;
            }

            .checkbox {
              font-size: 18px;
              color: #2CBFAE;
            }

            .checklist-text {
              font-size: 14px;
              color: #334155;
            }

            .footer {
              margin-top: 60px;
              padding-top: 24px;
              border-top: 2px solid #E2E8F0;
              text-align: center;
              color: #94A3B8;
              font-size: 13px;
            }

            @media print {
              body {
                padding: 20px;
              }
              .day-card {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${itinerary.title}</div>
            <div class="meta-info">
              <div class="meta-item">
                <span>📍</span>
                <span>${itinerary.destinationName}</span>
              </div>
              <div class="meta-item">
                <span>📅</span>
                <span>${t('shareItinerary.daysCount', { count: itinerary.days })}</span>
              </div>
              <div class="meta-item">
                <span>💰</span>
                <span>${itinerary.budget}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">📅 ${t('shareItinerary.dailyPlan')}</h2>
            ${dailyPlanHtml}
          </div>

          ${restaurantsHtml}

          ${checklistHtml}

          <div class="footer">
            ${t('shareItinerary.generatedByDate')} • ${new Date().toLocaleDateString(i18n.language)}
          </div>
        </body>
      </html>
    `;
  }

  async function handleExportPdf() {
    if (!itinerary) return;

    try {
      setIsGeneratingPdf(true);
      const html = await generatePdfContent(itinerary);

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: t('shareItinerary.title'),
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert(t('common.error'), t('shareItinerary.shareError'));
      }

      onClose();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      Alert.alert(t('shareItinerary.pdfErrorTitle'), t('shareItinerary.pdfError'));
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  async function handleShareWhatsApp() {
    if (!itinerary) return;

    const message = `*${itinerary.title}*\n\n📍 ${itinerary.destinationName}\n📅 ${t('shareItinerary.daysCount', { count: itinerary.days })}\n\n${itinerary.dailyPlan
      .map(
        (day) =>
          `*${t('shareItinerary.dayLabel')} ${day.day}* - ${day.title}\n${day.places.map((p) => `• ${p}`).join('\n')}`,
      )
      .join('\n\n')}\n\n_${t('shareItinerary.generatedBy')}_`;

    // Tentar múltiplos esquemas de URL do WhatsApp
    const urls = [
      `whatsapp://send?text=${encodeURIComponent(message)}`,
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
    ];

    let opened = false;

    for (const url of urls) {
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          opened = true;
          onClose();
          break;
        }
      } catch (error) {
        console.log(`Falha ao tentar abrir: ${url}`);
      }
    }

    if (!opened) {
      Alert.alert(
        t('shareItinerary.whatsappNotFound'),
        t('shareItinerary.whatsappNotFoundMessage'),
      );
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getOtherParticipant(conv: any) {
    return conv.participants.find((p: any) => p.id !== currentUser.id);
  }

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) => {
      const otherUser = getOtherParticipant(conv);
      return otherUser?.name.toLowerCase().includes(query);
    });
  }, [searchQuery, conversations, getOtherParticipant]);

  function handleShareToConversation(conversationId: string) {
    if (!itinerary) return;

    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return;

    const recipient = conversation.participants.find(
      (p) => p.id !== currentUser.id,
    );
    if (!recipient) return;

    // Criar mensagem completa com todos os detalhes do roteiro
    const dailyPlanText = itinerary.dailyPlan
      .map(
        (day) =>
          `*${t('shareItinerary.dayLabel')} ${day.day}* - ${day.title}\n${day.places.map((p) => `• ${p}`).join('\n')}`,
      )
      .join('\n\n');

    const message = `🗺️ ${t('shareItinerary.sharedItinerary')}\n\n*${itinerary.title}*\n📍 ${itinerary.destinationName}\n📅 ${t('shareItinerary.daysCount', { count: itinerary.days })}\n\n${dailyPlanText}`;

    sendMessage(conversationId, {
      conversationId,
      senderId: currentUser.id,
      recipientId: recipient.id,
      text: message,
      read: false,
    });

    onClose();
    router.push(`/chat/${conversationId}`);
  }

  function handleShareToInternalChat() {
    setShowChatList(true);
  }

  if (!itinerary) return null;

  const shareOptions: ShareOption[] = [
    {
      id: 'chat',
      title: t('shareItinerary.shareToChat'),
      icon: 'chatbubble-outline',
      color: colors.primary,
      action: handleShareToInternalChat,
    },
    {
      id: 'whatsapp',
      title: t('shareItinerary.shareToWhatsApp'),
      icon: 'logo-whatsapp',
      color: '#25D366',
      action: handleShareWhatsApp,
    },
    {
      id: 'pdf',
      title: t('shareItinerary.exportPdf'),
      icon: 'document-text-outline',
      color: '#EF4444',
      action: handleExportPdf,
    },
  ];

  return (
    <Modal animationType="slide" transparent visible={!!itinerary}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.drag} />
            {showChatList && (
              <Pressable
                style={styles.backButton}
                onPress={() => setShowChatList(false)}
              >
                <Ionicons name="arrow-back" size={22} color={colors.text} />
              </Pressable>
            )}
            <Text style={styles.title}>
              {showChatList ? t('shareItinerary.sendTo') : t('shareItinerary.title')}
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          {!showChatList ? (
            <>
              <View style={styles.itineraryPreview}>
                <Text style={styles.itineraryTitle}>{itinerary.title}</Text>
                <Text style={styles.itineraryMeta}>
                  {itinerary.destinationName} · {t('shareItinerary.daysCount', { count: itinerary.days })}
                </Text>
              </View>

              {isGeneratingPdf && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.loadingText}>{t('shareItinerary.generatingPdf')}</Text>
                </View>
              )}

              <FlatList
                data={shareOptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.option}
                    onPress={item.action}
                    disabled={isGeneratingPdf}
                  >
                    <View
                      style={[
                        styles.optionIcon,
                        { backgroundColor: item.color },
                      ]}
                    >
                      <Ionicons name={item.icon} size={24} color="#fff" />
                    </View>
                    <Text style={styles.optionTitle}>{item.title}</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.muted}
                    />
                  </Pressable>
                )}
                scrollEnabled={false}
              />
            </>
          ) : (
            <>
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={18}
                  color={colors.muted}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder={t('shareItinerary.searchConversation')}
                  placeholderTextColor={colors.muted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <FlatList
                data={filteredConversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const otherUser = getOtherParticipant(item);
                  if (!otherUser) return null;

                  return (
                    <Pressable
                      style={styles.conversationItem}
                      onPress={() => handleShareToConversation(item.id)}
                    >
                      <UserAvatar
                        uri={otherUser.avatar}
                        size={48}
                        hasStory={false}
                      />
                      <View style={styles.conversationInfo}>
                        <Text style={styles.conversationName}>
                          {otherUser.name}
                        </Text>
                        <Text style={styles.conversationUsername}>
                          @{otherUser.username}
                        </Text>
                      </View>
                    </Pressable>
                  );
                }}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      {searchQuery
                        ? t('shareItinerary.noConversationFound')
                        : t('shareItinerary.noConversation')}
                    </Text>
                  </View>
                }
                style={styles.conversationsList}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    header: {
      paddingTop: 10,
      paddingBottom: 12,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      position: 'relative',
    },
    drag: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.muted,
      marginBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    closeButton: {
      position: 'absolute',
      right: 16,
      top: 16,
    },
    backButton: {
      position: 'absolute',
      left: 16,
      top: 16,
    },
    itineraryPreview: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itineraryTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    itineraryMeta: {
      fontSize: 13,
      color: colors.muted,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 12,
    },
    loadingText: {
      fontSize: 14,
      color: colors.muted,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 16,
    },
    optionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 10,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 12,
      paddingHorizontal: 12,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 10,
      fontSize: 14,
      color: colors.text,
    },
    conversationsList: {
      maxHeight: 400,
    },
    conversationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    conversationInfo: {
      marginLeft: 12,
      flex: 1,
    },
    conversationName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    conversationUsername: {
      fontSize: 13,
      color: colors.muted,
    },
    emptyState: {
      paddingVertical: 32,
      alignItems: 'center',
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.muted,
    },
  });
}
