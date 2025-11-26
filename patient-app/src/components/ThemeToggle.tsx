import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  style?: ViewStyle;
  size?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  style,
  size = 24,
}) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const handlePress = () => {
    // Animate rotation
    rotation.value = withTiming(rotation.value + 180, { duration: 300 });

    // Animate scale
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });

    // Toggle theme
    runOnJS(toggleTheme)();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View style={animatedStyle}>
        <MaterialIcons
          name={isDarkMode ? 'light-mode' : 'dark-mode'}
          size={size}
          color={theme.text}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});