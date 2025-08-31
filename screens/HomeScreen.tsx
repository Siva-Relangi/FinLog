import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import AppHeader from "../components/AppHeader";
import ChartCard from "../components/ChartCard";
import ExpenseItem from "../components/ExpenseItem";
import FiltersBar from "../components/FilterBar";
import TotalsCard from "../components/ToolCard";
import { useData } from "../context/DataContext";
import { colors, radii, shadow, spacing, typography } from "../theme/theme";
import {
  formatHeaderDate,
  groupByDate,
  isThisMonthISO,
  isThisWeekISO,
  isTodayISO,
} from "../utils/date";
import { applyCategory, applySearch, sortExpenses } from "../utils/list";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  // ...existing code...

  const { expenses, categories, filters, setFilters } = useData();
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Filter + sort + search
  const visibleExpenses = useMemo(() => {
    let out = expenses;
    out = applyCategory(out, filters.categoryId);
    out = applySearch(out, filters.search);
    out = sortExpenses(out, filters.sortBy);
    return out;
  }, [expenses, filters]);

  const groups = useMemo(() => groupByDate(visibleExpenses), [visibleExpenses]);

  const totals = useMemo(() => {
    let today = 0,
      week = 0,
      month = 0;
    for (const e of expenses) {
      if (isTodayISO(e.date)) today += e.amount;
      if (isThisWeekISO(e.date)) week += e.amount;
      if (isThisMonthISO(e.date)) month += e.amount;
    }
    return { today, week, month };
  }, [expenses]);

  const breakdown = useMemo(() => {
    const map = new Map<string, number>();
    let monthTotal = 0;
    expenses.forEach((e) => {
      if (isThisMonthISO(e.date)) {
        monthTotal += e.amount;
        map.set(e.categoryId, (map.get(e.categoryId) || 0) + e.amount);
      }
    });
    const items = Array.from(map.entries()).map(([categoryId, amount]) => {
      const cat = categories.find((c) => c.id === categoryId);
      const pct = monthTotal > 0 ? (amount / monthTotal) * 100 : 0;
      return {
        categoryId,
        name: cat?.name || categoryId,
        icon: cat?.iconName,
        amount,
        pct,
      };
    });
    items.sort((a, b) => b.amount - a.amount);
    return { items, monthTotal };
  }, [expenses, categories]);

  // Chart data for category expenses (bar chart)
  const categoryBarChartData = useMemo(() => {
    const chartColors = [
      "#6366f1",
      "#ec4899",
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#ef4444",
      "#06b6d4",
      "#84cc16",
      "#f97316",
    ];
    return breakdown.items.map((item, index) => ({
      name: item.name,
      amount: item.amount,
      color: chartColors[index % chartColors.length],
    }));
  }, [breakdown.items]);

  // Chart data for monthly spending by category
  const pieChartData = useMemo(() => {
    const chartColors = [
      "#6366f1",
      "#8b5cf6",
      "#ec4899",
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#ef4444",
      "#06b6d4",
      "#84cc16",
      "#f97316",
    ];
    return breakdown.items.map((item, index) => ({
      name: item.name,
      amount: item.amount,
      color: chartColors[index % chartColors.length],
    }));
  }, [breakdown.items]);

  const renderHeader = () => (
    <View>
      <AppHeader onInsightsPress={() => setShowBreakdown((v) => !v)} />
      {showBreakdown ? (
        <View style={styles.chartsSection}>
          {categoryBarChartData.length > 0 && (
            <ChartCard
              title="Category Expenses (Bar Chart)"
              subtitle="Monthly expenses by category"
              type="bar"
              data={categoryBarChartData}
              height={220}
            />
          )}
        </View>
      ) : (
        <>
          {/* Totals Cards */}
          <View style={styles.totalsRow}>
            <TotalsCard
              label="Today"
              amount={totals.today}
              icon="sunny-outline"
            />
            <TotalsCard
              label="This Week"
              amount={totals.week}
              icon="calendar-outline"
            />
            <TotalsCard
              label="This Month"
              amount={totals.month}
              icon="pie-chart-outline"
            />
          </View>
          {/* Charts Section (only pie chart by default) */}
          <View style={styles.chartsSection}>
            {pieChartData.length > 0 && (
              <ChartCard
                title="Monthly Spending by Category"
                subtitle="This month's expenses breakdown"
                type="pie"
                data={pieChartData}
                height={220}
              />
            )}
          </View>
          {/* Filters */}
          <View style={styles.filtersSection}>
            <FiltersBar
              categories={categories}
              categoryId={filters.categoryId}
              onCategoryChange={(id) => setFilters({ categoryId: id })}
              sortBy={filters.sortBy}
              onSortChange={(s) => setFilters({ sortBy: s })}
              search={filters.search}
              onSearchChange={(q) => setFilters({ search: q })}
            />
          </View>
          {/* Recent Expenses Header */}
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
          </View>
        </>
      )}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={groups}
      keyExtractor={(item) => item[0]}
      renderItem={({ item: [dateKey, list] }) => (
        <View style={styles.group}>
          {list.map((e) => (
            <ExpenseItem
              key={e.id}
              expense={e}
              category={categories.find((c) => c.id === e.categoryId)}
            />
          ))}
        </View>
      )}
      ListHeaderComponent={renderHeader()}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color={colors.textLight} />
          <Text style={styles.emptyTitle}>No expenses yet</Text>
          <Text style={styles.emptySubtitle}>
            Start tracking your expenses to see them here
          </Text>
        </View>
      }
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  totalsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  chartsToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    fontWeight: "700",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleText: {
    ...typography.caption,
    color: colors.textMuted,
    fontFamily: "Inter_600SemiBold",
  },
  chartsSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  filtersSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  breakdownSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  breakdownContainer: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadow.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  breakdownRow: {
    marginBottom: spacing.md,
  },
  breakdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  breakdownLabel: {
    ...typography.bodyMedium,
    color: colors.text,
    fontFamily: "Inter_600SemiBold",
  },
  breakdownAmount: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontFamily: "Inter_700Bold",
  },
  breakdownBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  breakdownBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radii.full,
    overflow: "hidden",
  },
  breakdownBarFill: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
  },
  breakdownPercentage: {
    ...typography.caption,
    color: colors.textMuted,
    fontFamily: "Inter_500Medium",
    minWidth: 40,
    textAlign: "right",
  },
  listSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  group: {
    marginBottom: spacing.md,
  },
  groupHeader: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    ...shadow.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: spacing.md,
  },
});
