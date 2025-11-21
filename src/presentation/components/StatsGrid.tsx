/**
 * Stats Grid Component
 * Single Responsibility: Display user statistics
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AtomicText,
  AtomicIcon,
  useAppDesignTokens,
} from "@umituz/react-native-design-system";
import type { UserStats } from "../../domain/types/UserStats";

export interface StatsGridProps {
  stats: UserStats & { videosGenerated: number };
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const tokens = useAppDesignTokens();

  const statItems = [
    {
      icon: "Folder" as const,
      value: stats.totalProjects,
      label: "Projects Created",
      color: tokens.colors.primary,
    },
    {
      icon: "Download" as const,
      value: stats.totalExports,
      label: "Videos Exported",
      color: tokens.colors.success,
    },
    {
      icon: "Grid3x3" as const,
      value: stats.totalTemplatesUsed,
      label: "Templates Used",
      color: tokens.colors.secondary,
    },
    {
      icon: "Zap" as const,
      value: stats.videosGenerated,
      label: "Videos Today",
      color: "#EC4899",
    },
  ];

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
        Your Statistics
      </AtomicText>

      <View style={styles.statsGrid}>
        {statItems.map((item, index) => (
          <View
            key={index}
            style={[
              styles.statCard,
              { backgroundColor: tokens.colors.surface },
            ]}
          >
            <View
              style={[styles.statIcon, { backgroundColor: item.color + "20" }]}
            >
              <AtomicIcon
                name={item.icon}
                size="md"
                color={
                  item.color === "#EC4899" ? "primary" : (item.color as any)
                }
              />
            </View>
            <AtomicText
              type="headlineMedium"
              style={{
                color: tokens.colors.textPrimary,
                fontWeight: "700",
                marginTop: 12,
              }}
            >
              {item.value}
            </AtomicText>
            <AtomicText
              type="bodySmall"
              style={{ color: tokens.colors.textSecondary, marginTop: 4 }}
            >
              {item.label}
            </AtomicText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
