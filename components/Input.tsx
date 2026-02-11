import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColors } from "../context/ThemeContext";

type InputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  error?: boolean;
  iconColor?: string;
} & Omit<TextInputProps, 'placeholder' | 'value' | 'onChangeText' | 'secureTextEntry' | 'style'>;

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  icon,
  error = false,
  iconColor,
  ...rest
}: InputProps) {
  const colors = useColors();

  const dynamicStyles = {
    input: {
      borderColor: colors.border,
      color: colors.text,
    },
    inputError: {
      borderColor: colors.error,
      borderWidth: 1.5,
    },
  };

  return (
    <View style={styles.container}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={iconColor || (error ? colors.error : colors.muted)}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          dynamicStyles.input,
          icon && styles.inputWithIcon,
          error && dynamicStyles.inputError,
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  icon: {
    position: "absolute",
    left: 14,
    top: 14,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  inputWithIcon: {
    paddingLeft: 44,
  },
});
