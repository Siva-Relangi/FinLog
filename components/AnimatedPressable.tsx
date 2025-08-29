import React, { useRef } from 'react'
import { Animated, Pressable, ViewStyle } from 'react-native'

type Props = {
  children: React.ReactNode
  onPress?: () => void
  style?: ViewStyle | ViewStyle[]
}

export function AnimatedPressable({ children, onPress, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current
  return (
    <Pressable
      onPressIn={() => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }]}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  )
}