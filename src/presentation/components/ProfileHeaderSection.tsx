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
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatarUrl }}
            style={[
              styles.avatar,
              {
                borderColor: colors.primary,
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
              {t("account.guest.user", "Guest User")}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.editButton, {
            backgroundColor: `${colors.primary}20`,
            borderColor: colors.primary,
          }]}
          onPress={onEditPress}
        >
          <Text style={[styles.editButtonText, { color: colors.primary }]}>
            {t("profile.editProfile", "Edit Profile")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 16,
    marginTop: 16,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "center",
  },
  editButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderWidth: 1,
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
