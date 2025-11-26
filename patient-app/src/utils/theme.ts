// TeleMind Design System - Comprehensive Theme System
export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  // Primary Medical Palette
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;

  // Background Colors
  background: string;
  surface: string;
  surfaceSecondary: string;
  card: string;
  modal: string;

  // Text Colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Border Colors
  border: string;
  borderLight: string;
  borderDark: string;

  // Interactive States
  hover: string;
  focus: string;
  active: string;
  disabled: string;

  // Glassmorphism
  glass: {
    background: string;
    border: string;
    shadow: string;
  };

  // Shadows
  shadow: {
    light: string;
    medium: string;
    heavy: string;
  };
}

export const lightTheme: ThemeColors = {
  // Primary Medical Palette
  primary: '#0EA5E9',      // Ocean Blue - Trust & Calm
  secondary: '#8B5CF6',    // Purple - Innovation & Care
  accent: '#06B6D4',       // Cyan - Technology & Health
  success: '#10B981',      // Emerald - Wellness & Growth
  warning: '#F59E0B',       // Amber - Attention & Care
  error: '#EF4444',         // Red - Emergency & Alert

  // Background Colors
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceSecondary: '#F1F5F9',
  card: '#FFFFFF',
  modal: '#FFFFFF',

  // Text Colors
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  textInverse: '#FFFFFF',

  // Border Colors
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',

  // Interactive States
  hover: '#F8FAFC',
  focus: '#E0F2FE',
  active: '#BAE6FD',
  disabled: '#F1F5F9',

  // Glassmorphism
  glass: {
    background: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(255, 255, 255, 0.9)',
    shadow: 'rgba(0, 0, 0, 0.05)',
  },

  // Shadows
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    heavy: 'rgba(0, 0, 0, 0.15)',
  },
};

export const darkTheme: ThemeColors = {
  // Primary Medical Palette (slightly brighter for dark mode)
  primary: '#38BDF8',      // Brighter Ocean Blue
  secondary: '#A78BFA',    // Brighter Purple
  accent: '#22D3EE',       // Brighter Cyan
  success: '#34D399',      // Brighter Emerald
  warning: '#FBBF24',       // Brighter Amber
  error: '#F87171',         // Brighter Red

  // Background Colors
  background: '#0F172A',
  surface: '#1E293B',
  surfaceSecondary: '#334155',
  card: '#1E293B',
  modal: '#1E293B',

  // Text Colors
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textInverse: '#0F172A',

  // Border Colors
  border: '#334155',
  borderLight: '#475569',
  borderDark: '#1E293B',

  // Interactive States
  hover: '#334155',
  focus: '#1E40AF',
  active: '#1D4ED8',
  disabled: '#374151',

  // Glassmorphism
  glass: {
    background: 'rgba(30, 41, 59, 0.8)',
    border: 'rgba(51, 65, 85, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },

  // Shadows
  shadow: {
    light: 'rgba(0, 0, 0, 0.2)',
    medium: 'rgba(0, 0, 0, 0.4)',
    heavy: 'rgba(0, 0, 0, 0.6)',
  },
};

// Legacy colors for backward compatibility
export const colors = {
  ...lightTheme,
  // Keep gray scale for backward compatibility
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