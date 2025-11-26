import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

interface MedicalButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'emergency' | 'outline';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

interface VariantStyle {
  gradient: readonly [string, string, ...string[]];
  textColor: string;
  shadowColor: string;
  borderWidth?: number;
  borderColor?: string;
}

export const MedicalButton: React.FC<MedicalButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getVariantStyles = (): VariantStyle => {
    switch (variant) {
      case 'secondary':
        return {
          gradient: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] as const,
          textColor: colors.primary,
          shadowColor: 'transparent',
        };
      case 'emergency':
        return {
          gradient: [colors.error, '#DC2626'] as const,
          textColor: '#FFFFFF',
          shadowColor: colors.error,
        };
      case 'outline':
        return {
          gradient: ['transparent', 'transparent'] as const,
          textColor: colors.primary,
          shadowColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'primary':
      default:
        return {
          gradient: [colors.primary, colors.secondary] as const,
          textColor: '#FFFFFF',
          shadowColor: colors.primary,
        };
    }
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        fontSize: typography.caption.size,
      },
      medium: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        fontSize: typography.body.size,
      },
      large: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        fontSize: typography.h3.size,
      },
    };

    return sizes[size];
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <Animated.View style={[animatedStyle, { width: fullWidth ? '100%' : 'auto' }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          {
            borderRadius: borderRadius.lg,
            overflow: 'hidden',
            shadowColor: variantStyles.shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: disabled ? 0 : 0.3,
            shadowRadius: 8,
            elevation: disabled ? 0 : 6,
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        <LinearGradient
          colors={variantStyles.gradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            borderWidth: variantStyles.borderWidth || 0,
            borderColor: variantStyles.borderColor,
          }}
        >
          {loading ? (
            <ActivityIndicator color={variantStyles.textColor} size="small" />
          ) : (
            <>
              {icon && (
                <Text style={{
                  fontSize: sizeStyles.fontSize,
                  color: variantStyles.textColor,
                  marginRight: spacing.sm,
                }}>
                  {icon}
                </Text>
              )}
              <Text
                style={{
                  fontSize: sizeStyles.fontSize,
                  fontWeight: '600',
                  color: variantStyles.textColor,
                  textAlign: 'center',
                }}
              >
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};