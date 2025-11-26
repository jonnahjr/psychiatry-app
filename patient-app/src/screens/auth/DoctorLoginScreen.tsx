import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  // add routes if needed
};
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

const DoctorLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('dr.smith@telepsychiatry.com');
    setPassword('doctor123');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image source={require('../../assets/D11.png')} style={styles.logoImage} />
          </View>
        </View>
        <Text style={styles.title}>Doctor Portal</Text>
        <Text style={styles.subtitle}>Secure access to your medical dashboard</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.infoBox}>
            <Icon name="security" size={24} color="#6366f1" />
            <Text style={styles.infoTitle}>Verified Access Only</Text>
            <Text style={styles.infoText}>
              Doctor accounts are managed by administrators. Use your official credentials to access patient records and consultations.
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#6366f1" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={['#6366f1', '#4f46e5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <Feather name="log-in" size={20} color="#ffffff" style={styles.buttonIcon} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.demoContainer}>
            <TouchableOpacity style={styles.demoButton} onPress={fillDemoCredentials}>
              <Icon name="play-circle-filled" size={20} color="#6366f1" style={styles.demoIcon} />
              <Text style={styles.demoButtonText}>Try Demo Account</Text>
            </TouchableOpacity>
            <Text style={styles.demoText}>Email: dr.smith@telepsychiatry.com</Text>
            <Text style={styles.demoText}>Password: doctor123</Text>
          </View>
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Available Features</Text>
          <View style={styles.featureGrid}>
            <View style={styles.featureItem}>
              <Feather name="calendar" size={20} color="#6366f1" />
              <Text style={styles.featureText}>Appointments</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="video" size={20} color="#6366f1" />
              <Text style={styles.featureText}>Video Calls</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="file-text" size={20} color="#6366f1" />
              <Text style={styles.featureText}>Prescriptions</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="message-circle" size={20} color="#6366f1" />
              <Text style={styles.featureText}>Patient Chat</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="folder" size={20} color="#6366f1" />
              <Text style={styles.featureText}>Records</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="bar-chart" size={20} color="#6366f1" />
              <Text style={styles.featureText}>Reports</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={20} color="#6b7280" />
          <Text style={styles.backButtonText}>Back to Role Selection</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  demoContainer: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  demoIcon: {
    marginRight: 8,
  },
  demoButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
  demoText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 3,
  },
  featuresCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default DoctorLoginScreen;
