import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#667eea',
  text,
  fullScreen = false,
}) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const containerStyle = fullScreen
    ? styles.fullScreenContainer
    : styles.container;

  return (
    <View style={containerStyle}>
      <Animated.View style={animatedStyle}>
        <ActivityIndicator
          size={size}
          color={color}
          style={styles.spinner}
        />
      </Animated.View>
      {text && (
        <Text style={[styles.text, { color }]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  spinner: {
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});