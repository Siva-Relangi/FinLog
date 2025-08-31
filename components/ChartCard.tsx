import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { colors, radii, shadow, spacing, typography } from "../theme/theme";

const screenWidth = Dimensions.get("window").width;

type ChartData = {
  name: string;
  amount: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
};

type ChartCardProps = {
  title: string;
  subtitle?: string;
  type: "pie" | "bar";
  data: ChartData[];
  total?: number;
  height?: number;
};

export default function ChartCard({
  title,
  subtitle,
  type,
  data,
  total,
  height = 200,
}: ChartCardProps) {
  // Don't render if no data
  if (!data || data.length === 0) {
    return null;
  }

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
  };

  const pieChartData = data.map((item) => ({
    name: item.name,
    population: item.amount,
    color: item.color,
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  }));

  const barChartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.amount),
      },
    ],
  };

  // Calculate chart width with proper padding
  const chartWidth = Math.max(screenWidth - 64, 300); // Minimum width of 300

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {total && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
        )}
      </View>

      <View style={styles.chartContainer}>
        {type === "pie" ? (
          <PieChart
            data={pieChartData}
            width={chartWidth}
            height={height}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <BarChart
            data={barChartData}
            width={chartWidth}
            height={height}
            chartConfig={chartConfig}
            yAxisLabel="$"
            yAxisSuffix=""
            verticalLabelRotation={30}
            fromZero
            showBarTops
            showValuesOnTopOfBars
          />
        )}
      </View>

      {/* Legend: only for bar chart */}
      {type === "bar" && (
        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={`${item.name}-${index}`} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>{item.name}</Text>
              <Text style={styles.legendAmount}>${item.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadow.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },

  title: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },

  totalContainer: {
    alignItems: "flex-end",
  },

  totalLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },

  totalAmount: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: "700",
  },

  chartContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },

  legend: {
    gap: spacing.sm,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  legendColor: {
    width: 12,
    height: 12,
    borderRadius: radii.xs,
  },

  legendText: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  legendAmount: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: "600",
  },
});
