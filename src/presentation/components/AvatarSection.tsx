/**
 * AvatarSection Component
 * Renders avatar with camera button for editing
 */

import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Camera } from "lucide-react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";

interface AvatarSectionProps {
  avatarUrl: string;
  onPickImage: () => void;
}

export const AvatarSection: React.FC<AvatarSectionProps> = ({
  avatarUrl,
  onPickImage,
}) => {
  const { t } = useLocalization();
  const tokens = useAppDesignTokens();
  const colors = tokens.colors;

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatarUrl }}
          style={[
            styles.avatar,
            {
              borderColor: `${colors.primary}80`,
            },
          ]}
        />
        <TouchableOpacity
          style={[
            styles.cameraButton,
            {
              backgroundColor: colors.primary,
              borderColor: colors.backgroundPrimary,
            },
          ]}
          onPress={onPickImage}
        >
          <Camera size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        {t("editProfile.changePhoto", "Tap to change photo")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },
  hint: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
