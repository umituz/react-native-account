/**
 * Profile Loading State Component
 * Single Responsibility: Display loading state when profile is not available
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system";

export const ProfileLoadingState: React.FC = () => {
  const tokens = useAppDesignTokens();
  const colors = tokens.colors;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        Loading profile...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
