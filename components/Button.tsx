import { Text, Pressable, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Link, Href } from "expo-router";
import { useColors } from "../context/ThemeContext";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "small" | "medium" | "large";

type ButtonProps = {
  title: string;
  href?: Href;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
};

const sizeButtonStyles = {
  small: { paddingVertical: 8, paddingHorizontal: 16 },
  medium: { paddingVertical: 10, paddingHorizontal: 20 },
  large: { paddingVertical: 14, paddingHorizontal: 24 },
};

const sizeTextStyles = {
  small: { fontSize: 13 },
  medium: { fontSize: 14 },
  large: { fontSize: 16 },
};

export default function Button({
  title,
  href,
  onPress,
  variant = "primary",
  size = "large",
  fullWidth = true,
  disabled = false,
}: ButtonProps) {
  const colors = useColors();

  const variantButtonStyles = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.surface },
    outline: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border },
  };

  const variantTextStyles = {
    primary: { color: "#fff" },
    secondary: { color: colors.text },
    outline: { color: colors.text },
  };
  const disabledButtonStyle = {
    backgroundColor: colors.disabled,
    borderColor: "transparent",
  };

  const disabledTextStyle = {
    color: colors.muted,
  };

  const buttonStyle: ViewStyle[] = [
    styles.button,
    variantButtonStyles[variant],
    sizeButtonStyles[size],
    fullWidth && styles.fullWidth,
    disabled && disabledButtonStyle,
  ].filter(Boolean) as ViewStyle[];

  const textStyle: TextStyle[] = [
    styles.text,
    variantTextStyles[variant],
    sizeTextStyles[size],
    disabled && disabledTextStyle,
  ].filter(Boolean) as TextStyle[];

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable
          style={({ pressed }) => [
            ...buttonStyle,
            pressed && styles.pressed,
          ]}
          disabled={disabled}
        >
          <Text style={textStyle}>{title}</Text>
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        ...buttonStyle,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontWeight: "600",
  },
});
