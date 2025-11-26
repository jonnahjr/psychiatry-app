import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const OnboardingTour: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const navigation = useNavigation();

  const screens = [
    {
      title: 'Welcome to TeleMind',
      subtitle: 'Your mental health companion',
      description: 'Connect with healthcare professionals through secure video consultations, manage your health records, and access quality mental health care from anywhere.',
      image: '🎉',
    },
    {
      title: 'Comprehensive Care',
      subtitle: 'Everything you need in one place',
      description: 'Book appointments, chat with doctors, track your mood, manage prescriptions, and access your complete medical history all in one secure platform.',
      image: '🩺',
    },
    {
      title: 'Get Started',
      subtitle: 'Ready to begin your journey',
      description: 'Your mental health matters. Take the first step towards better well-being with personalized care from licensed professionals.',
      image: '🚀',
    },
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    // Navigate to dashboard
    navigation.navigate('MainTabs' as never);
  };

  const renderScreen = () => {
    const screen = screens[currentScreen];

    return (
      <Animated.View
        key={currentScreen}
        entering={SlideInRight}
        style={styles.screen}
      >
        <View style={styles.imageContainer}>
          <Text style={styles.screenImage}>{screen?.image}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.screenTitle}>{screen?.title}</Text>
          <Text style={styles.screenSubtitle}>{screen?.subtitle}</Text>
          <Text style={styles.screenDescription}>{screen?.description}</Text>
        </View>

        <View style={styles.indicators}>
          {screens.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentScreen && styles.activeIndicator
              ]}
            />
          ))}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Main Content */}
      {renderScreen()}

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentScreen === screens.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    marginBottom: 48,
  },
  screenImage: {
    fontSize: 80,
  },
  content: {
    alignItems: 'center',
    marginBottom: 48,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  screenDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#3b82f6',
    width: 24,
  },
  bottomActions: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  nextButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingTour;