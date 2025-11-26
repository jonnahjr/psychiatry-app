import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

interface SkeletonCardProps {
  style?: any;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ style }) => (
  <View style={[styles.card, style]}>
    <View style={styles.cardHeader}>
      <SkeletonLoader width={60} height={60} borderRadius={30} />
      <View style={styles.cardHeaderText}>
        <SkeletonLoader width={120} height={20} style={{ marginBottom: 8 }} />
        <SkeletonLoader width={80} height={16} />
      </View>
    </View>
    <SkeletonLoader width="100%" height={16} style={{ marginTop: 16 }} />
    <SkeletonLoader width="80%" height={16} style={{ marginTop: 8 }} />
    <SkeletonLoader width={100} height={32} borderRadius={16} style={{ marginTop: 16 }} />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e5e7eb',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 16,
  },
});