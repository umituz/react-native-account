/**
 * useEditProfileImage Hook
 * Single Responsibility: Image picker logic for profile editing
 */

import { useCallback } from "react";
import { Alert } from "react-native";
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

export function useEditProfileImage(
  media: UseMediaReturn,
  onImageSelected: (uri: string) => void
) {
  const { t } = useLocalization();
  const pickImage = media.pickImage || media.pickImageAsync;

  const handlePickImage = useCallback(async () => {
    if (!pickImage) {
      Alert.alert(
        t("common.error", "Error"),
        t("editProfile.imagePickerNotAvailable", "Image picker is not available.")
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
      onImageSelected(asset.uri);
    }
  }, [pickImage, onImageSelected, t]);

  return { handlePickImage };
}

