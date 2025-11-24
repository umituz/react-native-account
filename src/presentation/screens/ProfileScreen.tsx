/**
 * Profile Screen
 * Modern profile screen with sections for physical info, goals, settings, and account management
 * Single Responsibility: Screen presentation only (no business logic)
 */

import React from "react";
import { View, Text, ScrollView, StatusBar, StyleSheet } from "react-native";
import { useTheme } from "@umituz/react-native-design-system-theme";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import { useLocalization } from "@umituz/react-native-localization";
import { useNavigation } from "@react-navigation/native";
import { ProfileHeaderSection } from "../components/ProfileHeaderSection";
import { PhysicalInfoSection } from "../components/PhysicalInfoSection";
import { GoalsSection } from "../components/GoalsSection";
import { AppSettingsSection } from "../components/AppSettingsSection";
import { AccountManagementSection } from "../components/AccountManagementSection";
import { ProfileLoadingState } from "../components/ProfileLoadingState";
import type { UseProfileScreenReturn } from "../hooks/useProfileScreen";

interface ProfileScreenProps {
  useProfileScreen: () => UseProfileScreenReturn;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  useProfileScreen,
}) => {
  const { t } = useLocalization();
  const navigation = useNavigation();
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
    handleEditPress,
  } = useProfileScreen();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLanguagePress = () => {
    navigation.navigate("LanguageSelection" as never);
  };

  const handleAppearancePress = () => {
    navigation.navigate("Appearance" as never);
  };

  const handleNotificationsPress = () => {
    navigation.navigate("Notifications" as never);
  };

  const handlePasswordChangePress = () => {
    navigation.navigate("PasswordChange" as never);
  };

  const handleConnectedAccountsPress = () => {
    navigation.navigate("ConnectedAccounts" as never);
  };

  const handleLogout = () => {
    // Handle logout
  };

  const handleDeleteAccount = () => {
    // Handle delete account
  };

  if (!userId) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.backgroundPrimary },
        ]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <ProfileLoadingState />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerContent}>
          <View style={styles.backButton}>
            {/* Back button placeholder */}
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{t("account.profile.title")}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ProfileHeaderSection
          displayName={displayName}
          email={email}
          avatarUrl={avatarUrl}
          isGuest={isGuest}
          userId={userId}
          onEditPress={handleEditPress}
        />

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Physical Info and Goals */}
        <PhysicalInfoSection />

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* App Settings */}
        <AppSettingsSection
          onLanguagePress={handleLanguagePress}
          onAppearancePress={handleAppearancePress}
          onNotificationsPress={handleNotificationsPress}
        />

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Account Management */}
        <AccountManagementSection
          isGuest={isGuest}
          onPasswordChangePress={handlePasswordChangePress}
          onConnectedAccountsPress={handleConnectedAccountsPress}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 44, // Safe area for iOS
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    minHeight: 56,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  spacer: {
    height: 16,
  },
  bottomPadding: {
    height: 16,
  },
});
