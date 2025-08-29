import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { colors, radii, spacing, shadow } from '../theme/theme'
import { Ionicons } from '@expo/vector-icons'

export default function TotalsCard({
  label,
  amount,
  icon,
}: {
  label: string
  amount: number
  icon: keyof typeof Ionicons.glyphMap
}) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(10)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <Animated.View style={[styles.card, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>${amount.toFixed(2)}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    ...shadow.card,
  },
  iconWrap: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#e6f6fd', marginBottom: spacing.sm,
  },
  label: { color: colors.muted, fontSize: 12, marginBottom: 4, fontFamily: 'Inter_500Medium' },
  amount: { color: colors.text, fontSize: 18, fontFamily: 'Inter_700Bold' },
})