import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing } from '../theme/theme'
import { Ionicons } from '@expo/vector-icons'

export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="document-text-outline" size={28} color={colors.muted} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.lg, gap: 6 },
  title: { color: colors.muted, fontFamily: 'Inter_600SemiBold' },
  subtitle: { color: colors.muted, fontFamily: 'Inter_500Medium', textAlign: 'center' },
})