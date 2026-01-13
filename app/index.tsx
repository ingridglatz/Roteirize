import { View, Text, StyleSheet } from "react-native";
import Button from "../components/Button";
import { colors } from "../theme/colors";
import { Link, Href } from "expo-router";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Roteirize</Text>

      <Text style={styles.title}>Descubra. Planeje. Viva.</Text>

      <Text style={styles.subtitle}>
        Crie roteiros de viagens personalizados em minutos e aproveite cada momento.
      </Text>

      <Button title="Começar agora" href={"/login" as Href} />

      <Link href={"/login" as Href} style={styles.link}>
        Já tenho uma conta
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 32,
  },
  link: {
    marginTop: 16,
    color: colors.primary,
    fontWeight: "500",
  },
});
