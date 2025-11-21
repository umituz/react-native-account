/**
 * Edit Profile Screen
 * Allows users to edit their profile information: name, email, and avatar
 * Single Responsibility: Screen presentation only (no business logic)
 */

import React from "react";
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { User, Mail } from "lucide-react-native";
import { useLocalization } from "@umituz/react-native-localization";
import {
  useAppDesignTokens,
  useTheme,
} from "@umituz/react-native-design-system-theme";
import { EditProfileHeader } from "../components/EditProfileHeader";
import { AvatarSection } from "../components/AvatarSection";
import { ProfileInputSection } from "../components/ProfileInputSection";
import { SaveProfileButton } from "../components/SaveProfileButton";
import { LoadingState } from "../components/LoadingState";

interface EditProfileFormState {
  displayName: string;
  email: string;
  photoURL: string | null;
}

interface EditProfileScreenProps {
  formState: EditProfileFormState;
  loading: boolean;
  saving: boolean;
  avatarUrl: string;
  isGuest: boolean;
  onDisplayNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPickImage: () => Promise<void>;
  onSave: () => Promise<void>;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  formState,
  loading,
  saving,
  avatarUrl,
  isGuest,
  onDisplayNameChange,
  onEmailChange,
  onPickImage,
  onSave,
}) => {
  const { t } = useLocalization();
  const tokens = useAppDesignTokens();
  const { themeMode } = useTheme();
  const isDark = themeMode === "dark";
  const colors = tokens.colors;

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.backgroundPrimary },
        ]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <EditProfileHeader />
        <LoadingState />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <EditProfileHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AvatarSection avatarUrl={avatarUrl} onPickImage={onPickImage} />

        <ProfileInputSection
          label={t("editProfile.name", "Name")}
          value={formState.displayName}
          onChangeText={onDisplayNameChange}
          placeholder={t("editProfile.namePlaceholder", "Enter your name")}
          icon={User}
        />

        {!isGuest && (
          <ProfileInputSection
            label={t("editProfile.email", "Email")}
            value={formState.email}
            onChangeText={onEmailChange}
            placeholder={t("editProfile.emailPlaceholder", "Enter your email")}
            icon={Mail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}

        <SaveProfileButton saving={saving} onPress={onSave} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },
});

