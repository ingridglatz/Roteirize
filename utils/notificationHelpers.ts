import { Notification } from '../types/Social';

export function getNotificationText(notification: Notification): string {
  switch (notification.type) {
    case 'like':
      return 'curtiu sua publicação';
    case 'comment':
      return notification.text
        ? `comentou: ${notification.text}`
        : 'comentou em sua publicação';
    case 'follow':
      return 'começou a seguir você';
    case 'mention':
      return 'mencionou você em um comentário';
    case 'story_reaction':
      return 'reagiu ao seu story';
    case 'story_reply':
      return notification.text
        ? `respondeu ao seu story: ${notification.text}`
        : 'respondeu ao seu story';
    default:
      return 'interagiu com você';
  }
}

export function getNotificationIcon(type: Notification['type']): string {
  switch (type) {
    case 'like':
      return 'heart';
    case 'comment':
      return 'chatbubble';
    case 'follow':
      return 'person-add';
    case 'mention':
      return 'at';
    case 'story_reaction':
      return 'happy';
    case 'story_reply':
      return 'chatbubble-ellipses';
    default:
      return 'notifications';
  }
}

export function shouldBadge(notification: Notification): boolean {
  return !notification.read;
}

type GroupedNotification = {
  id: string;
  type: Notification['type'];
  users: {
    id: string;
    username: string;
    avatar: string;
  }[];
  postId?: string;
  postThumbnail?: any;
  text?: string;
  createdAt: string;
  read: boolean;
};

export function groupNotifications(
  notifications: Notification[],
): GroupedNotification[] {
  const grouped: Record<string, GroupedNotification> = {};

  for (const notif of notifications) {
    const key =
      notif.type === 'like' && notif.postId ? `like-${notif.postId}` : notif.id;

    if (notif.type === 'like' && notif.postId && grouped[key]) {
      grouped[key].users.push({
        id: notif.fromUserId,
        username: notif.fromUsername,
        avatar: notif.fromAvatar,
      });
      if (new Date(notif.createdAt) > new Date(grouped[key].createdAt)) {
        grouped[key].createdAt = notif.createdAt;
      }
      grouped[key].read = grouped[key].read && notif.read;
    } else {
      grouped[key] = {
        id: key,
        type: notif.type,
        users: [
          {
            id: notif.fromUserId,
            username: notif.fromUsername,
            avatar: notif.fromAvatar,
          },
        ],
        postId: notif.postId,
        postThumbnail: notif.postThumbnail,
        text: notif.text,
        createdAt: notif.createdAt,
        read: notif.read,
      };
    }
  }

  return Object.values(grouped).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function formatNotificationText(grouped: GroupedNotification): string {
  const userCount = grouped.users.length;

  if (userCount === 1) {
    const user = grouped.users[0].username;
    switch (grouped.type) {
      case 'like':
        return `${user} curtiu sua publicação`;
      case 'comment':
        return `${user} comentou: ${grouped.text || ''}`;
      case 'follow':
        return `${user} começou a seguir você`;
      case 'mention':
        return `${user} mencionou você`;
      case 'story_reaction':
        return `${user} reagiu ao seu story`;
      case 'story_reply':
        return `${user} respondeu ao seu story`;
    }
  } else if (userCount === 2) {
    const [user1, user2] = grouped.users;
    return `${user1.username} e ${user2.username} curtiram sua publicação`;
  } else {
    const first = grouped.users[0].username;
    const others = userCount - 1;
    return `${first} e ${others} ${others === 1 ? 'outra pessoa' : 'outras pessoas'} curtiram sua publicação`;
  }

  return '';
}
