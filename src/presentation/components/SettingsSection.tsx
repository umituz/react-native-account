/**
 * SettingsSection Component
 * Reusable section wrapper for settings groups
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  const tokens = useAppDesignTokens();
  const colors = tokens.colors;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          styles.content,
          {
            backgroundColor: `${colors.textSecondary}10`,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  content: {
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: "hidden",
  },
});
