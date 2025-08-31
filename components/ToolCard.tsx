import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, radii, shadow, spacing, typography } from '../theme/theme'

const { width: screenWidth } = Dimensions.get('window')

export default function TotalsCard({
  label,
  amount,
  icon,
  onPress,
}: {
  label: string
  amount: number
  icon: keyof typeof Ionicons.glyphMap
  onPress?: () => void
}) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(30)).current
  const scale = useRef(new Animated.Value(0.9)).current
  const rotate = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start()
  }, [])

  const CardComponent = onPress ? TouchableOpacity : Animated.View

  // Create rotation animation for icon
  const iconRotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  // Create scale animation for icon container
  const iconScale = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  })

  return (
    <CardComponent 
      style={[
        styles.card, 
        { 
          opacity, 
          transform: [{ translateY }, { scale }] 
        }
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
    >
      {/* Background gradient overlay */}
      <View style={styles.gradientOverlay} />
      
      {/* Icon container with enhanced styling */}
      <Animated.View 
        style={[
          styles.iconContainer,
          {
            transform: [{ rotate: iconRotation }, { scale: iconScale }]
          }
        ]}
      >
        <View style={styles.iconBackground}>
          <Ionicons name={icon} size={28} color={colors.bgSecondary} />
        </View>
        <View style={styles.iconGlow} />
      </Animated.View>
      
      {/* Content section */}
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.amount}>${amount.toFixed(2)}</Text>
        
        {/* Trend indicator */}
        <View style={styles.trendContainer}>
          <View style={styles.trendDot} />
          <Text style={styles.trendText}>Active</Text>
        </View>
      </View>
      
      {/* Interactive arrow */}
      {onPress && (
        <Animated.View 
          style={[
            styles.arrowContainer,
            {
              opacity: rotate.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              })
            }
          ]}
        >
          <View style={styles.arrowBackground}>
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </View>
        </Animated.View>
      )}
      
      {/* Decorative elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
    </CardComponent>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.md,
    ...shadow.lg,
    borderWidth: 1,
    borderColor: colors.primary + '15',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 120,
  },
  
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary + '05',
    borderRadius: radii.xl,
  },
  
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.md,
  },
  
  iconGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    zIndex: -1,
  },
  
  content: {
    flex: 1,
  },
  
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Inter_600SemiBold',
  },
  
  amount: {
    ...typography.h4,
    color: colors.text,
    fontWeight: '900',
    marginBottom: spacing.sm,
    textShadowColor: colors.primary + '20',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  trendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  
  trendText: {
    ...typography.caption,
    color: colors.accent,
    fontFamily: 'Inter_600SemiBold',
  },
  
  arrowContainer: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    marginTop: -20,
  },
  
  arrowBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  
  decorativeCircle1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '08',
    top: -20,
    right: -20,
    zIndex: -1,
  },
  
  decorativeCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent + '10',
    bottom: -15,
    left: -15,
    zIndex: -1,
  },
})