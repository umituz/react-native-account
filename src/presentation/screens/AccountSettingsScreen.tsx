/**
 * Account Settings Screen
 * Displays all account-related settings in one place
 * Single Responsibility: Screen presentation only (no business logic)
 */

import React from "react";
import { View, ScrollView, StatusBar, StyleSheet } from "react-native";
import {
  useAppDesignTokens,
  useTheme,
} from "@umituz/react-native-design-system-theme";
import { AccountSettingsHeader } from "../components/AccountSettingsHeader";
import { ProfileSection } from "../components/ProfileSection";
import { AccountActionsSection } from "../components/AccountActionsSection";

interface AccountSettingsScreenProps {
  isGuest: boolean;
  onLogout: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  onChangePassword?: () => void;
}

export const AccountSettingsScreen: React.FC<AccountSettingsScreenProps> = ({
  isGuest,
  onLogout,
  onDeleteAccount,
  onChangePassword,
}) => {
  const tokens = useAppDesignTokens();
  const { themeMode } = useTheme();
  const isDark = themeMode === "dark";
  const colors = tokens.colors;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <AccountSettingsHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSection isGuest={isGuest} />
        <AccountActionsSection
          isGuest={isGuest}
          onLogout={onLogout}
          onDeleteAccount={onDeleteAccount}
          onChangePassword={onChangePassword}
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

