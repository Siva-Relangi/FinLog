import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme/theme'

export default function CategoryIcon({ name, size = 20 }: { name?: string; size?: number }) {
  return (
    <View style={styles.circle}>
      <Ionicons name={(name as any) || 'pricetag-outline'} size={size} color={colors.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6f6fd',
  },
})