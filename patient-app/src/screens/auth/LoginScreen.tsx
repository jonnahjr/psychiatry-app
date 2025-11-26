import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AuthStackParamList = {
  Login: undefined;
  PatientLogin: undefined;
  DoctorLogin: undefined;
  Register: undefined;
};

import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const RoleSelectionScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const patientScale = useSharedValue(1);
  const patientGlow = useSharedValue(0);
  const doctorScale = useSharedValue(1);
  const doctorGlow = useSharedValue(0);

  const navigateTo = (route: keyof AuthStackParamList) => {
    navigation.navigate(route);
  };

  const handlePatientSelect = () => {
    patientScale.value = withSpring(0.95, {}, () => {
      patientScale.value = withSpring(1);
      runOnJS(navigateTo)('PatientLogin');
    });
  };

  const handleDoctorSelect = () => {
    doctorScale.value = withSpring(0.95, {}, () => {
      doctorScale.value = withSpring(1);
      runOnJS(navigateTo)('DoctorLogin');
    });
  };

  const handlePatientPressIn = () => {
    patientGlow.value = withTiming(1);
  };

  const handlePatientPressOut = () => {
    patientGlow.value = withTiming(0);
  };

  const handleDoctorPressIn = () => {
    doctorGlow.value = withTiming(1);
  };

  const handleDoctorPressOut = () => {
    doctorGlow.value = withTiming(0);
  };

  const patientAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: patientScale.value }],
    shadowOpacity: patientGlow.value * 0.3,
    shadowRadius: patientGlow.value * 20,
  }));

  const doctorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: doctorScale.value }],
    shadowOpacity: doctorGlow.value * 0.3,
    shadowRadius: doctorGlow.value * 20,
  }));

  return (
    <LinearGradient
      colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Header */}
      <Animated.View entering={FadeIn.delay(300)} style={styles.header}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(248,250,252,0.8)']}
            style={styles.logoCircle}
          >
            <Image source={require('../../assets/D11.png')} style={styles.logoImage} />
          </LinearGradient>
        </View>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appName}>Telepsychiatry</Text>
        <Text style={styles.tagline}>Your Health, Our Priority</Text>
      </Animated.View>

      {/* Role Selection */}
      <View style={styles.selectionContainer}>
        <Animated.Text
          entering={FadeInUp.delay(600)}
          style={styles.selectionTitle}
        >
          Choose your role to continue
        </Animated.Text>

        <View style={styles.buttonContainer}>
          <Animated.View
            entering={SlideInLeft.delay(800)}
            style={patientAnimatedStyle}
          >
            <TouchableOpacity
              style={styles.roleButton}
              onPress={handlePatientSelect}
              onPressIn={handlePatientPressIn}
              onPressOut={handlePatientPressOut}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#10b981', '#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <View style={styles.buttonContent}>
                  <View style={styles.iconContainer}>
                      <FontAwesome5 name="user-injured" size={22} color="#ffffff" />
                  </View>
                  <Text style={styles.buttonTitle}>Patient</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={SlideInRight.delay(1000)}
            style={doctorAnimatedStyle}
          >
            <TouchableOpacity
              style={styles.roleButton}
              onPress={handleDoctorSelect}
              onPressIn={handleDoctorPressIn}
              onPressOut={handleDoctorPressOut}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#6366f1', '#4f46e5', '#3730a3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <View style={styles.buttonContent}>
                  <View style={styles.iconContainer}>
                      <FontAwesome5 name="user-md" size={22} color="#ffffff" />
                  </View>
                  <Text style={styles.buttonTitle}>Doctor</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Footer */}
      <Animated.View entering={FadeInUp.delay(1200)} style={styles.footer}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.footerGradient}
        >
          <Text style={styles.footerText}>
            🔒 Secure • 🔒 Private • 🏥 HIPAA Compliant
          </Text>
        </LinearGradient>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: height * 0.1,
    left: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    top: height * 0.4,
    right: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: height * 0.2,
    left: width * 0.2,
  },
  header: {
    position: 'absolute',
    top: height * 0.08,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 40,
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  selectionContainer: {
    position: 'absolute',
    top: '50%',
    left: 24,
    right: 24,
    transform: [{ translateY: -50 }],
    alignItems: 'center',
  },
  selectionTitle: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  roleButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonGradient: {
    padding: 16,
    borderRadius: 12,
    width: 160,
  },
  buttonContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  roleIcon: {
    fontSize: 24,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  buttonSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  buttonArrow: {
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 1,
  },
  footerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default RoleSelectionScreen;
