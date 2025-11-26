import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, shadows } from '../utils/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const GlassCard: React.FC<GlassCardProps> = React.memo(({
  children,
  style,
  variant = 'default'
}) => {
  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'elevated':
        return {
          ...shadows.xl,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        };
      case 'outlined':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
        };
      default:
        return {
          ...shadows.lg,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        };
    }
  }, [variant]);

  return (
    <View
      style={[
        {
          borderRadius: borderRadius.xl,
          borderWidth: 1,
          borderColor: colors.glass.border,
          overflow: 'hidden',
        },
        variantStyles,
        style,
      ]}
    >
      {children}
    </View>
  );
});