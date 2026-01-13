import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
});
