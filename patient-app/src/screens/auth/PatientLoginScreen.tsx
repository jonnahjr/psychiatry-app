// Re-export the cleaned implementation so all imports continue to work.
export { default } from './PatientLoginScreenNew';
// Re-export the cleaned implementation so all imports continue to work.
export { default } from './PatientLoginScreenNew';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={['#eef2ff', '#ffffff']}
        style={styles.topBackground}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.branding}>
          <View style={styles.logoWrapper}>
            <Image source={require('../../assets/D11.png')} style={styles.logoImage} />
          </View>
          <Text style={styles.headline}>Welcome back</Text>
          <Text style={styles.lead}>Sign in to continue to your care</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Patient ID or Email</Text>
          <View style={styles.inputRow}>
            <Feather name="user" size={18} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. P000001 or you@example.com"
              placeholderTextColor="#9ca3af"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
          </View>

          <Text style={[styles.label, { marginTop: 18 }]}>Password</Text>
          <View style={styles.inputRow}>
            <Feather name="lock" size={18} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Your password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.rowCenter}>
            <Text style={styles.muted}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}> 
              <Text style={styles.link}> Create one</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.ghostButton} onPress={fillDemoCredentials}>
            <Icon name="play-circle-filled" size={18} color="#4f46e5" style={{ marginRight: 8 }} />
            <Text style={styles.ghostText}>Try demo account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={16} color="#6b7280" />
          <Text style={styles.backText}>Back to role selection</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerButtonText}>Don't have an account? <Text style={styles.registerLink}>Sign Up</Text></Text>
          </TouchableOpacity>

          <View style={styles.demoContainer}>
            <TouchableOpacity style={styles.demoButton} onPress={fillDemoCredentials}>
              <Icon name="play-circle-filled" size={20} color="#6366f1" style={styles.demoIcon} />
              <Text style={styles.demoButtonText}>Try Demo Account</Text>
            </TouchableOpacity>
            <Text style={styles.demoText}>ID: P000001 | Password: patient123</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#1e293b',
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
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
    color: '#f1f5f9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
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
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#475569',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#f1f5f9',
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  registerButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  registerButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  registerLink: {
    color: '#6366f1',
    fontWeight: '600',
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

export default PatientLoginScreen;
