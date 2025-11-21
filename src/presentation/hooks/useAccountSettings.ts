/**
 * useAccountSettings Hook Factory
 * Single Responsibility: Account settings operations (logout, delete account)
 */

import { useCallback } from "react";
import { Alert } from "react-native";
import { useLocalization } from "@umituz/react-native-localization";
interface UseAccountResult {
  loading?: boolean;
  error?: string | null;
  logout: (options?: any) => Promise<any>;
  deleteAccount: (userId: string, password: string) => Promise<any>;
  clearError?: () => void;
}

interface UseAccountSettingsConfig {
  useAuth: () => {
    user: { id: string } | null;
    isGuest: boolean;
  };
  useAccount: () => UseAccountResult;
  appId?: string;
}

export interface UseAccountSettingsReturn {
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
}

export function createUseAccountSettings(
  config: UseAccountSettingsConfig,
): () => UseAccountSettingsReturn {
  const { useAuth, useAccount, appId = "app" } = config;

  return function useAccountSettings(): UseAccountSettingsReturn {
    const { t } = useLocalization();
    const { user, isGuest } = useAuth();
    const { logout, deleteAccount } = useAccount();

    const handleLogout = useCallback(async () => {
      Alert.alert(
        t("settings.logout.confirmTitle", "Log Out"),
        t("settings.logout.confirmMessage", "Are you sure you want to log out?"),
        [
          {
            text: t("common.cancel", "Cancel"),
            style: "cancel",
          },
          {
            text: t("settings.logout.title", "Log Out"),
            style: "destructive",
            onPress: async () => {
              try {
                const result = await logout({
                  appId,
                  clearAllStorage: true,
                });
                if (!result.success) {
                  Alert.alert(
                    t("common.error", "Error"),
                    t(
                      "settings.logout.error",
                      "Failed to log out. Please try again.",
                    ),
                  );
                }
              } catch (error) {
                Alert.alert(
                  t("common.error", "Error"),
                  t(
                    "settings.logout.error",
                    "Failed to log out. Please try again.",
                  ),
                );
              }
            },
          },
        ],
      );
    }, [logout, t, appId]);

    const handleDeleteAccount = useCallback(async () => {
      if (!user) return;

      Alert.alert(
        t("settings.deleteAccount.confirmTitle", "Delete Account"),
        t(
          "settings.deleteAccount.confirmMessage",
          "This will permanently delete your account and all associated data. This action cannot be undone.",
        ),
        [
          {
            text: t("common.cancel", "Cancel"),
            style: "cancel",
          },
          {
            text: t("settings.deleteAccount.title", "Delete Account"),
            style: "destructive",
            onPress: async () => {
              try {
                const password = isGuest ? "" : "anonymous";
                const result = await deleteAccount(user.id, password);
                if (result.success) {
                  // Account deletion successful
                } else {
                  Alert.alert(
                    t("common.error", "Error"),
                    result.error?.message ||
                      t(
                        "settings.deleteAccount.error",
                        "Failed to delete account. Please try again.",
                      ),
                  );
                }
              } catch (error) {
                Alert.alert(
                  t("common.error", "Error"),
                  t(
                    "settings.deleteAccount.error",
                    "Failed to delete account. Please try again.",
                  ),
                );
              }
            },
          },
        ],
      );
    }, [user, isGuest, deleteAccount, t]);

    return {
      handleLogout,
      handleDeleteAccount,
    };
  };
}
