/**
 * Loading State Component
 * Single Responsibility: Display loading state
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicText, AtomicIcon } from "@umituz/react-native-design-system-atoms";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";

export const LoadingState: React.FC = () => {
  const tokens = useAppDesignTokens();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: tokens.colors.backgroundPrimary },
      ]}
    >
      <View style={styles.emptyState}>
        <AtomicIcon name="Loader" size="xxl" color="secondary" />
        <AtomicText
          type="titleLarge"
          style={{
            color: tokens.colors.textPrimary,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          Loading Profile...
        </AtomicText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});
