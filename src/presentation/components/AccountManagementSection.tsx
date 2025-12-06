/**
 * Account Management Section Component
 * Single Responsibility: Render account management options with logout/delete
 */

import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { Lock, Link, LogOut } from "lucide-react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import { AtomicButton } from "@umituz/react-native-design-system";
import { SettingItem } from "./SettingItem";

interface AccountManagementSectionProps {
  isGuest: boolean;
  onPasswordChangePress: () => void;
  onConnectedAccountsPress: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const AccountManagementSection: React.FC<AccountManagementSectionProps> = ({
  isGuest,
  onPasswordChangePress,
  onConnectedAccountsPress,
  onLogout,
  onDeleteAccount,
}) => {
  const { t } = useLocalization();
  const tokens = useAppDesignTokens();

  const handleDeleteAccount = () => {
    Alert.alert(
      t("account.deleteAccount.confirmTitle"),
      t("account.deleteAccount.confirmMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("account.deleteAccount.confirmButton"),
          style: "destructive",
          onPress: onDeleteAccount,
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.surface }]}>
      <View style={styles.section}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t("account.management.title")}</Text>
      </View>
        <View style={styles.content}>
          {!isGuest && (
            <>
              <SettingItem
                icon={Lock}
                title={t("account.passwordChange.title")}
                onPress={onPasswordChangePress}
              />
              <SettingItem
                icon={Link}
                title={t("account.connectedAccounts.title")}
                onPress={onConnectedAccountsPress}
              />
            </>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <AtomicButton
          variant="outline"
          size="lg"
          onPress={onLogout}
          style={styles.logoutButton}
        >
          {t("account.logout.title")}
        </AtomicButton>

        <View style={styles.deleteLink}>
          <AtomicButton
            variant="danger"
            size="sm"
            onPress={handleDeleteAccount}
          >
            {t("account.deleteAccount.title")}
          </AtomicButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
  },
  section: {
    marginBottom: 16,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    borderRadius: 0,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  logoutButton: {
    width: "100%",
  },
  deleteLink: {
    alignItems: "center",
  },
});
