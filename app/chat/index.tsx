import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';

type Contact = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

const CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Ana Souza',
    avatar: 'https://i.pravatar.cc/100?img=1',
    lastMessage: 'Voce viu a praia do Felix? Incrivel!',
    time: '2min',
    unread: 2,
    online: true,
  },
  {
    id: 'c2',
    name: 'Lucas Oliveira',
    avatar: 'https://i.pravatar.cc/100?img=3',
    lastMessage: 'Bora mergulhar amanha?',
    time: '15min',
    unread: 1,
    online: true,
  },
  {
    id: 'c3',
    name: 'Mariana Lima',
    avatar: 'https://i.pravatar.cc/100?img=5',
    lastMessage: 'Aquele restaurante e demais!',
    time: '1h',
    unread: 0,
    online: false,
  },
  {
    id: 'c4',
    name: 'Pedro Santos',
    avatar: 'https://i.pravatar.cc/100?img=7',
    lastMessage: 'Manda o roteiro que vc fez',
    time: '3h',
    unread: 0,
    online: false,
  },
  {
    id: 'c5',
    name: 'Julia Costa',
    avatar: 'https://i.pravatar.cc/100?img=9',
    lastMessage: 'Adorei as fotos da trilha!',
    time: '5h',
    unread: 0,
    online: true,
  },
];

export default function ChatList() {
  const router = useRouter();

  function handleContactPress(id: string) {
    router.push(`/chat/${id}`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={CONTACTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.contactRow}
            onPress={() => handleContactPress(item.id)}
          >
            <View>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              {item.online && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.contactBody}>
              <View style={styles.contactTop}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactTime}>{item.time}</Text>
              </View>
              <View style={styles.contactBottom}>
                <Text
                  style={[
                    styles.contactMsg,
                    item.unread > 0 && styles.contactMsgUnread,
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  list: {
    paddingVertical: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: colors.background,
  },
  contactBody: {
    flex: 1,
  },
  contactTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  contactTime: {
    fontSize: 12,
    color: colors.muted,
  },
  contactBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  contactMsg: {
    fontSize: 14,
    color: colors.muted,
    flex: 1,
    marginRight: 8,
  },
  contactMsgUnread: {
    color: colors.text,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
