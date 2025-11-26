import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import Animated, {
  FadeIn,
  FadeInUp,
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LoginFormData {
  identifier: string;
  password: string;
}

interface ValidationErrors {
  identifier?: string;
  password?: string;
}

const PatientLoginScreen: React.FC = () => {
  // Form state with better structure
  const [formData, setFormData] = useState<LoginFormData>({
    identifier: 'john.doe@email.com',
    password: 'patient123'
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Refs for performance
  const passwordRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const { login } = useAuth();
  const navigation = useNavigation();

  // Animation values for better UX
  const buttonScale = useSharedValue(1);
  const logoScale = useSharedValue(1);

  // Memoized validation
  const validationRules = useMemo(() => ({
    identifier: (value: string) => {
      if (!value.trim()) return 'Email or phone is required';
      if (value.includes('@') && !/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
      return '';
    },
    password: (value: string) => {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return '';
    }
  }), []);

  // Keyboard listeners for better UX
  useFocusEffect(
    useCallback(() => {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        setIsKeyboardVisible(true);
      });
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setIsKeyboardVisible(false);
      });

      return () => {
        keyboardDidShowListener?.remove();
        keyboardDidHideListener?.remove();
      };
    }, [])
  );

  // Optimized form handlers
  const updateFormField = useCallback((field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.entries(validationRules).forEach(([field, validator]) => {
      const error = validator(formData[field as keyof LoginFormData]);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validationRules]);

  // Optimized login handler with better error handling
  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      // Animate button to indicate validation error
      buttonScale.value = withSpring(0.95, {}, () => {
        buttonScale.value = withSpring(1);
      });
      return;
    }

    setIsLoading(true);
    buttonScale.value = withSpring(0.98);

    try {
      console.log('🔐 Attempting login with:', { identifier: formData.identifier, password: '***' });
      await login(formData.identifier, formData.password);
      console.log('✅ Login successful, navigation should happen automatically');

      // Force immediate navigation to main tabs to avoid transient UI state
      try {
        (navigation as any).reset?.({ index: 0, routes: [{ name: 'MainTabs' }] });
      } catch (navErr) {
        console.warn('Navigation reset failed (falling back to state-driven):', navErr);
      }

      // Success animation
      logoScale.value = withSpring(1.1, {}, () => {
        logoScale.value = withSpring(1);
      });

    } catch (error: any) {
      console.error('❌ Login failed:', error);

      // Error animation
      buttonScale.value = withSpring(1.02, {}, () => {
        buttonScale.value = withSpring(1);
      });

      // Better error messages
      let errorMessage = 'Login failed. Please try again.';
      if (error.message?.includes('Network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('401') || error.message?.includes('Invalid')) {
        errorMessage = 'Invalid credentials. Please check your email/phone and password.';
      }

      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
      buttonScale.value = withSpring(1);
    }
  }, [formData, login, validateForm, buttonScale, logoScale]);

  const handleRegister = useCallback(() => {
    navigation.navigate('Register' as never);
  }, [navigation]);

  const handleDemoLogin = useCallback(() => {
    setFormData({
      identifier: 'john.doe@email.com',
      password: 'patient123'
    });
    setErrors({});
  }, []);

  // Animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  // Memoized content height for better performance
  const contentHeight = useMemo(() => {
    return isKeyboardVisible ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT;
  }, [isKeyboardVisible]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={["#667eea","#764ba2"]} style={styles.header} />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.content, { minHeight: contentHeight }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={BounceIn.delay(100).duration(800)} style={styles.branding}>
          <Animated.View entering={FadeIn.delay(300).duration(600)} style={[styles.logoWrap, logoAnimatedStyle]}>
            <Image source={require('../../assets/D11.png')} style={styles.logo} />
          </Animated.View>
          <Animated.Text entering={FadeIn.delay(500).duration(600)} style={styles.title}>Welcome Back</Animated.Text>
          <Animated.Text entering={FadeIn.delay(600).duration(600)} style={styles.subtitle}>Sign in to your account</Animated.Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(700).duration(800)} style={styles.card}>
          <Animated.Text entering={FadeIn.delay(900)} style={styles.label}>Email or Phone</Animated.Text>
          <Animated.View entering={FadeIn.delay(1000).duration(500)} style={styles.rowInput}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>👤</Text>
            </View>
            <TextInput
              style={[styles.input, errors.identifier && styles.inputError]}
              placeholder="Enter email or phone"
              placeholderTextColor="#9ca3af"
              value={formData.identifier}
              onChangeText={(value) => updateFormField('identifier', value)}
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />
          </Animated.View>
          {errors.identifier && (
            <Text style={styles.errorText}>{errors.identifier}</Text>
          )}

          <Animated.Text entering={FadeIn.delay(1100)} style={[styles.label,{marginTop:12}]}>Password</Animated.Text>
          <Animated.View entering={FadeIn.delay(1200).duration(500)} style={styles.rowInput}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>🔒</Text>
            </View>
            <TextInput
              ref={passwordRef}
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Enter password"
              placeholderTextColor="#9ca3af"
              value={formData.password}
              onChangeText={(value) => updateFormField('password', value)}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </Animated.View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <Animated.View entering={BounceIn.delay(1300).duration(600)} style={buttonAnimatedStyle}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.primaryGradient, isLoading && styles.buttonDisabled]}
            >
              <TouchableOpacity
                style={styles.primary}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(1500).duration(500)} style={styles.demoContainer}>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleDemoLogin}
              activeOpacity={0.7}
            >
              <Text style={styles.demoText}>Use Demo Account</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(1400)} style={styles.rowCenter}>
            <Text style={styles.muted}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.link}> Sign Up</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { position: 'absolute', left: 0, right: 0, top: 0, height: 280, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  content: { paddingTop: 100, paddingHorizontal: 24, paddingBottom: 40 },
  branding: { alignItems: 'center', marginBottom: 30 },
  logoWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)'
  },
  logo: { width: 70, height: 70, resizeMode: 'contain' },
  title: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginTop: 16, textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 8, fontWeight: '500' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.1)'
  },
  label: { fontSize: 14, color: '#374151', marginBottom: 8, fontWeight: '700', letterSpacing: 0.5 },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.1)',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  input: { marginLeft: 12, flex: 1, fontSize: 16, color: '#1f2937', fontWeight: '500' },
  iconContainer: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 8 },
  iconText: { fontSize: 20, color: '#6366f1' },
  primaryGradient: {
    marginTop: 24,
    borderRadius: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  primary: {
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%'
  },
  buttonDisabled: { opacity: 0.7, transform: [{scale: 0.98}] },
  primaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2
  },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  muted: { color: '#6b7280', fontSize: 14 },
  link: { color: '#667eea', fontWeight: '700', fontSize: 14, textDecorationLine: 'underline' },
  demoContainer: { marginTop: 16, alignItems: 'center' },
  demoButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  demoText: { color: '#6b7280', fontSize: 14, fontWeight: '600' },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default PatientLoginScreen;
