// theme/theme.ts
export const colors = {
  // Primary colors
  primary: '#6366f1', // Modern indigo
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  
  // Background colors
  bg: '#fafafa',
  bgSecondary: '#ffffff',
  card: '#ffffff',
  cardHover: '#f8fafc',
  
  // Text colors
  text: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  
  // Accent colors
  accent: '#10b981', // Green
  accentLight: '#34d399',
  warning: '#f59e0b', // Amber
  error: '#ef4444', // Red
  
  // Neutral colors
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  divider: '#f8fafc',
  
  // Status colors
  success: '#22c55e',
  info: '#3b82f6',
}

export const gradients = {
  primary: ['#6366f1', '#8b5cf6'],
  accent: ['#10b981', '#059669'],
  card: ['#ffffff', '#f8fafc'],
}

export const radii = { 
  xs: 4, 
  sm: 8, 
  md: 12, 
  lg: 16, 
  xl: 20,
  full: 9999
}

export const spacing = { 
  xs: 4, 
  sm: 8, 
  md: 16, 
  lg: 24, 
  xl: 32,
  xxl: 48
}

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
}

export const typography = {
  h1: { fontSize: 32, fontFamily: 'Inter_700Bold' },
  h2: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  h3: { fontSize: 20, fontFamily: 'Inter_600SemiBold' },
  h4: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  body: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  bodyMedium: { fontSize: 16, fontFamily: 'Inter_500Medium' },
  bodySmall: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  caption: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  button: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
}