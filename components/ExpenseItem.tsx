import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, radii, shadow, spacing, typography } from '../theme/theme'
import type { Category, Expense } from '../types'
import CategoryIcon from './CategoryIcon'

export default function ExpenseItem({ 
  expense, 
  category,
  onPress,
}: { 
  expense: Expense; 
  category?: Category;
  onPress?: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(8)).current
  const scale = useRef(new Animated.Value(0.98)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start()
  }, [])

  const ItemComponent = onPress ? TouchableOpacity : Animated.View

  return (
    <ItemComponent 
      style={[
        styles.container, 
        { 
          opacity, 
          transform: [{ translateY }, { scale }] 
        }
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        <CategoryIcon name={category?.iconName} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>
          {expense.note || category?.name || 'Expense'}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{category?.name || '—'}</Text>
          <Text style={styles.date}>
            {new Date(expense.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
        {onPress && (
          <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
        )}
      </View>
    </ItemComponent>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  iconContainer: {
    marginRight: spacing.md,
  },
  
  content: {
    flex: 1,
  },
  
  title: {
    ...typography.bodyMedium,
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: spacing.xs,
  },
  
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  
  category: {
    ...typography.caption,
    color: colors.textMuted,
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  
  date: {
    ...typography.caption,
    color: colors.textLight,
  },
  
  amountContainer: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  
  amount: {
    ...typography.h4,
    color: colors.text,
    fontFamily: 'Inter_700Bold',
  },
})