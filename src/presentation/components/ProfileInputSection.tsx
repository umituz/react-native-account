/**
 * ProfileInputSection Component
 * Reusable input section for profile fields (name, email)
 */

import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";

interface ProfileInputSectionProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: LucideIcon;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export const ProfileInputSection: React.FC<ProfileInputSectionProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  keyboardType = "default",
  autoCapitalize = "sentences",
}) => {
  const { t } = useLocalization();
  const tokens = useAppDesignTokens();
  const colors = tokens.colors;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.borderLight,
          },
        ]}
      >
        <Icon size={20} color={colors.textSecondary} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    fontWeight: "500",
  },
});
