/**
 * SaveProfileButton Component
 * Renders save button with loading state
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";

interface SaveProfileButtonProps {
  saving: boolean;
  onPress: () => void;
}

export const SaveProfileButton: React.FC<SaveProfileButtonProps> = ({
  saving,
  onPress,
}) => {
  const { t } = useLocalization();
  const tokens = useAppDesignTokens();
  const colors = tokens.colors;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.primary,
          opacity: saving ? 0.7 : 1,
        },
      ]}
      onPress={onPress}
      disabled={saving}
    >
      {saving ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.buttonText}>
          {t("editProfile.save", "Save Changes")}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
