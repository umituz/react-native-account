/**
 * useProfileScreen Hook Factory
 * Single Responsibility: Manage profile screen logic and data
 */

import { useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert, Share as RNShare } from "react-native";
import { useLocalization } from "@umituz/react-native-localization";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";

interface UserProfile {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

interface UseProfileScreenConfig {
  useAuth: () => {
    user: { displayName?: string; email?: string } | null;
    userId: string | null;
    isGuest: boolean;
  };
  useAuthProfile: () => {
    userProfile: UserProfile | null;
    refetchProfile: (() => Promise<void>) | (() => Promise<any>) | (() => any);
  };
}

export interface UseProfileScreenReturn {
  userId: string | null;
  displayName: string;
  email: string;
  avatarUrl: string;
  isGuest: boolean;
  handleBack: () => void;
  handleShareProfile: () => Promise<void>;
  handleEditPress: () => void;
}

export function createUseProfileScreen(
  config: UseProfileScreenConfig,
): () => UseProfileScreenReturn {
  const { useAuth, useAuthProfile } = config;

  return function useProfileScreen(): UseProfileScreenReturn {
    const navigation = useNavigation();
    const { t } = useLocalization();
    const tokens = useAppDesignTokens();
    const colors = tokens.colors;
    const { user, userId, isGuest } = useAuth();
    const { userProfile, refetchProfile } = useAuthProfile();

    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        if (userId) {
          const result = refetchProfile();
          if (result && typeof result.then === "function") {
            result.catch(() => {
              // Ignore errors
            });
          }
        }
      });

      return unsubscribe;
    }, [navigation, userId, refetchProfile]);

    const handleBack = useCallback(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("Settings" as never);
      }
    }, [navigation]);

    const handleShareProfile = useCallback(async () => {
      if (!userProfile) return;

      const displayName =
        userProfile.displayName ||
        (isGuest && userId ? `Guest ${userId.substring(0, 8)}` : "User");
      const shareMessageTemplate = t(
        "profile.shareMessage",
        "Check out my profile: {{displayName}}",
      );
      const shareMessage = shareMessageTemplate.replace(
        "{{displayName}}",
        displayName,
      );

      try {
        await RNShare.share({
          message: shareMessage,
          title: t("profile.shareTitle", "My Profile"),
        });
      } catch (error) {
        if ((error as any)?.message !== "User did not share") {
          Alert.alert(
            t("common.error", "Error"),
            t("profile.shareError", "Failed to share profile. Please try again."),
          );
        }
      }
    }, [userProfile, isGuest, userId, t]);

    const handleEditPress = useCallback(() => {
      navigation.navigate("EditProfile" as never);
    }, [navigation]);

    const displayName =
      userProfile?.displayName ||
      user?.displayName ||
      (isGuest && userId ? `Guest ${userId.substring(0, 8)}` : "User");
    const email = userProfile?.email || user?.email || "";
    const avatarUrl =
      userProfile?.photoURL ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${colors.primary.replace("#", "")}&color=fff&size=128`;

    return {
      userId,
      displayName,
      email,
      avatarUrl,
      isGuest,
      handleBack,
      handleShareProfile,
      handleEditPress,
    };
  };
}
