// TeleMind Design System
export const colors = {
  // Primary Medical Palette
  primary: '#0EA5E9',      // Ocean Blue - Trust & Calm
  secondary: '#8B5CF6',    // Purple - Innovation & Care
  accent: '#06B6D4',       // Cyan - Technology & Health
  success: '#10B981',      // Emerald - Wellness & Growth
  warning: '#F59E0B',       // Amber - Attention & Care
  error: '#EF4444',         // Red - Emergency & Alert

  // Neutral Scale
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Glassmorphism
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  // Dark Mode Variants
  dark: {
    primary: '#0EA5E9',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',

    background: '#0F172A',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    border: '#334155',
  }
};

export const typography = {
  display: { size: 32, weight: '700' as const, lineHeight: 40 },
  h1: { size: 28, weight: '600' as const, lineHeight: 36 },
  h2: { size: 24, weight: '600' as const, lineHeight: 32 },
  h3: { size: 20, weight: '600' as const, lineHeight: 28 },
  body: { size: 16, weight: '400' as const, lineHeight: 24 },
  caption: { size: 14, weight: '400' as const, lineHeight: 20 },
  small: { size: 12, weight: '400' as const, lineHeight: 16 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
};

export const gradients = {
  primary: ['#0EA5E9', '#8B5CF6'],
  secondary: ['#8B5CF6', '#06B6D4'],
  accent: ['#06B6D4', '#10B981'],
  success: ['#10B981', '#0EA5E9'],
  warning: ['#F59E0B', '#EF4444'],
  glass: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
};