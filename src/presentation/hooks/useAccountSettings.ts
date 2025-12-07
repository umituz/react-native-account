/**
 * useAccountSettings Hook Factory
 * Single Responsibility: Account settings operations (logout, delete account)
 */

import { useCallback } from "react";
import { Alert } from "react-native";
import { useLocalization } from "@umituz/react-native-localization";
import type {
  UseAccountSettingsConfig,
  UseAccountSettingsReturn,
} from "./useAccountSettings.types";

export type { UseAccountSettingsConfig, UseAccountSettingsReturn };

export function createUseAccountSettings(
  config: UseAccountSettingsConfig
): () => UseAccountSettingsReturn {
  const { useAuth, useAccount, onLogoutSuccess, onDeleteAccountSuccess } =
    config;

  return function useAccountSettings(): UseAccountSettingsReturn {
    const { t } = useLocalization();
    const { user, isGuest, logout } = useAuth();
    const { deleteAccount } = useAccount();

    const handleLogout = useCallback(async () => {
      Alert.alert(
        t("settings.logout.confirmTitle", "Log Out"),
        t(
          "settings.logout.confirmMessage",
          "Are you sure you want to log out?"
        ),
        [
          { text: t("common.cancel", "Cancel"), style: "cancel" },
          {
            text: t("settings.logout.title", "Log Out"),
            style: "destructive",
            onPress: async () => {
              try {
                await logout();
                onLogoutSuccess?.();
              } catch {
                Alert.alert(
                  t("common.error", "Error"),
                  t("settings.logout.error", "Failed to log out.")
                );
              }
            },
          },
        ]
      );
    }, [logout, t, onLogoutSuccess]);

    const handleDeleteAccount = useCallback(async () => {
      if (!user) return;

      Alert.alert(
        t("settings.deleteAccount.confirmTitle", "Delete Account"),
        t(
          "settings.deleteAccount.confirmMessage",
          "This will permanently delete your account. This action cannot be undone."
        ),
        [
          { text: t("common.cancel", "Cancel"), style: "cancel" },
          {
            text: t("settings.deleteAccount.title", "Delete Account"),
            style: "destructive",
            onPress: async () => {
              try {
                const password = isGuest ? "" : "anonymous";
                const result = await deleteAccount(user.id, password);
                if (result.success) {
                  onDeleteAccountSuccess?.();
                } else {
                  Alert.alert(
                    t("common.error", "Error"),
                    result.error?.message ||
                      t("settings.deleteAccount.error", "Failed to delete.")
                  );
                }
              } catch {
                Alert.alert(
                  t("common.error", "Error"),
                  t("settings.deleteAccount.error", "Failed to delete.")
                );
              }
            },
          },
        ]
      );
    }, [user, isGuest, deleteAccount, t, onDeleteAccountSuccess]);

    return { handleLogout, handleDeleteAccount };
  };
}
