import { Text, Pressable, StyleSheet } from "react-native";
import { Link, Href } from "expo-router";
import { colors } from "../theme/colors";

type ButtonProps = {
  title: string;
  href?: Href;
  onPress?: () => void;
};

export default function Button({ title, href, onPress }: ButtonProps) {
  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable style={styles.button}>
          <Text style={styles.text}>{title}</Text>
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
