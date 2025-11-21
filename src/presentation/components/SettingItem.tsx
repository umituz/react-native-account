/**
 * SettingItem Component
 * Reusable setting item with icon, title, and optional value
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";

interface SettingItemProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
  iconColor?: string;
  titleColor?: string;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  title,
  value,
  onPress,
  isLast = false,
  iconColor,
  titleColor,
}) => {
  const tokens = useAppDesignTokens();
  const colors = tokens.colors;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: colors.backgroundPrimary,
          },
        ]}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: iconColor
                  ? `${iconColor}15`
                  : `${colors.primary}15`,
              },
            ]}
          >
            <Icon size={20} color={iconColor || colors.primary} />
          </View>
          <Text
            style={[
              styles.title,
              {
                color: titleColor || colors.textPrimary,
              },
            ]}
          >
            {title}
          </Text>
        </View>

        <View style={styles.rightSection}>
          {value && (
            <Text
              style={[
                styles.value,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {value}
            </Text>
          )}
          <ChevronRight size={18} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      {!isLast && (
        <View
          style={[
            styles.divider,
            {
              backgroundColor: `${colors.textSecondary}20`,
            },
          ]}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
});
