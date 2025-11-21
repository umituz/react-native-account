/**
 * useEditProfile Hook Factory
 * Single Responsibility: Form state and profile editing operations
 */

import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocalization } from "@umituz/react-native-localization";
interface UseMediaReturn {
  pickImage?: (options?: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  }) => Promise<{
    canceled: boolean;
    assets?: Array<{ uri: string }>;
  }>;
  pickImageAsync?: (options?: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  }) => Promise<{
    canceled: boolean;
    assets?: Array<{ uri: string }>;
  }>;
}

interface UserProfile {
  id: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

interface UserProfileService {
  loadUserProfile: (userId: string) => Promise<UserProfile | null>;
  createUserProfile?: (
    userId: string,
    data: {
      email?: string;
      displayName?: string | null;
      photoURL?: string;
    },
  ) => Promise<void>;
  updateUserProfile: (
    userId: string,
    data: {
      displayName?: string | null;
      email?: string | null;
      photoURL?: string | null;
    },
  ) => Promise<void>;
}

interface UseEditProfileConfig {
  useAuth: () => {
    user: { displayName?: string; email?: string } | null;
    userId: string | null;
    isGuest: boolean;
  };
  useMedia: () => UseMediaReturn;
  userProfileService: UserProfileService;
}

export interface EditProfileFormState {
  displayName: string;
  email: string;
  photoURL: string | null;
}

export interface UseEditProfileReturn {
  formState: EditProfileFormState;
  loading: boolean;
  saving: boolean;
  userProfile: UserProfile | null;
  setDisplayName: (name: string) => void;
  setEmail: (email: string) => void;
  handlePickImage: () => Promise<void>;
  handleSave: () => Promise<void>;
}

export function createUseEditProfile(
  config: UseEditProfileConfig,
): () => UseEditProfileReturn {
  const { useAuth, useMedia, userProfileService } = config;

  return function useEditProfile(): UseEditProfileReturn {
    const { t } = useLocalization();
    const navigation = useNavigation();
    const { user, userId, isGuest } = useAuth();
    const media = useMedia();
    const pickImage = media.pickImage || media.pickImageAsync;

    const [formState, setFormState] = useState<EditProfileFormState>({
      displayName: "",
      email: "",
      photoURL: null,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
      const loadProfile = async () => {
        if (!userId) {
          setLoading(false);
          return;
        }

        const profile = await userProfileService.loadUserProfile(userId);
        if (profile) {
          setUserProfile(profile);
          setFormState({
            displayName:
              profile.displayName ||
              user?.displayName ||
              (isGuest ? `Guest ${userId.substring(0, 8)}` : ""),
            email: profile.email || user?.email || "",
            photoURL: profile.photoURL || null,
          });
        } else {
          setFormState({
            displayName:
              user?.displayName ||
              (isGuest ? `Guest ${userId.substring(0, 8)}` : ""),
            email: user?.email || "",
            photoURL: null,
          });
        }
        setLoading(false);
      };

      loadProfile();
    }, [userId, user, isGuest, userProfileService]);

    const setDisplayName = useCallback((name: string) => {
      setFormState((prev) => ({ ...prev, displayName: name }));
    }, []);

    const setEmail = useCallback((email: string) => {
      setFormState((prev) => ({ ...prev, email }));
    }, []);

    const handlePickImage = useCallback(async () => {
      if (!pickImage) {
        Alert.alert(
          t("common.error", "Error"),
          t("editProfile.imagePickerNotAvailable", "Image picker is not available."),
        );
        return;
      }

      const result = await pickImage({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setFormState((prev) => ({ ...prev, photoURL: asset.uri }));
      }
    }, [pickImage, t]);

    const handleSave = useCallback(async () => {
      if (!userId) {
        Alert.alert(
          t("common.error", "Error"),
          t("editProfile.userIdRequired", "User ID is required."),
        );
        return;
      }

      if (formState.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formState.email)) {
          Alert.alert(
            t("common.error", "Error"),
            t("editProfile.invalidEmail", "Please enter a valid email address."),
          );
          return;
        }
      }

      setSaving(true);

      try {
        let profile = await userProfileService.loadUserProfile(userId);

        if (!profile && userProfileService.createUserProfile) {
          await userProfileService.createUserProfile(userId, {
            email: formState.email.trim() || undefined,
            displayName: formState.displayName.trim() || null,
            photoURL: formState.photoURL || undefined,
          });
        } else {
          const updateData: {
            displayName?: string | null;
            email?: string | null;
            photoURL?: string | null;
          } = {
            displayName: formState.displayName.trim() || null,
            email: formState.email.trim() || null,
          };

          if (formState.photoURL) {
            updateData.photoURL = formState.photoURL;
          }

          await userProfileService.updateUserProfile(userId, updateData);
        }

        Alert.alert(
          t("common.success", "Success"),
          t("editProfile.success", "Profile updated successfully!"),
          [
            {
              text: t("common.ok", "OK"),
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } catch (error) {
        Alert.alert(
          t("common.error", "Error"),
          t(
            "editProfile.updateError",
            "Failed to update profile. Please try again.",
          ),
        );
      } finally {
        setSaving(false);
      }
    }, [userId, formState, t, navigation, userProfileService]);

    return {
      formState,
      loading,
      saving,
      userProfile,
      setDisplayName,
      setEmail,
      handlePickImage,
      handleSave,
    };
  };
}
