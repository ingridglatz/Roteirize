import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import {
  MOCK_BLOCK_RELATIONSHIPS,
  MOCK_COMMENTS,
  MOCK_FOLLOW_RELATIONSHIPS,
  MOCK_LIKES,
  MOCK_POSTS,
  MOCK_STORIES,
  MOCK_USERS,
} from '../data/mockSocialData';
import {
  Comment,
  Like,
  Post,
  SocialUser,
  Story,
  StoryReaction,
  StoryReply,
} from '../types/Social';
import { useUser } from './UserContext';

type SocialContextType = {
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  getPost: (postId: string) => Post | undefined;
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;

  comments: Comment[];
  getComments: (postId: string) => Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  updateComment: (id: string, text: string) => void;
  deleteComment: (id: string) => void;
  toggleLikeComment: (commentId: string) => void;
  getReplies: (commentId: string) => Comment[];

  stories: Story[];
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'expiresAt'>) => void;
  markStorySeen: (storyId: string) => void;
  addStoryReaction: (storyId: string, emoji: string) => void;
  addStoryReply: (storyId: string, text: string) => void;
  getStoryReactions: (storyId: string) => StoryReaction[];

  users: Map<string, SocialUser>;
  getUser: (userId: string) => SocialUser | undefined;
  searchUsers: (query: string) => SocialUser[];
  isFollowing: (userId: string) => boolean;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isBlocked: (userId: string) => boolean;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;

  getPostLikes: (postId: string) => SocialUser[];
  getCommentLikes: (commentId: string) => SocialUser[];
};

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export function SocialProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();

  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [likes, setLikes] = useState<Like[]>(MOCK_LIKES);
  const [followRelationships, setFollowRelationships] = useState(
    MOCK_FOLLOW_RELATIONSHIPS,
  );
  const [blockRelationships, setBlockRelationships] = useState(
    MOCK_BLOCK_RELATIONSHIPS,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const usersMap = new Map<string, SocialUser>(
    MOCK_USERS.map((user) => [user.id, user]),
  );

  const addPost = useCallback((post: Post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  const updatePost = useCallback((id: string, updates: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, editedAt: new Date().toISOString() }
          : p,
      ),
    );
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setComments((prev) => prev.filter((c) => c.postId !== id));
    setLikes((prev) => prev.filter((l) => l.postId !== id));
  }, []);

  const getPost = useCallback(
    (postId: string) => {
      return posts.find((p) => p.id === postId);
    },
    [posts],
  );

  const toggleLikePost = useCallback(
    (postId: string) => {
      const existingLike = likes.find(
        (l) => l.postId === postId && l.userId === currentUser.id,
      );

      if (existingLike) {
        setLikes((prev) => prev.filter((l) => l.id !== existingLike.id));
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, liked: false, likes: Math.max(0, p.likes - 1) }
              : p,
          ),
        );
      } else {
        const newLike: Like = {
          id: `like-${Date.now()}`,
          userId: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          postId,
          createdAt: new Date().toISOString(),
        };
        setLikes((prev) => [...prev, newLike]);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, liked: true, likes: p.likes + 1 } : p,
          ),
        );
      }
    },
    [likes, currentUser],
  );

  const toggleSavePost = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, saved: !p.saved } : p)),
    );
  }, []);

  const getComments = useCallback(
    (postId: string) => {
      return comments
        .filter((c) => c.postId === postId && !c.parentId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    },
    [comments],
  );

  const addComment = useCallback(
    (comment: Omit<Comment, 'id' | 'createdAt'>) => {
      const newComment: Comment = {
        ...comment,
        id: `comment-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [...prev, newComment]);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === comment.postId ? { ...p, comments: p.comments + 1 } : p,
        ),
      );

      if (comment.parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === comment.parentId
              ? { ...c, repliesCount: c.repliesCount + 1 }
              : c,
          ),
        );
      }
    },
    [],
  );

  const updateComment = useCallback((id: string, text: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, text, editedAt: new Date().toISOString() } : c,
      ),
    );
  }, []);

  const deleteComment = useCallback(
    (id: string) => {
      const comment = comments.find((c) => c.id === id);
      if (!comment) return;

      setComments((prev) =>
        prev.filter((c) => c.id !== id && c.parentId !== id),
      );

      setPosts((prev) =>
        prev.map((p) =>
          p.id === comment.postId
            ? { ...p, comments: Math.max(0, p.comments - 1) }
            : p,
        ),
      );

      if (comment.parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === comment.parentId
              ? { ...c, repliesCount: Math.max(0, c.repliesCount - 1) }
              : c,
          ),
        );
      }

      setLikes((prev) => prev.filter((l) => l.commentId !== id));
    },
    [comments],
  );

  const toggleLikeComment = useCallback(
    (commentId: string) => {
      const existingLike = likes.find(
        (l) => l.commentId === commentId && l.userId === currentUser.id,
      );

      if (existingLike) {
        setLikes((prev) => prev.filter((l) => l.id !== existingLike.id));
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, liked: false, likes: Math.max(0, c.likes - 1) }
              : c,
          ),
        );
      } else {
        const newLike: Like = {
          id: `like-${Date.now()}`,
          userId: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          commentId,
          createdAt: new Date().toISOString(),
        };
        setLikes((prev) => [...prev, newLike]);
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, liked: true, likes: c.likes + 1 } : c,
          ),
        );
      }
    },
    [likes, currentUser],
  );

  const getReplies = useCallback(
    (commentId: string) => {
      return comments
        .filter((c) => c.parentId === commentId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
    },
    [comments],
  );

  const addStory = useCallback(
    (story: Omit<Story, 'id' | 'createdAt' | 'expiresAt'>) => {
      const newStory: Story = {
        ...story,
        id: `story-${Date.now()}`,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      setStories((prev) => [newStory, ...prev]);
    },
    [],
  );

  const markStorySeen = useCallback((storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, seen: true } : s)),
    );
  }, []);

  const addStoryReaction = useCallback(
    (storyId: string, emoji: string) => {
      const reaction: StoryReaction = {
        id: `reaction-${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        emoji,
        createdAt: new Date().toISOString(),
      };

      setStories((prev) =>
        prev.map((s) =>
          s.id === storyId
            ? {
                ...s,
                reactions: [
                  ...s.reactions.filter((r) => r.userId !== currentUser.id),
                  reaction,
                ],
              }
            : s,
        ),
      );
    },
    [currentUser],
  );

  const addStoryReply = useCallback(
    (storyId: string, text: string) => {
      const reply: StoryReply = {
        id: `reply-${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        text,
        createdAt: new Date().toISOString(),
      };

      setStories((prev) =>
        prev.map((s) =>
          s.id === storyId ? { ...s, replies: [...s.replies, reply] } : s,
        ),
      );
    },
    [currentUser],
  );

  const getStoryReactions = useCallback(
    (storyId: string) => {
      const story = stories.find((s) => s.id === storyId);
      return story?.reactions || [];
    },
    [stories],
  );

  const getUser = useCallback(
    (userId: string) => {
      return usersMap.get(userId);
    },
    [usersMap],
  );

  const searchUsers = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return MOCK_USERS.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.username.toLowerCase().includes(lowerQuery),
    );
  }, []);

  const isFollowing = useCallback(
    (userId: string) => {
      return followRelationships.some(
        (rel) =>
          rel.followerId === currentUser.id && rel.followingId === userId,
      );
    },
    [followRelationships, currentUser.id],
  );

  const followUser = useCallback(
    (userId: string) => {
      if (userId === currentUser.id) return;

      setFollowRelationships((prev) => [
        ...prev,
        {
          followerId: currentUser.id,
          followingId: userId,
          createdAt: new Date().toISOString(),
        },
      ]);
    },
    [currentUser.id],
  );

  const unfollowUser = useCallback(
    (userId: string) => {
      setFollowRelationships((prev) =>
        prev.filter(
          (rel) =>
            !(rel.followerId === currentUser.id && rel.followingId === userId),
        ),
      );
    },
    [currentUser.id],
  );

  const isBlocked = useCallback(
    (userId: string) => {
      return blockRelationships.some(
        (rel) => rel.blockerId === currentUser.id && rel.blockedId === userId,
      );
    },
    [blockRelationships, currentUser.id],
  );

  const blockUser = useCallback(
    (userId: string) => {
      if (userId === currentUser.id) return;

      setBlockRelationships((prev) => [
        ...prev,
        {
          blockerId: currentUser.id,
          blockedId: userId,
          createdAt: new Date().toISOString(),
        },
      ]);

      unfollowUser(userId);
      setFollowRelationships((prev) =>
        prev.filter(
          (rel) =>
            !(rel.followerId === userId && rel.followingId === currentUser.id),
        ),
      );
    },
    [currentUser.id, unfollowUser],
  );

  const unblockUser = useCallback(
    (userId: string) => {
      setBlockRelationships((prev) =>
        prev.filter(
          (rel) =>
            !(rel.blockerId === currentUser.id && rel.blockedId === userId),
        ),
      );
    },
    [currentUser.id],
  );

  const getPostLikes = useCallback(
    (postId: string) => {
      const postLikes = likes.filter((l) => l.postId === postId);
      return postLikes
        .map((like) => usersMap.get(like.userId))
        .filter((user): user is SocialUser => user !== undefined);
    },
    [usersMap, likes],
  );

  const getCommentLikes = useCallback(
    (commentId: string) => {
      const commentLikes = likes.filter((l) => l.commentId === commentId);
      return commentLikes
        .map((like) => usersMap.get(like.userId))
        .filter((user): user is SocialUser => user !== undefined);
    },
    [usersMap, likes],
  );

  const value: SocialContextType = {
    posts,
    addPost,
    updatePost,
    deletePost,
    getPost,
    toggleLikePost,
    toggleSavePost,

    comments,
    getComments,
    addComment,
    updateComment,
    deleteComment,
    toggleLikeComment,
    getReplies,

    stories,
    addStory,
    markStorySeen,
    addStoryReaction,
    addStoryReply,
    getStoryReactions,

    users: usersMap,
    getUser,
    searchUsers,
    isFollowing,
    followUser,
    unfollowUser,
    isBlocked,
    blockUser,
    unblockUser,

    getPostLikes,
    getCommentLikes,
  };

  return (
    <SocialContext.Provider value={value}>{children}</SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within SocialProvider');
  }
  return context;
}
