/**
 * App Settings Section Component
 * Single Responsibility: Render app settings section with language, appearance, notifications
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { Languages, Palette, Bell } from "lucide-react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import { useAppearance } from "@umituz/react-native-appearance";
import { SettingItem } from "./SettingItem";

interface AppSettingsSectionProps {
  onLanguagePress: () => void;
  onAppearancePress: () => void;
  onNotificationsPress: () => void;
}

export const AppSettingsSection: React.FC<AppSettingsSectionProps> = ({
  onLanguagePress,
  onAppearancePress,
  onNotificationsPress,
}) => {
  const { t } = useLocalization();
  const tokens = useAppDesignTokens();
  const { themeMode } = useAppearance();

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.surface }]}>
      <View style={styles.section}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t("account.settings.title")}</Text>
        </View>
        <View style={styles.content}>
          <SettingItem
            icon={Languages}
            title={t("settings.language")}
            value={t("settings.languageDescription")}
            onPress={onLanguagePress}
          />
          <SettingItem
            icon={Palette}
            title={t("settings.appearance.title")}
            value={t("settings.appearance.description")}
            onPress={onAppearancePress}
          />
          <SettingItem
            icon={Bell}
            title={t("settings.notifications.title")}
            value={t("settings.notifications.description")}
            onPress={onNotificationsPress}
            isLast={true}
          />
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
});
