import { View, StyleSheet } from 'react-native';
import { Comment } from '../../types/Social';
import { useSocial } from '../../context/SocialContext';
import CommentItem from './CommentItem';

type Props = {
  parentCommentId: string;
  onReply: (comment: Comment) => void;
  onUserPress: (userId: string) => void;
};

export default function CommentReplies({
  parentCommentId,
  onReply,
  onUserPress,
}: Props) {
  const { getReplies } = useSocial();
  const replies = getReplies(parentCommentId);

  if (replies.length === 0) return null;

  return (
    <View style={styles.container}>
      {replies.map((reply) => (
        <View key={reply.id} style={styles.replyItem}>
          <CommentItem
            comment={reply}
            onReply={onReply}
            onUserPress={onUserPress}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 44,
  },
  replyItem: {
    borderLeftWidth: 2,
    borderLeftColor: '#E0E0E0',
    marginLeft: 8,
  },
});
