/**
 * Goals Section Component
 * Single Responsibility: Render nutrition goals settings section
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { useNavigation } from "@react-navigation/native";
import { Target } from "lucide-react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import { SettingsSection } from "./SettingsSection";
import { SettingItem } from "./SettingItem";

export const GoalsSection: React.FC = () => {
  const { t } = useLocalization();
  const navigation = useNavigation();
  const tokens = useAppDesignTokens();

  const handleGoalsPress = () => {
    navigation.navigate("Goals" as never);
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.surface }]}>
      <View style={styles.section}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t("account.goals.title")}</Text>
      </View>
        <View style={styles.content}>
          <SettingItem
            icon={Target}
            title={t("account.goals.nutrition.title")}
            value={t("account.goals.nutrition.description")}
            onPress={handleGoalsPress}
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
