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
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const LandingScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb', '#f5576c']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/D11.png')} style={styles.headerLogo} />
          </View>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.appName}>Tele-Psychiatry</Text>
          <Text style={styles.subtitle}>Your Health, Our Priority</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.imagePlaceholder}>
            <Image source={require('../../assets/D11.png')} style={styles.logo} />
          </View>

          <Text style={styles.description}>
            Connect with healthcare professionals through secure video consultations,
            manage your health records, and access quality mental health care from anywhere.
          </Text>

          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔒 Secure • 🔒 Private • 🌐 Accessible
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
   container: {
     flex: 1,
   },
   overlay: {
     flex: 1,
     backgroundColor: 'rgba(255, 255, 255, 0.1)',
   },
  header: {
    alignItems: 'center',
    paddingTop: height * 0.1,
    paddingBottom: 40,
    backgroundColor: '#6366f1',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  headerLogo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    color: '#e0e7ff',
    fontWeight: '500',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e7ff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  getStartedButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
});

export default LandingScreen;