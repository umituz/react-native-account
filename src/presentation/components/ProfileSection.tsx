/**
 * ProfileSection Component
 * Renders profile settings section
 */

import React from "react";
import { User } from "lucide-react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { useNavigation } from "@react-navigation/native";
import { SettingsSection } from "./SettingsSection";
import { SettingItem } from "./SettingItem";

interface ProfileSectionProps {
  isGuest: boolean;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ isGuest }) => {
  const { t } = useLocalization();
  const navigation = useNavigation();

  if (isGuest) {
    return null;
  }

  return (
    <SettingsSection
      title={t("settings.sections.profileSecurity.title", "Profile & Security")}
    >
      <SettingItem
        icon={User}
        title={t("settings.sections.account.profile", "Profile")}
        onPress={() => navigation.navigate("Profile" as never)}
        isLast={true}
      />
    </SettingsSection>
  );
};
