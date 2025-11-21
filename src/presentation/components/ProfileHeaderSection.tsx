/**
 * Profile Header Section Component
 * Single Responsibility: Display profile avatar, name, email, and edit button
 */

import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";

interface ProfileHeaderSectionProps {
  displayName: string;
  email?: string;
  avatarUrl: string;
  isGuest: boolean;
  userId?: string;
  onEditPress: () => void;
}

export const ProfileHeaderSection: React.FC<ProfileHeaderSectionProps> = ({
  displayName,
  email,
  avatarUrl,
  isGuest,
  userId,
  onEditPress,
}) => {
  const { t } = useLocalization();
  const tokens = useAppDesignTokens();
  const colors = tokens.colors;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}
    >
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
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {displayName}
        </Text>
        {!isGuest && email && (
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {email}
          </Text>
        )}
        {isGuest && userId && (
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            Anonymous User • {userId.substring(0, 8)}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: colors.primary }]}
        onPress={onEditPress}
      >
        <Text style={styles.editButtonText}>
          {t("profile.editProfile", "Edit Profile")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  editButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
