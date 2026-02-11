import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Comment } from '../../types/Social';
import { useSocial } from '../../context/SocialContext';
import { useTheme } from '../../context/ThemeContext';
import { getColors } from '../../theme/colors';
import CommentItem from './CommentItem';

type Props = {
  parentCommentId: string;
  onReply: (comment: Comment) => void;
  onUserPress: (userId: string) => void;
};

function createStyles(colors: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    container: {
      paddingLeft: 44,
    },
    replyItem: {
      borderLeftWidth: 2,
      borderLeftColor: colors.border,
      marginLeft: 8,
    },
  });
}

export default function CommentReplies({
  parentCommentId,
  onReply,
  onUserPress,
}: Props) {
  const { getReplies } = useSocial();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = useMemo(() => createStyles(colors), [colors]);
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
