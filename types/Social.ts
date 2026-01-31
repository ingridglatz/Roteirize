export type SocialUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  verified?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isFollowedBy?: boolean;
  isBlocked?: boolean;
  blockedBy?: boolean;
};

export type Post = {
  id: string;
  userId: string;
  user: string;
  username: string;
  location: string;
  avatar: string;
  image: any;
  caption: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  time: string;
  createdAt: string;
  editedAt?: string;
  allowComments: boolean;
  hideLikes: boolean;
};

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  user: string;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  liked: boolean;
  createdAt: string;
  editedAt?: string;
  parentId?: string;
  repliesCount: number;
};

export type Story = {
  id: string;
  userId: string;
  user: string;
  username: string;
  avatar: string;
  images: any[];
  seen: boolean;
  createdAt: string;
  expiresAt: string;
  reactions: StoryReaction[];
  replies: StoryReply[];
};

export type StoryReaction = {
  id: string;
  userId: string;
  username: string;
  emoji: string;
  createdAt: string;
};

export type StoryReply = {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  createdAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  text?: string;
  sharedPost?: {
    postId: string;
    thumbnail: any;
    caption: string;
    username: string;
  };
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document';
  mediaName?: string;
  read: boolean;
  readAt?: string;
  reaction?: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  participantIds: string[];
  participants: SocialUser[];
  lastMessage?: Message;
  unreadCount: number;
  typing?: string[];
};

export type Notification = {
  id: string;
  type:
    | 'like'
    | 'comment'
    | 'follow'
    | 'mention'
    | 'story_reaction'
    | 'story_reply';
  fromUserId: string;
  fromUser: string;
  fromUsername: string;
  fromAvatar: string;
  postId?: string;
  postThumbnail?: any;
  commentId?: string;
  storyId?: string;
  text?: string;
  read: boolean;
  createdAt: string;
};

export type FollowRelationship = {
  followerId: string;
  followingId: string;
  createdAt: string;
};

export type BlockRelationship = {
  blockerId: string;
  blockedId: string;
  createdAt: string;
};

export type Like = {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  postId?: string;
  commentId?: string;
  createdAt: string;
};
