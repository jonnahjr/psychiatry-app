// Re-export the cleaned Register implementation so imports remain valid
export { default } from './RegisterScreenNew';
import Animated, { FadeIn, FadeInUp, BounceIn } from 'react-native-reanimated';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    phone: '',
    gender: '',
    location: '',
    patientId: '',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',

    // Medical Information
    bloodType: '',
    allergies: '',
    currentMedications: '',
    medicalConditions: '',
    // Re-export the cleaned Register implementation so imports remain valid
    export { default } from './RegisterScreenNew';
            </View>
            <View style={s.sectionText}>
              <Text style={s.sectionTitle}>Emergency Contact</Text>
              <Text style={s.sectionSubtitle}>Someone we can reach in case of emergency</Text>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(2600)} style={s.label}>Emergency Contact Name *</Animated.Text>
          <Animated.View entering={FadeIn.delay(2700).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="user" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.emergencyContactName} onChangeText={(v) => update('emergencyContactName', v)} placeholder="John Doe" />
          </Animated.View>
          {errors.emergencyContactName && <Animated.Text entering={FadeIn} style={s.error}>{errors.emergencyContactName}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(2800)} style={[s.label,{marginTop:12}]}>Emergency Contact Phone *</Animated.Text>
          <Animated.View entering={FadeIn.delay(2900).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="phone" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.emergencyContactPhone} onChangeText={(v) => update('emergencyContactPhone', v)} placeholder="+1 555 555 5555" keyboardType="phone-pad" />
          </Animated.View>
          {errors.emergencyContactPhone && <Animated.Text entering={FadeIn} style={s.error}>{errors.emergencyContactPhone}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(3000)} style={[s.label,{marginTop:12}]}>Relationship *</Animated.Text>
          <Animated.View entering={FadeIn.delay(3100).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="heart" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.emergencyContactRelationship} onChangeText={(v) => update('emergencyContactRelationship', v)} placeholder="Spouse/Parent/Sibling/Friend" />
          </Animated.View>
          {errors.emergencyContactRelationship && <Animated.Text entering={FadeIn} style={s.error}>{errors.emergencyContactRelationship}</Animated.Text>}

          {/* Medical Information Section */}
          <Animated.View entering={FadeIn.delay(3200)} style={[s.sectionHeader, {marginTop: 24}]}> 
            <View style={s.sectionIcon}>
              <MaterialIcons name="favorite" size={24} color="#fff" />
            </View>
            <View style={s.sectionText}>
              <Text style={s.sectionTitle}>Health Information</Text>
              <Text style={s.sectionSubtitle}>Help us understand your health needs</Text>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(3300)} style={s.label}>Blood Type *</Animated.Text>
          <Animated.View entering={FadeIn.delay(3400).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="tint" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.bloodType} onChangeText={(v) => update('bloodType', v)} placeholder="A+/A-/B+/B-/AB+/AB-/O+/O-" />
          </Animated.View>
          {errors.bloodType && <Animated.Text entering={FadeIn} style={s.error}>{errors.bloodType}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(3500)} style={[s.label,{marginTop:12}]}>Any allergies we should know about?</Animated.Text>
          <Animated.View entering={FadeIn.delay(3600).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="exclamation-triangle" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.allergies} onChangeText={(v) => update('allergies', v)} placeholder="Medications, foods, etc. (leave blank if none)" />
          </Animated.View>
          <Animated.Text entering={FadeIn.delay(3650)} style={s.hintText}>This helps us keep you safe during your care</Animated.Text>

          <Animated.Text entering={FadeIn.delay(3700)} style={[s.label,{marginTop:12}]}>Current Medications</Animated.Text>
          <Animated.View entering={FadeIn.delay(3800).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="pills" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.currentMedications} onChangeText={(v) => update('currentMedications', v)} placeholder="List current medications" />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(3900)} style={[s.label,{marginTop:12}]}>Medical Conditions</Animated.Text>
          <Animated.View entering={FadeIn.delay(4000).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="heartbeat" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.medicalConditions} onChangeText={(v) => update('medicalConditions', v)} placeholder="Diabetes, Hypertension, etc." />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(4100)} style={[s.label,{marginTop:12}]}>Preferred Language *</Animated.Text>
          <Animated.View entering={FadeIn.delay(4200).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="language" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.preferredLanguage} onChangeText={(v) => update('preferredLanguage', v)} placeholder="English, Spanish, etc." />
          </Animated.View>
          {errors.preferredLanguage && <Animated.Text entering={FadeIn} style={s.error}>{errors.preferredLanguage}</Animated.Text>}

          {/* Insurance Information Section */}
          <Animated.View entering={FadeIn.delay(4300)} style={[s.sectionHeader, {marginTop: 24}]}> 
            <View style={s.sectionIcon}>
              <MaterialIcons name="security" size={24} color="#fff" />
            </View>
            <View style={s.sectionText}>
              <Text style={s.sectionTitle}>Insurance Details</Text>
              <Text style={s.sectionSubtitle}>Your coverage information (optional)</Text>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(4400)} style={s.label}>Insurance Provider</Animated.Text>
          <Animated.View entering={FadeIn.delay(4500).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="shield-alt" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.insuranceProvider} onChangeText={(v) => update('insuranceProvider', v)} placeholder="Blue Cross, Aetna, etc." />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(4600)} style={[s.label,{marginTop:12}]}>Policy Number</Animated.Text>
          <Animated.View entering={FadeIn.delay(4700).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="file-alt" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.insurancePolicyNumber} onChangeText={(v) => update('insurancePolicyNumber', v)} placeholder="Policy number" />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(4800)} style={[s.label,{marginTop:12}]}>Group Number</Animated.Text>
          <Animated.View entering={FadeIn.delay(4900).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="users" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.insuranceGroupNumber} onChangeText={(v) => update('insuranceGroupNumber', v)} placeholder="Group number" />
          </Animated.View>

          {/* Additional Information Section */}
          <Animated.View entering={FadeIn.delay(5000)} style={[s.sectionHeader, {marginTop: 24}]}> 
            <View style={s.sectionIcon}>
              <MaterialIcons name="info" size={24} color="#fff" />
            </View>
            <View style={s.sectionText}>
              <Text style={s.sectionTitle}>A Bit More About You</Text>
              <Text style={s.sectionSubtitle}>Help us provide the best care possible</Text>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(5100)} style={s.label}>Occupation</Animated.Text>
          <Animated.View entering={FadeIn.delay(5200).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="briefcase" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.occupation} onChangeText={(v) => update('occupation', v)} placeholder="Teacher, Engineer, etc." />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(5300)} style={[s.label,{marginTop:12}]}>Marital Status</Animated.Text>
          <Animated.View entering={FadeIn.delay(5400).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="heart" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.maritalStatus} onChangeText={(v) => update('maritalStatus', v)} placeholder="Single/Married/Divorced" />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(5500)} style={[s.label,{marginTop:12}]}>Reason for Visit</Animated.Text>
          <Animated.View entering={FadeIn.delay(5600).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="clipboard-list" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.appointmentReason} onChangeText={(v) => update('appointmentReason', v)} placeholder="Consultation, Check-up, etc." />
          </Animated.View>

          <Animated.View entering={BounceIn.delay(1900).duration(600)}>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[s.primaryGradient, loading && s.buttonDisabled]}
            >
              <TouchableOpacity
                style={s.primary}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryText}>Begin My Care Journey</Text>}
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(5700)} style={s.finalMessage}>
            <FontAwesome5 name="heart" size={20} color="#667eea" />
            <Text style={s.finalMessageText}>Remember, you're taking an important step for your well-being. We're here to support you every step of the way.</Text>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(2000)} style={s.rowCenter}>
            <Text style={s.muted}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={s.link}> Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { position: 'absolute', left: 0, right: 0, top: 0, height: 280, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  content: { paddingTop: 100, paddingHorizontal: 24, paddingBottom: 100 },
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
    padding: 32,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.1)',
    marginBottom: 20
  },
  progressContainer: { marginBottom: 24, alignItems: 'center' },
  progressText: { fontSize: 16, color: '#667eea', fontWeight: '700', marginBottom: 8 },
  progressBar: { width: '100%', height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#667eea', borderRadius: 3 },
  encouragementText: { fontSize: 14, color: '#6b7280', fontStyle: 'italic', marginTop: 8, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, padding: 16, backgroundColor: '#f0f9ff', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(102,126,234,0.2)' },
  sectionIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#667eea', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  sectionText: { flex: 1 },
  sectionTitle: { fontSize: 18, color: '#667eea', fontWeight: '800', letterSpacing: 0.5 },
  sectionSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4, fontWeight: '500' },
  label: { fontSize: 14, color: '#374151', marginBottom: 8, fontWeight: '700', letterSpacing: 0.5 },
  hintText: { fontSize: 12, color: '#6b7280', fontStyle: 'italic', marginTop: 4, marginBottom: 8 },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.1)',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1
  },
  input: { marginLeft: 12, flex: 1, fontSize: 16, color: '#1f2937', fontWeight: '500' },
  error: { color: '#2563eb', marginTop: 4, marginBottom: 6, fontSize: 12, fontWeight: '500' },
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
  buttonDisabled: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  primaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  finalMessage: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', padding: 16, borderRadius: 12, marginTop: 20, borderWidth: 1, borderColor: 'rgba(102,126,234,0.2)' },
  finalMessageText: { marginLeft: 12, color: '#0369a1', fontSize: 14, fontWeight: '500', fontStyle: 'italic' },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  muted: { color: '#6b7280', fontSize: 14 },
  link: { color: '#667eea', fontWeight: '700', fontSize: 14, textDecorationLine: 'underline' },
});

