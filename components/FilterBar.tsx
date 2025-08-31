import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import CategoryIcon from '../components/CategoryIcon'
import { colors, radii, shadow, spacing, typography } from '../theme/theme'
import type { Category } from '../types'

type Props = {
  categories: Category[]
  categoryId?: string
  onCategoryChange: (id?: string) => void
  sortBy: 'latest' | 'amount'
  onSortChange: (s: 'latest' | 'amount') => void
  search: string
  onSearchChange: (q: string) => void
}

export default function FiltersBar(props: Props) {
  const { categories, categoryId, onCategoryChange, sortBy, onSortChange, search, onSearchChange } = props

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchCard}>
        <View style={styles.searchInner}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search expenses by note..."
            value={search}
            onChangeText={onSearchChange}
            style={styles.searchInput}
            placeholderTextColor={colors.textLight}
            accessibilityLabel="Search expenses"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => onSearchChange('')}
              style={styles.clearButton}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters Section */}
      <View style={styles.filtersContainer}>
        {/* Category Filter */}
        <View style={styles.filterCard}>
          <Text style={styles.sectionLabel}>Category</Text>
          <FlatList
            style={styles.categoryGrid}
            data={[{ id: '', name: 'All', iconName: 'apps-outline' }, ...categories]}
            keyExtractor={(item) => item.id || 'all'}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onCategoryChange(item.id || undefined)}
                style={[
                  styles.categoryItem,
                  categoryId === item.id && styles.categoryItemActive,
                ]}
              >
                <CategoryIcon
                  name={item.iconName || 'pricetag-outline'}
                  variant="small"
                />
                <Text
                  style={[
                    styles.categoryName,
                    categoryId === item.id && styles.categoryNameActive,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Sort Options */}
        <View style={styles.filterCard}>
          <Text style={styles.sectionLabel}>Sort By</Text>
          <View style={styles.sortContainer}>
            <TouchableOpacity
              onPress={() => onSortChange('latest')}
              style={[
                styles.sortButton,
                sortBy === 'latest' && styles.sortButtonActive,
              ]}
              accessibilityLabel="Sort by latest"
            >
              <Ionicons
                name="time-outline"
                color={sortBy === 'latest' ? colors.bgSecondary : colors.textSecondary}
                size={18}
              />
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === 'latest' && styles.sortButtonTextActive,
                ]}
              >
                Latest
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onSortChange('amount')}
              style={[
                styles.sortButton,
                sortBy === 'amount' && styles.sortButtonActive,
              ]}
              accessibilityLabel="Sort by amount"
            >
              <Ionicons
                name="cash-outline"
                color={sortBy === 'amount' ? colors.bgSecondary : colors.textSecondary}
                size={18}
              />
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === 'amount' && styles.sortButtonTextActive,
                ]}
              >
                Amount
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.md,
    ...shadow.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    ...typography.caption,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },

  searchCard: {
    backgroundColor: colors.bg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
    ...typography.bodyMedium,
  },
  clearButton: {
    padding: spacing.xs,
  },

  filtersContainer: {
    gap: spacing.sm,
  },
  filterCard: {
    backgroundColor: colors.bg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    ...shadow.sm,
  },

  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },

  categoryGrid: {
    maxHeight: 150,
    padding: spacing.xs,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    margin: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  categoryItemActive: {
    backgroundColor: colors.textLight+'80',
    borderColor: colors.primary,
  },
  categoryName: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  categoryNameActive: {
    color: colors.bgSecondary,
  },

  sortContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.card,
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontFamily: 'Inter_600SemiBold',
  },
  sortButtonTextActive: {
    color: colors.bgSecondary,
  },
})