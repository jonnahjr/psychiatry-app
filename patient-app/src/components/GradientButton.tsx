import React from 'react';
import { Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  colors?: string[];
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  colors = ['#667eea', '#764ba2'],
  style,
  textStyle,
  icon,
  disabled = false,
  loading = false,
  size = 'medium',
}) => {
  const scale = useSharedValue(1);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 28 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24 };
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (!disabled && !loading) {
        scale.value = withSpring(0.95);
      }
    })
    .onEnd(() => {
      if (!disabled && !loading) {
        scale.value = withSpring(1, {}, () => {
          scale.value = withSpring(1.02, {}, () => {
            scale.value = withSpring(1);
          });
        });
        runOnJS(onPress)();
      }
    });

  const buttonContent = (
    <Animated.View style={[styles.button, getSizeStyles(), animatedStyle, style]}>
      <LinearGradient
        colors={(disabled ? ['#9ca3af', '#6b7280'] : colors) as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[
          styles.text,
          size === 'small' ? styles.smallText : size === 'large' ? styles.largeText : styles.mediumText,
          textStyle,
          disabled && styles.disabledText
        ]}>
          {loading ? 'Loading...' : title}
        </Text>
      </LinearGradient>
    </Animated.View>
  );

  if (disabled || loading) {
    return buttonContent;
  }

  return (
    <GestureDetector gesture={tapGesture}>
      {buttonContent}
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: '#d1d5db',
  },
});