import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing } from '../theme/theme'

export default function AppHeader() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>SpendWise</Text>
      <Text style={styles.subtitle}>Track. Understand. Improve.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  title: { fontFamily: 'Inter_700Bold', fontSize: 22, color: colors.text },
  subtitle: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.muted, marginTop: 4 },
})