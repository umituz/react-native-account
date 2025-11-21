/**
 * Profile Screen
 * Displays user profile information, stats, and profile management options
 * Single Responsibility: Screen presentation only (no business logic)
 */

import React from "react";
import { View, ScrollView, StatusBar, StyleSheet } from "react-native";
import { useTheme } from "@umituz/react-native-design-system-theme";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import { ProfileScreenHeader } from "../components/ProfileScreenHeader";
import { ProfileHeaderSection } from "../components/ProfileHeaderSection";
import { ProfileLoadingState } from "../components/ProfileLoadingState";
import type { UseProfileScreenReturn } from "../hooks/useProfileScreen";

interface ProfileScreenProps {
  useProfileScreen: () => UseProfileScreenReturn;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  useProfileScreen,
}) => {
  const tokens = useAppDesignTokens();
  const { themeMode } = useTheme();
  const colors = tokens.colors;
  const isDark = themeMode === "dark";

  const {
    userId,
    displayName,
    email,
    avatarUrl,
    isGuest,
    handleBack,
    handleShareProfile,
    handleEditPress,
  } = useProfileScreen();

  if (!userId) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.backgroundPrimary },
        ]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <ProfileScreenHeader onBack={handleBack} onShare={handleShareProfile} />
        <ProfileLoadingState />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ProfileScreenHeader onBack={handleBack} onShare={handleShareProfile} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeaderSection
          displayName={displayName}
          email={email}
          avatarUrl={avatarUrl}
          isGuest={isGuest}
          userId={userId}
          onEditPress={handleEditPress}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});
