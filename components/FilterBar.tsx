import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import type { Category } from '../types'
import { colors, radii, spacing } from '../theme/theme'
import { Ionicons } from '@expo/vector-icons'

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
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={categoryId || ''} onValueChange={(v) => onCategoryChange(v || undefined)}>
            <Picker.Item label="All Categories" value="" />
            {categories.map((c) => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
          </Picker>
        </View>
        <View style={styles.sortWrap}>
          <TouchableOpacity
            onPress={() => onSortChange('latest')}
            style={[styles.sortBtn, sortBy === 'latest' && styles.sortActive]}
          >
            <Ionicons name="time-outline" color={sortBy === 'latest' ? '#fff' : colors.text} size={16} />
            <Text style={[styles.sortText, sortBy === 'latest' && styles.sortTextActive]}>Latest</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSortChange('amount')}
            style={[styles.sortBtn, sortBy === 'amount' && styles.sortActive]}
          >
            <Ionicons name="cash-outline" color={sortBy === 'amount' ? '#fff' : colors.text} size={16} />
            <Text style={[styles.sortText, sortBy === 'amount' && styles.sortTextActive]}>Amount</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.muted} />
        <TextInput
          placeholder="Search by note"
          value={search}
          onChangeText={onSearchChange}
          style={styles.search}
          placeholderTextColor={colors.muted}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  pickerWrap: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, overflow: 'hidden' },
  sortWrap: { flexDirection: 'row', gap: spacing.sm },
  sortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderWidth: 1, borderColor: colors.border, borderRadius: radii.md,
  },
  sortActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sortText: { color: colors.text, fontFamily: 'Inter_600SemiBold' },
  sortTextActive: { color: '#fff' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: spacing.md,
  },
  search: { flex: 1, height: 44, color: colors.text, fontFamily: 'Inter_500Medium' },
})