export default RegisterScreen;
import React, { useState, useEffect } from 'react';
import Animated, { FadeIn, FadeInUp, BounceIn } from 'react-native-reanimated';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    phone: '',
    gender: '',
    location: '',
    patientId: '',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',

    // Medical Information
    bloodType: '',
    allergies: '',
    currentMedications: '',
    medicalConditions: '',
    preferredLanguage: '',

    // Insurance Information
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceGroupNumber: '',

    // Additional Information
    occupation: '',
    maritalStatus: '',
    appointmentReason: '',
  });
  const [currentSection, setCurrentSection] = useState(0);
  const sections = ['Personal', 'Emergency', 'Medical', 'Insurance', 'Additional'];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const { register } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const patientId = `PT-${year}-${randomNum}`;
    setFormData((prev) => ({ ...prev, patientId }));
  }, []);

  const validate = () => {
    const e: { [k: string]: string } = {};
    // Basic Information
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Valid email required';
    if (!formData.password || formData.password.length < 6) e.password = 'Password must be 6+ chars';
    if (!formData.phone.trim()) e.phone = 'Phone required';
    if (!formData.dateOfBirth.trim()) e.dateOfBirth = 'Date of birth is required';
    if (!formData.gender.trim()) e.gender = 'Gender is required';

    // Emergency Contact
    if (!formData.emergencyContactName.trim()) e.emergencyContactName = 'Emergency contact name required';
    if (!formData.emergencyContactPhone.trim()) e.emergencyContactPhone = 'Emergency contact phone required';
    if (!formData.emergencyContactRelationship.trim()) e.emergencyContactRelationship = 'Relationship is required';

    // Medical Information
    if (!formData.bloodType.trim()) e.bloodType = 'Blood type is required';
    if (!formData.preferredLanguage.trim()) e.preferredLanguage = 'Preferred language is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) {
      Alert.alert('Validation', 'Please fix the form errors');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        patientId: formData.patientId,
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.location || undefined,
        gender: formData.gender || undefined,
        emergencyContactName: formData.emergencyContactName || undefined,
        emergencyContactPhone: formData.emergencyContactPhone || undefined,
        emergencyContactRelationship: formData.emergencyContactRelationship || undefined,
        bloodType: formData.bloodType || undefined,
        allergies: formData.allergies || undefined,
        currentMedications: formData.currentMedications || undefined,
        medicalConditions: formData.medicalConditions || undefined,
        preferredLanguage: formData.preferredLanguage || undefined,
        insuranceProvider: formData.insuranceProvider || undefined,
        insurancePolicyNumber: formData.insurancePolicyNumber || undefined,
        insuranceGroupNumber: formData.insuranceGroupNumber || undefined,
        occupation: formData.occupation || undefined,
        maritalStatus: formData.maritalStatus || undefined,
        appointmentReason: formData.appointmentReason || undefined,
      } as any);
    } catch (err: any) {
      Alert.alert('Registration failed', err?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if ((errors as any)[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={s.header} />
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeIn.duration(800)} style={s.branding}>
          <Animated.View entering={FadeIn.delay(200).duration(600)} style={s.logoWrap}>
            <Image source={require('../../assets/D11.png')} style={s.logo} />
          </Animated.View>
          <Animated.Text entering={FadeIn.delay(400).duration(600)} style={s.title}>Welcome to Your Care Journey</Animated.Text>
          <Animated.Text entering={FadeIn.delay(500).duration(600)} style={s.subtitle}>Let's set up your account together - we're here to help</Animated.Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(700).duration(800)} style={s.card}>
          {/* Progress Indicator */}
          <Animated.View entering={FadeIn.duration(600)} style={s.progressContainer}>
            <Text style={s.progressText}>Step {currentSection + 1} of {sections.length}</Text>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: `${((currentSection + 1) / sections.length) * 100}%` }]} />
            </View>
            <Text style={s.encouragementText}>You're doing great! Take your time.</Text>
          </Animated.View>

          {/* Personal Information Section */}
          <Animated.View entering={FadeIn.delay(200).duration(600)} style={s.sectionHeader}>
            <View style={s.sectionIcon}>
              <MaterialIcons name="person" size={24} color="#667eea" />
            </View>
            <View style={s.sectionText}>
              <Text style={s.sectionTitle}>Tell us about yourself</Text>
              <Text style={s.sectionSubtitle}>This helps us personalize your care experience</Text>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(900)} style={s.label}>What's your full name? *</Animated.Text>
          <View style={s.rowInput}>
            <FontAwesome5 name="user" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.name} onChangeText={(v) => update('name', v)} placeholder="Enter your full name" />
          </View>
          <Animated.Text entering={FadeIn} style={s.hintText}>This helps us address you properly</Animated.Text>
          {errors.name && <Animated.Text entering={FadeIn} style={s.error}>{errors.name}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(1100)} style={[s.label,{marginTop:12}]}>Email *</Animated.Text>
          <Animated.View entering={FadeIn.delay(1200).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="envelope" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.email} onChangeText={(v) => update('email', v)} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" />
          </Animated.View>
          {errors.email && <Animated.Text entering={FadeIn} style={s.error}>{errors.email}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(1300)} style={[s.label,{marginTop:12}]}>Password *</Animated.Text>
          <Animated.View entering={FadeIn.delay(1400).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="lock" size={16} color="#667eea" />
            <TextInput style={s.input} secureTextEntry value={formData.password} onChangeText={(v) => update('password', v)} placeholder="Choose a password" />
          </Animated.View>
          {errors.password && <Animated.Text entering={FadeIn} style={s.error}>{errors.password}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(1500)} style={[s.label,{marginTop:12}]}>Phone *</Animated.Text>
          <Animated.View entering={FadeIn.delay(1600).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="phone" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.phone} onChangeText={(v) => update('phone', v)} placeholder="+1 555 555 5555" keyboardType="phone-pad" />
          </Animated.View>
          {errors.phone && <Animated.Text entering={FadeIn} style={s.error}>{errors.phone}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(1700)} style={[s.label,{marginTop:12}]}>Date of Birth *</Animated.Text>
          <Animated.View entering={FadeIn.delay(1800).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="calendar-alt" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.dateOfBirth} onChangeText={(v) => update('dateOfBirth', v)} placeholder="MM/DD/YYYY" />
          </Animated.View>
          {errors.dateOfBirth && <Animated.Text entering={FadeIn} style={s.error}>{errors.dateOfBirth}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(1900)} style={[s.label,{marginTop:12}]}>Gender *</Animated.Text>
          <Animated.View entering={FadeIn.delay(2000).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="venus-mars" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.gender} onChangeText={(v) => update('gender', v)} placeholder="Male/Female/Other" />
          </Animated.View>
          {errors.gender && <Animated.Text entering={FadeIn} style={s.error}>{errors.gender}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(2100)} style={[s.label,{marginTop:12}]}>Address</Animated.Text>
          <Animated.View entering={FadeIn.delay(2200).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="map-marker-alt" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.location} onChangeText={(v) => update('location', v)} placeholder="City, State, ZIP" />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(2300)} style={[s.label,{marginTop:12}]}>Patient ID</Animated.Text>
          <Animated.View entering={FadeIn.delay(2400).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="id-card" size={16} color="#667eea" />
            <TextInput style={[s.input, {color: '#64748b'}]} value={formData.patientId} editable={false} placeholder="Auto-generated" />
          </Animated.View>

          {/* Emergency Contact Section */}
          <Animated.View entering={FadeIn.delay(2500)} style={[s.sectionHeader, {marginTop: 24}]}> 
            <View style={s.sectionIcon}>
              <MaterialIcons name="phone" size={24} color="#fff" />
            </View>
            <View style={s.sectionText}>
              <Text style={s.sectionTitle}>Emergency Contact</Text>
              <Text style={s.sectionSubtitle}>Someone we can reach in case of emergency</Text>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(2600)} style={s.label}>Emergency Contact Name *</Animated.Text>
          <Animated.View entering={FadeIn.delay(2700).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="user" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.emergencyContactName} onChangeText={(v) => update('emergencyContactName', v)} placeholder="John Doe" />
          </Animated.View>
          {errors.emergencyContactName && <Animated.Text entering={FadeIn} style={s.error}>{errors.emergencyContactName}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(2800)} style={[s.label,{marginTop:12}]}>Emergency Contact Phone *</Animated.Text>
          <Animated.View entering={FadeIn.delay(2900).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="phone" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.emergencyContactPhone} onChangeText={(v) => update('emergencyContactPhone', v)} placeholder="+1 555 555 5555" keyboardType="phone-pad" />
          </Animated.View>
          {errors.emergencyContactPhone && <Animated.Text entering={FadeIn} style={s.error}>{errors.emergencyContactPhone}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(3000)} style={[s.label,{marginTop:12}]}>Relationship *</Animated.Text>
          <Animated.View entering={FadeIn.delay(3100).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="heart" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.emergencyContactRelationship} onChangeText={(v) => update('emergencyContactRelationship', v)} placeholder="Spouse/Parent/Sibling/Friend" />
          </Animated.View>
          {errors.emergencyContactRelationship && <Animated.Text entering={FadeIn} style={s.error}>{errors.emergencyContactRelationship}</Animated.Text>}

          {/* Medical Information Section */}
          <Animated.View entering={FadeIn.delay(3200)} style={[s.sectionHeader, {marginTop: 24}]}> 
            <View style={s.sectionIcon}>
              <MaterialIcons name="favorite" size={24} color="#fff" />
            </View>
            <View style={s.sectionText}>
              <Text style={s.sectionTitle}>Health Information</Text>
              <Text style={s.sectionSubtitle}>Help us understand your health needs</Text>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(3300)} style={s.label}>Blood Type *</Animated.Text>
          <Animated.View entering={FadeIn.delay(3400).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="tint" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.bloodType} onChangeText={(v) => update('bloodType', v)} placeholder="A+/A-/B+/B-/AB+/AB-/O+/O-" />
          </Animated.View>
          {errors.bloodType && <Animated.Text entering={FadeIn} style={s.error}>{errors.bloodType}</Animated.Text>}

          <Animated.Text entering={FadeIn.delay(3500)} style={[s.label,{marginTop:12}]}>Any allergies we should know about?</Animated.Text>
          <Animated.View entering={FadeIn.delay(3600).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="exclamation-triangle" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.allergies} onChangeText={(v) => update('allergies', v)} placeholder="Medications, foods, etc. (leave blank if none)" />
          </Animated.View>
          <Animated.Text entering={FadeIn.delay(3650)} style={s.hintText}>This helps us keep you safe during your care</Animated.Text>

          <Animated.Text entering={FadeIn.delay(3700)} style={[s.label,{marginTop:12}]}>Current Medications</Animated.Text>
          <Animated.View entering={FadeIn.delay(3800).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="pills" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.currentMedications} onChangeText={(v) => update('currentMedications', v)} placeholder="List current medications" />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(3900)} style={[s.label,{marginTop:12}]}>Medical Conditions</Animated.Text>
          <Animated.View entering={FadeIn.delay(4000).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="heartbeat" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.medicalConditions} onChangeText={(v) => update('medicalConditions', v)} placeholder="Diabetes, Hypertension, etc." />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(4100)} style={[s.label,{marginTop:12}]}>Preferred Language *</Animated.Text>
          <Animated.View entering={FadeIn.delay(4200).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="language" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.preferredLanguage} onChangeText={(v) => update('preferredLanguage', v)} placeholder="English, Spanish, etc." />
          </Animated.View>
          {errors.preferredLanguage && <Animated.Text entering={FadeIn} style={s.error}>{errors.preferredLanguage}</Animated.Text>}

          {/* Insurance Information Section */}
          <Animated.View entering={FadeIn.delay(4300)} style={[s.sectionHeader, {marginTop: 24}]}> 
            <View style={s.sectionIcon}>
              <MaterialIcons name="security" size={24} color="#fff" />
            </View>
            <View style={s.sectionText}>
              <Text style={s.sectionTitle}>Insurance Details</Text>
              <Text style={s.sectionSubtitle}>Your coverage information (optional)</Text>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(4400)} style={s.label}>Insurance Provider</Animated.Text>
          <Animated.View entering={FadeIn.delay(4500).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="shield-alt" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.insuranceProvider} onChangeText={(v) => update('insuranceProvider', v)} placeholder="Blue Cross, Aetna, etc." />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(4600)} style={[s.label,{marginTop:12}]}>Policy Number</Animated.Text>
          <Animated.View entering={FadeIn.delay(4700).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="file-alt" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.insurancePolicyNumber} onChangeText={(v) => update('insurancePolicyNumber', v)} placeholder="Policy number" />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(4800)} style={[s.label,{marginTop:12}]}>Group Number</Animated.Text>
          <Animated.View entering={FadeIn.delay(4900).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="users" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.insuranceGroupNumber} onChangeText={(v) => update('insuranceGroupNumber', v)} placeholder="Group number" />
          </Animated.View>

          {/* Additional Information Section */}
          <Animated.View entering={FadeIn.delay(5000)} style={[s.sectionHeader, {marginTop: 24}]}> 
            <View style={s.sectionIcon}>
              <MaterialIcons name="info" size={24} color="#fff" />
            </View>
            <View style={s.sectionText}>
              <Text style={s.sectionTitle}>A Bit More About You</Text>
              <Text style={s.sectionSubtitle}>Help us provide the best care possible</Text>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(5100)} style={s.label}>Occupation</Animated.Text>
          <Animated.View entering={FadeIn.delay(5200).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="briefcase" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.occupation} onChangeText={(v) => update('occupation', v)} placeholder="Teacher, Engineer, etc." />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(5300)} style={[s.label,{marginTop:12}]}>Marital Status</Animated.Text>
          <Animated.View entering={FadeIn.delay(5400).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="heart" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.maritalStatus} onChangeText={(v) => update('maritalStatus', v)} placeholder="Single/Married/Divorced" />
          </Animated.View>

          <Animated.Text entering={FadeIn.delay(5500)} style={[s.label,{marginTop:12}]}>Reason for Visit</Animated.Text>
          <Animated.View entering={FadeIn.delay(5600).duration(500)} style={s.rowInput}>
            <FontAwesome5 name="clipboard-list" size={16} color="#667eea" />
            <TextInput style={s.input} value={formData.appointmentReason} onChangeText={(v) => update('appointmentReason', v)} placeholder="Consultation, Check-up, etc." />
          </Animated.View>

          <Animated.View entering={BounceIn.delay(1900).duration(600)}>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[s.primaryGradient, loading && s.buttonDisabled]}
            >
              <TouchableOpacity
                style={s.primary}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryText}>Begin My Care Journey</Text>}
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(5700)} style={s.finalMessage}>
            <FontAwesome5 name="heart" size={20} color="#667eea" />
            <Text style={s.finalMessageText}>Remember, you're taking an important step for your well-being. We're here to support you every step of the way.</Text>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(2000)} style={s.rowCenter}>
            <Text style={s.muted}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={s.link}> Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { position: 'absolute', left: 0, right: 0, top: 0, height: 280, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  content: { paddingTop: 100, paddingHorizontal: 24, paddingBottom: 100 },
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
    padding: 32,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.1)',
    marginBottom: 20
  },
  progressContainer: { marginBottom: 24, alignItems: 'center' },
  progressText: { fontSize: 16, color: '#667eea', fontWeight: '700', marginBottom: 8 },
  progressBar: { width: '100%', height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#667eea', borderRadius: 3 },
  encouragementText: { fontSize: 14, color: '#6b7280', fontStyle: 'italic', marginTop: 8, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, padding: 16, backgroundColor: '#f0f9ff', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(102,126,234,0.2)' },
  sectionIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#667eea', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  sectionText: { flex: 1 },
  sectionTitle: { fontSize: 18, color: '#667eea', fontWeight: '800', letterSpacing: 0.5 },
  sectionSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4, fontWeight: '500' },
  label: { fontSize: 14, color: '#374151', marginBottom: 8, fontWeight: '700', letterSpacing: 0.5 },
  hintText: { fontSize: 12, color: '#6b7280', fontStyle: 'italic', marginTop: 4, marginBottom: 8 },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.1)',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1
  },
  input: { marginLeft: 12, flex: 1, fontSize: 16, color: '#1f2937', fontWeight: '500' },
  error: { color: '#2563eb', marginTop: 4, marginBottom: 6, fontSize: 12, fontWeight: '500' },
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
  buttonDisabled: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  primaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  finalMessage: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', padding: 16, borderRadius: 12, marginTop: 20, borderWidth: 1, borderColor: 'rgba(102,126,234,0.2)' },
  finalMessageText: { marginLeft: 12, color: '#0369a1', fontSize: 14, fontWeight: '500', fontStyle: 'italic' },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  muted: { color: '#6b7280', fontSize: 14 },
  link: { color: '#667eea', fontWeight: '700', fontSize: 14, textDecorationLine: 'underline' },
});

export default RegisterScreen;
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
  },
  formCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#ecfdf5',
    paddingBottom: 5,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingHorizontal: 15,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 15,
  },
  multilineInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  eyeIcon: {
    padding: 5,
  },
  row: {
    flexDirection: 'row',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default RegisterScreen;
