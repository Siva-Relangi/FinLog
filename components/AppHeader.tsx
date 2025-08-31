import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { colors, spacing, typography } from "../theme/theme";

export default function AppHeader({
  onInsightsPress,
}: {
  onInsightsPress?: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet-outline" size={28} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.title}>FinLog</Text>
            <Text style={styles.subtitle}>Track. Understand. Improve.</Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem} onPress={onInsightsPress}>
            <Text style={styles.statValue}>📊</Text>
            <Text style={styles.statLabel}>
              Insights
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
    marginTop: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontFamily: "Inter_500Medium",
  },

  statsContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },

  statItem: {
    alignItems: "center",
    gap: spacing.xs,
  },

  statValue: {
    fontSize: 20,
  },

  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontFamily: "Inter_600SemiBold",
  },
});
