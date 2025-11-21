/**
 * User Profile Header Component
 * Single Responsibility: Display user profile header with avatar
 */

import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { AtomicText, AtomicIcon, useAppDesignTokens } from "@umituz/react-native-design-system";
import { useNavigation } from "@react-navigation/native";
import type { UserProfile } from "../../../domain/types/UserProfileTypes";

export interface UserProfileHeaderProps {
  userProfile: UserProfile;
  userId: string;
  isGuest: boolean;
  isPremium: boolean;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  userProfile,
  userId,
  isGuest,
  isPremium,
}) => {
  const tokens = useAppDesignTokens();
  const navigation = useNavigation();
  const colors = tokens.colors;
  const gradientColors = isPremium
    ? [colors.warning, colors.warning + "CC"]
    : [colors.primary, colors.secondary];

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: gradientColors[0],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <AtomicIcon name="ChevronLeft" size="md" color="onSurface" />
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        {userProfile.photoURL ? (
          <Image
            source={{ uri: userProfile.photoURL }}
            style={styles.avatarImage}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <AtomicIcon name="User" size="xxl" color="onSurface" />
          </View>
        )}
        {isPremium && (
          <View style={styles.premiumBadge}>
            <AtomicIcon name="Crown" size="sm" color="onSurface" />
          </View>
        )}
      </View>

      <AtomicText type="headlineMedium" style={styles.userName}>
        {userProfile.displayName ||
          (isGuest ? `Guest ${userId?.substring(0, 8)}` : "User")}
      </AtomicText>
      {!isGuest && userProfile.email && (
        <AtomicText type="bodyMedium" style={styles.userEmail}>
          {userProfile.email}
        </AtomicText>
      )}
      {isGuest && (
        <AtomicText type="bodyMedium" style={styles.userEmail}>
          Anonymous User • {userId?.substring(0, 8)}
        </AtomicText>
      )}

      {isPremium && (
        <View style={styles.premiumLabel}>
          <AtomicIcon name="Sparkles" size="sm" color="onSurface" />
          <AtomicText
            type="labelSmall"
            style={{ color: "#FFFFFF", marginLeft: 6, fontWeight: "600" }}
          >
            Premium Member
          </AtomicText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  premiumBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "#F59E0B",
  },
  userName: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginTop: 16,
    textAlign: "center",
  },
  userEmail: {
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: 4,
  },
  premiumLabel: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});
