import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import type { Expense, Category } from '../types'
import { colors, spacing } from '../theme/theme'
import CategoryIcon from './CategoryIcon'

export default function ExpenseItem({ expense, category }: { expense: Expense; category?: Category }) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(6)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <Animated.View style={[styles.row, { opacity, transform: [{ translateY }] }]}>
      <CategoryIcon name={category?.iconName} />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={styles.title}>{expense.note || category?.name || 'Expense'}</Text>
        <Text style={styles.meta}>{category?.name || '—'}</Text>
      </View>
      <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0',
  },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.text },
  meta: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.muted, marginTop: 2 },
  amount: { fontFamily: 'Inter_700Bold', fontSize: 16, color: colors.text },
})