/**
 * Quota Card Component
 * Single Responsibility: Display daily video quota
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  AtomicText,
  AtomicIcon,
  useAppDesignTokens,
} from "@umituz/react-native-design-system";

export interface QuotaCardProps {
  isPremium: boolean;
  remaining: number;
  total: number;
  onUpgrade?: () => void;
}

export const QuotaCard: React.FC<QuotaCardProps> = ({
  isPremium,
  remaining,
  total,
  onUpgrade,
}) => {
  const tokens = useAppDesignTokens();

  return (
    <View style={styles.section}>
      <View
        style={[styles.quotaCard, { backgroundColor: tokens.colors.surface }]}
      >
        <View style={styles.quotaHeader}>
          <AtomicText
            type="titleMedium"
            style={{ color: tokens.colors.textPrimary, fontWeight: "700" }}
          >
            Daily Video Quota
          </AtomicText>
          {!isPremium && onUpgrade && (
            <TouchableOpacity onPress={onUpgrade} activeOpacity={0.8}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AtomicIcon name="ArrowUpCircle" size="sm" color="primary" />
                <AtomicText
                  type="labelSmall"
                  style={{
                    color: tokens.colors.primary,
                    marginLeft: 4,
                    fontWeight: "600",
                  }}
                >
                  Upgrade
                </AtomicText>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {isPremium ? (
          <View style={styles.quotaContent}>
            <AtomicIcon name="Infinity" size="xl" color="primary" />
            <AtomicText
              type="headlineLarge"
              style={{
                color: tokens.colors.primary,
                fontWeight: "700",
                marginTop: 12,
              }}
            >
              Unlimited
            </AtomicText>
            <AtomicText
              type="bodyMedium"
              style={{ color: tokens.colors.textSecondary, marginTop: 4 }}
            >
              Generate as many videos as you want
            </AtomicText>
          </View>
        ) : (
          <View style={styles.quotaContent}>
            <View style={styles.quotaCircle}>
              <AtomicText
                type="headlineLarge"
                style={{ color: tokens.colors.primary, fontWeight: "700" }}
              >
                {remaining}
              </AtomicText>
              <AtomicText
                type="bodySmall"
                style={{ color: tokens.colors.textSecondary }}
              >
                / {total}
              </AtomicText>
            </View>

            <View style={styles.quotaProgress}>
              <View
                style={[
                  styles.quotaProgressBar,
                  { backgroundColor: tokens.colors.borderLight },
                ]}
              >
                <View
                  style={[
                    styles.quotaProgressFill,
                    {
                      backgroundColor: tokens.colors.primary,
                      width: `${(remaining / total) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <AtomicText
              type="bodySmall"
              style={{ color: tokens.colors.textSecondary, marginTop: 8 }}
            >
              Resets daily at midnight
            </AtomicText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  quotaCard: {
    padding: 20,
    borderRadius: 16,
  },
  quotaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  quotaContent: {
    alignItems: "center",
  },
  quotaCircle: {
    alignItems: "center",
    marginBottom: 16,
  },
  quotaProgress: {
    width: "100%",
  },
  quotaProgressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  quotaProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
});
