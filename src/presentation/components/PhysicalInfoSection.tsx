/**
 * Physical Info Section Component
 * Single Responsibility: Render physical information settings section
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { useNavigation } from "@react-navigation/native";
import { User, Ruler } from "lucide-react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import { SettingsSection } from "./SettingsSection";
import { SettingItem } from "./SettingItem";

export const PhysicalInfoSection: React.FC = () => {
  const { t } = useLocalization();
  const navigation = useNavigation();
  const tokens = useAppDesignTokens();

  const handlePersonalInfoPress = () => {
    navigation.navigate("PersonalInfo" as never);
  };

  const handleNutritionGoalsPress = () => {
    navigation.navigate("NutritionGoals" as never);
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.surface }]}>
      <View style={styles.section}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t("account.physicalInfo.title")}</Text>
      </View>
        <View style={styles.content}>
          <SettingItem
            icon={User}
            title={t("account.physicalInfo.personal.title")}
            value={t("account.physicalInfo.personal.description")}
            onPress={handlePersonalInfoPress}
          />
          <SettingItem
            icon={Ruler}
            title={t("account.physicalInfo.goals.title")}
            value={t("account.physicalInfo.goals.description")}
            onPress={handleNutritionGoalsPress}
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
