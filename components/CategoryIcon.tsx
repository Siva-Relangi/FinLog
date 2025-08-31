import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, shadow } from '../theme/theme';

export default function CategoryIcon({ 
  name, 
  size = 20,
  variant = 'default'
}: { 
  name?: string; 
  size?: number;
  variant?: 'default' | 'large' | 'small';
}) {
  const iconSize = variant === 'large' ? 24 : variant === 'small' ? 16 : 20;
  const containerSize = variant === 'large' ? 48 : variant === 'small' ? 28 : 36;
  
  return (
    <View style={[
      styles.container, 
      { 
        width: containerSize, 
        height: containerSize, 
        borderRadius: containerSize / 2 
      }
    ]}>
      <Ionicons 
        name={(name as any) || 'pricetag-outline'} 
        size={iconSize} 
        color={colors.primary} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '15',
    ...shadow.sm,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
})