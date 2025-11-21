/**
 * Profile Screen Header Component
 * Single Responsibility: Display header with back and share buttons
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Share as ShareIcon } from "lucide-react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";

interface ProfileScreenHeaderProps {
  onBack: () => void;
  onShare: () => void;
}

export const ProfileScreenHeader: React.FC<ProfileScreenHeaderProps> = ({
  onBack,
  onShare,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();
  const tokens = useAppDesignTokens();
  const colors = tokens.colors;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundPrimary,
          paddingTop: insets.top + 16,
        },
      ]}
    >
      <TouchableOpacity style={styles.button} onPress={onBack}>
        <ArrowLeft size={24} color={colors.primary} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t("profile.title", "Profile")}
      </Text>

      <TouchableOpacity style={styles.button} onPress={onShare}>
        <ShareIcon size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
});
