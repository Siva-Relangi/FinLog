import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import AppHeader from "../components/AppHeader";
import ExpenseItem from "../components/ExpenseItem";
import FiltersBar from "../components/FilterBar";
import TotalsCard from "../components/ToolCard";
import { useData } from "../context/DataContext";
import { colors, spacing } from "../theme/theme";

import { Dimensions } from "react-native";
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
  const { expenses, categories, filters, setFilters } = useData();

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

  return (
    <View style={styles.container}>
      <AppHeader />

      {/* Totals */}
      <View style={styles.totalsRow}>
        <TotalsCard label="Today" amount={totals.today} icon="sunny-outline" />
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

      {/* Filters */}
      <View style={{ marginTop: spacing.md }}>
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

      {/* Breakdown */}
      <View style={styles.breakdown}>
        <Text style={styles.sectionTitle}>This Month by Category</Text>
        {breakdown.items.length === 0 ? (
          <Text style={styles.emptyText}>
            No data yet. Add your first expense to get insights.
          </Text>
        ) : (
          breakdown.items.map((it) => (
            <View key={it.categoryId} style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>{it.name}</Text>
              <View style={styles.breakdownBarBg}>
                <View
                  style={[
                    styles.breakdownBarFill,
                    { width: `${Math.min(100, it.pct)}%` },
                  ]}
                />
              </View>
              <Text style={styles.breakdownAmt}>
                ${it.amount.toFixed(0)} ({it.pct.toFixed(0)}%)
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Grouped List */}
      <FlatList
        style={{ marginTop: spacing.md }}
        data={groups}
        keyExtractor={([dateKey]) => dateKey}
        renderItem={({ item: [dateKey, list] }) => (
          <View style={styles.group}>
            <Text style={styles.groupHeader}>
              {formatHeaderDate(list[0].date)}
            </Text>
            {list.map((e) => (
              <ExpenseItem
                key={e.id}
                expense={e}
                category={categories.find((c) => c.id === e.categoryId)}
              />
            ))}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No expenses yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.bg },
  totalsRow: { flexDirection: "row", gap: 8 },
  breakdown: { marginTop: 16 },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: colors.text,
    marginBottom: 8,
  },
  breakdownRow: { marginBottom: 10 },
  breakdownLabel: {
    color: colors.text,
    marginBottom: 6,
    fontFamily: "Inter_600SemiBold",
  },
  breakdownBarBg: { height: 8, backgroundColor: "#e2e8f0", borderRadius: 999 },
  breakdownBarFill: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  breakdownAmt: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  group: { marginTop: 12 },
  groupHeader: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 6,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    color: colors.muted,
    marginTop: 8,
    fontFamily: "Inter_500Medium",
  },
});
