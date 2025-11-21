/**
 * AccountSettingsHeader Component
 * Renders the header for Account Settings screen
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import { useNavigation } from "@react-navigation/native";

export const AccountSettingsHeader: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();
  const tokens = useAppDesignTokens();
  const navigation = useNavigation();
  const colors = tokens.colors;

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.backgroundPrimary,
          paddingTop: insets.top + 16,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft size={24} color={colors.primary} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t("settings.sections.account.title")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginRight: 48,
  },
});
