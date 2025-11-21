/**
 * AccountActionsSection Component
 * Renders account actions (change password, logout, delete account)
 */

import React from "react";
import { LogOut, Trash2, Lock } from "lucide-react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { useNavigation } from "@react-navigation/native";
import { SettingsSection } from "./SettingsSection";
import { SettingItem } from "./SettingItem";

interface AccountActionsSectionProps {
  onLogout: () => void | Promise<void>;
  onDeleteAccount: () => void | Promise<void>;
  onChangePassword?: () => void;
}

export const AccountActionsSection: React.FC<AccountActionsSectionProps> = ({
  onLogout,
  onDeleteAccount,
  onChangePassword,
}) => {
  const { t } = useLocalization();
  const navigation = useNavigation();

  const handleChangePassword = () => {
    if (onChangePassword) {
      onChangePassword();
    } else {
      navigation.navigate("PasswordChange" as never);
    }
  };

  return (
    <SettingsSection
      title={t("settings.sections.accountActions.title", "Account Actions")}
    >
      <SettingItem
        icon={Lock}
        title={t("settings.changePassword.title", "Change Password")}
        onPress={handleChangePassword}
        iconColor="#6366F1"
        titleColor="#6366F1"
      />
      <SettingItem
        icon={LogOut}
        title={t("settings.logout.title", "Log Out")}
        onPress={onLogout}
        iconColor="#EF4444"
        titleColor="#EF4444"
      />
      <SettingItem
        icon={Trash2}
        title={t("settings.deleteAccount.title", "Delete Account")}
        onPress={onDeleteAccount}
        isLast={true}
        iconColor="#EF4444"
        titleColor="#EF4444"
      />
    </SettingsSection>
  );
};
