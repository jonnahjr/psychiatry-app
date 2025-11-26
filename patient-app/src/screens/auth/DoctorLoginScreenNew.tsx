import React, { useState } from 'react';
import Animated, {
  FadeIn,
  FadeInUp,
  BounceIn,
} from 'react-native-reanimated';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const DoctorLoginScreenNew: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[k:string]:string}>({});
  const { login } = useAuth();
  const navigation = useNavigation();

  const validate = () => {
    const e: {[k:string]:string} = {};
    if (!email.trim()) e.email = 'Email is required';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      Alert.alert('Validation', 'Please fix the form errors');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      Alert.alert('Login failed', err?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const demo = () => {
    setEmail('dr.smith@telepsychiatry.com');
    setPassword('doctor123');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={["#667eea","#764ba2"]} style={styles.header} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Animated.View entering={BounceIn.delay(100).duration(800)} style={styles.branding}>
          <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.logoWrap}>
            <Image source={require('../../assets/D11.png')} style={styles.logo} />
          </Animated.View>
          <Animated.Text entering={FadeIn.delay(500).duration(600)} style={styles.title}>Doctor Portal</Animated.Text>
          <Animated.Text entering={FadeIn.delay(600).duration(600)} style={styles.subtitle}>Access your dashboard securely</Animated.Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(700).duration(800)} style={styles.card}>
          <Animated.View entering={FadeIn.delay(900)} style={styles.infoRow}>
            <Icon name="security" size={24} color="#667eea" />
            <Text style={styles.infoText}>Verified access for licensed clinicians</Text>
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(1000)} style={styles.label}>Email</Animated.Text>
          <Animated.View entering={FadeIn.delay(1100).duration(500)} style={styles.rowInput}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>📧</Text>
            </View>
            <TextInput style={styles.input} value={email} onChangeText={(v) => {setEmail(v); if (errors.email) setErrors(prev => ({...prev, email: ''}));}} placeholder="you@hospital.org" keyboardType="email-address" autoCapitalize="none" />
          </Animated.View>
          {errors.email && <Animated.Text entering={FadeIn} style={styles.error}>{errors.email}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(1200)} style={[styles.label,{marginTop:12}]}>Password</Animated.Text>
          <Animated.View entering={FadeIn.delay(1300).duration(500)} style={styles.rowInput}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>🔒</Text>
            </View>
            <TextInput style={styles.input} value={password} onChangeText={(v) => {setPassword(v); if (errors.password) setErrors(prev => ({...prev, password: ''}));}} secureTextEntry placeholder="Password" />
          </Animated.View>
          {errors.password && <Animated.Text entering={FadeIn} style={styles.error}>{errors.password}</Animated.Text>}

          <Animated.View entering={BounceIn.delay(1400).duration(600)}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.primaryGradient, loading && styles.buttonDisabled]}
            >
              <TouchableOpacity
                style={styles.primary}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Sign In</Text>}
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(1500)}>
            <TouchableOpacity style={styles.ghost} onPress={demo}>
              <Icon name="play-circle-filled" size={20} color="#667eea" />
              <Text style={styles.ghostText}>Try demo account</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(1600)}>
            <TouchableOpacity style={styles.forgot}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(1700)}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={18} color="#6b7280" />
            <Text style={styles.backText}>Back to role selection</Text>
          </TouchableOpacity>
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
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#f0f9ff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(102,126,234,0.2)' },
  infoText: { marginLeft: 12, color: '#0369a1', fontWeight: '600', fontSize: 14 },
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
  iconContainer: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(79, 172, 254, 0.1)', borderRadius: 8 },
  iconText: { fontSize: 20, color: '#4facfe' },
  error: { color: '#dc2626', marginTop: 4, marginBottom: 6, fontSize: 12, fontWeight: '500' },
  primaryGradient: {
    marginTop: 20,
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
  ghost: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f9ff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(102,126,234,0.2)' },
  ghostText: { marginLeft: 8, color: '#0369a1', fontWeight: '600', fontSize: 14 },
  forgot: { marginTop: 16, alignItems: 'center' },
  forgotText: { color: '#667eea', fontWeight: '700', fontSize: 14, textDecorationLine: 'underline' },
  back: { marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(102,126,234,0.1)' },
  backText: { marginLeft: 8, color: '#6b7280', fontWeight: '600' },
});

export default DoctorLoginScreenNew;
