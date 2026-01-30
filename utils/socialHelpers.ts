export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'agora';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}sem`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mês`;
  return `${Math.floor(seconds / 31536000)}a`;
}

export function formatCount(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1).replace('.0', '')}K`;
  return `${(num / 1000000).toFixed(1).replace('.0', '')}M`;
}

export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
}

export function isBlocked(
  userId: string,
  blockedList: string[],
): boolean {
  return blockedList.includes(userId);
}

export function canComment(allowComments: boolean, isBlocked: boolean): boolean {
  return allowComments && !isBlocked;
}

export function canMessage(
  targetUserId: string,
  currentUserId: string,
  blockedByTarget: boolean,
  blockedByMe: boolean,
): boolean {
  if (targetUserId === currentUserId) return false;
  if (blockedByTarget || blockedByMe) return false;
  return true;
}

export function formatFollowersCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) {
    const k = Math.floor(count / 1000);
    const remainder = count % 1000;
    if (remainder > 0) {
      return `${k}.${Math.floor(remainder / 100)}k`;
    }
    return `${k}k`;
  }
  const m = Math.floor(count / 1000000);
  const remainder = count % 1000000;
  if (remainder > 0) {
    return `${m}.${Math.floor(remainder / 100000)}M`;
  }
  return `${m}M`;
}
