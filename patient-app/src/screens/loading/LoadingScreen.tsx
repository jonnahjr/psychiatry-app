import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';

type RootStackParamList = {
  Landing: undefined;
};

const { width, height } = Dimensions.get('window');

const LoadingScreen = ({navigation}: {navigation: NativeStackNavigationProp<RootStackParamList>}) => {
  const { user, isLoading: authLoading } = useAuth();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const progressAnim = new Animated.Value(0);
  const rotateAnim = new Animated.Value(0);
  const [loadingText, setLoadingText] = useState('Initializing secure connection');
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();

    // Rotating animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Cycle loading messages
    const messages = [
      'Initializing secure connection',
      'Loading medical records',
      'Setting up encryption',
      'Preparing your dashboard',
    ];
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingText(messages[messageIndex] || 'Loading');
    }, 600);

    // Animate dots
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots('.'.repeat(dotCount));
    }, 300);

    // Navigate based on auth state after loading
    const timer = setTimeout(() => {
      if (!authLoading) {
        if (user) {
          console.log('✅ LoadingScreen: User is logged in, navigating to MainTabs');
          navigation.navigate('MainTabs' as never);
        } else {
          console.log('✅ LoadingScreen: No user, navigating to Landing');
          navigation.navigate('Landing');
        }
      } else {
        console.log('⏳ LoadingScreen: Auth still loading, waiting...');
        // If still loading, navigate to Landing as fallback
        navigation.navigate('Landing');
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(messageInterval);
      clearInterval(dotInterval);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Container */}
        <Animated.View style={[styles.logoContainer, { transform: [{ rotate }] }]}>
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.logoCircle}
          >
            <Image source={require('../../assets/D11.png')} style={styles.logoImage} />
          </LinearGradient>
        </Animated.View>

        {/* App Name */}
        <Text style={styles.appName}>Tele-Psychiatry</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Your Health, Our Priority</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
        </View>

        {/* Loading Text */}
        <Text style={styles.loadingText}>{loadingText}{dots}</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 50,
    letterSpacing: 0.5,
  },
  progressContainer: {
    width: width * 0.7,
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
    marginTop: 10,
  },
});

export default LoadingScreen;

