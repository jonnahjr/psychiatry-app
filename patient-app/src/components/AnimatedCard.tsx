import React from 'react';
import { View, StyleSheet } from 'react-native';

// Safe imports with fallbacks
let Animated: any = null;
let useAnimatedStyle: any = null;
let useSharedValue: any = null;
let withSpring: any = null;
let withTiming: any = null;
let runOnJS: any = null;

let Gesture: any = null;
let GestureDetector: any = null;

try {
  const reanimated = require('react-native-reanimated');
  Animated = reanimated.default || reanimated.Animated;
  useAnimatedStyle = reanimated.useAnimatedStyle;
  useSharedValue = reanimated.useSharedValue;
  withSpring = reanimated.withSpring;
  withTiming = reanimated.withTiming;
  runOnJS = reanimated.runOnJS;
} catch (error) {
  console.warn('react-native-reanimated not available, using static components');
}

try {
  const gestureHandler = require('react-native-gesture-handler');
  Gesture = gestureHandler.Gesture;
  GestureDetector = gestureHandler.GestureDetector;
} catch (error) {
  console.warn('react-native-gesture-handler not available, using basic touchables');
}

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
  scaleOnPress?: boolean;
  bounceOnPress?: boolean;
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  onPress,
  scaleOnPress = true,
  bounceOnPress = false,
  delay = 0,
}) => {
  // Fallback implementation if animation libraries are not available
  if (!Animated || !useAnimatedStyle || !useSharedValue) {
    console.warn('AnimatedCard: Animation libraries not available, using static fallback');
    return (
      <View style={[styles.card, styles.staticCard, style]} onTouchEnd={onPress}>
        {children}
      </View>
    );
  }

  try {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    React.useEffect(() => {
      try {
        // Entrance animation
        opacity.value = withTiming(1, { duration: 300 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      } catch (animationError) {
        console.warn('AnimatedCard: Animation setup failed:', animationError);
      }
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      try {
        return {
          opacity: opacity.value,
          transform: [
            { scale: scale.value },
            { translateY: translateY.value },
          ],
        };
      } catch (styleError) {
        console.warn('AnimatedCard: Style calculation failed:', styleError);
        return {};
      }
    });

    let gestureComponent = null;
    if (Gesture && GestureDetector && onPress) {
      try {
        const tapGesture = Gesture.Tap()
          .onStart(() => {
            if (scaleOnPress) {
              scale.value = withSpring(0.95);
            }
          })
          .onEnd(() => {
            if (scaleOnPress) {
              scale.value = withSpring(1, {}, () => {
                if (bounceOnPress) {
                  scale.value = withSpring(1.02, {}, () => {
                    scale.value = withSpring(1);
                  });
                }
              });
            }
            if (onPress && runOnJS) {
              runOnJS(onPress)();
            }
          });

        gestureComponent = (
          <GestureDetector gesture={tapGesture}>
            <Animated.View style={[styles.card, animatedStyle, style]}>
              {children}
            </Animated.View>
          </GestureDetector>
        );
      } catch (gestureError) {
        console.warn('AnimatedCard: Gesture setup failed:', gestureError);
      }
    }

    return gestureComponent || (
      <Animated.View style={[styles.card, animatedStyle, style]} onTouchEnd={onPress}>
        {children}
      </Animated.View>
    );

  } catch (error) {
    console.error('AnimatedCard: Complete animation setup failed:', error);
    return (
      <View style={[styles.card, styles.staticCard, style]} onTouchEnd={onPress}>
        {children}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  staticCard: {
    opacity: 1,
    transform: [{ scale: 1 }, { translateY: 0 }],
  },
});