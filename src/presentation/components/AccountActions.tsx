/**
 * Account Actions Component
 * Single Responsibility: Display account action buttons
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  AtomicText,
  AtomicIcon,
  useAppDesignTokens,
} from "@umituz/react-native-design-system";
import { useNavigation } from "@react-navigation/native";

export interface AccountActionsProps {
  isPremium: boolean;
  onUpgrade?: () => void;
  onSignOut?: () => void;
}

export const AccountActions: React.FC<AccountActionsProps> = ({
  isPremium,
  onUpgrade,
  onSignOut,
}) => {
  const tokens = useAppDesignTokens();
  const navigation = useNavigation();

  return (
    <View style={styles.section}>
      <AtomicText
        type="titleMedium"
        style={{
          color: tokens.colors.textPrimary,
          fontWeight: "700",
          marginBottom: 16,
        }}
      >
        Account
      </AtomicText>

      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: tokens.colors.surface },
        ]}
        onPress={() => navigation.navigate("Settings" as never)}
        activeOpacity={0.8}
      >
        <AtomicIcon name="Settings" size="md" color="primary" />
        <AtomicText
          type="bodyMedium"
          style={{
            color: tokens.colors.textPrimary,
            marginLeft: 12,
            flex: 1,
          }}
        >
          Settings
        </AtomicText>
        <AtomicIcon name="ChevronRight" size="sm" color="secondary" />
      </TouchableOpacity>

      {!isPremium && onUpgrade && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: tokens.colors.surface },
          ]}
          onPress={onUpgrade}
          activeOpacity={0.8}
        >
          <AtomicIcon name="Crown" size="md" color="primary" />
          <AtomicText
            type="bodyMedium"
            style={{
              color: tokens.colors.textPrimary,
              marginLeft: 12,
              flex: 1,
            }}
          >
            Upgrade to Premium
          </AtomicText>
          <View
            style={[
              styles.upgradeBadge,
              { backgroundColor: tokens.colors.primary },
            ]}
          >
            <AtomicText
              type="labelSmall"
              style={{ color: "#FFFFFF", fontWeight: "600" }}
            >
              $9.99
            </AtomicText>
          </View>
        </TouchableOpacity>
      )}

      {onSignOut && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: tokens.colors.surface },
          ]}
          onPress={onSignOut}
          activeOpacity={0.8}
        >
          <AtomicIcon name="LogOut" size="md" color="error" />
          <AtomicText
            type="bodyMedium"
            style={{ color: tokens.colors.error, marginLeft: 12, flex: 1 }}
          >
            Sign Out
          </AtomicText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  upgradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
