import React, { useEffect } from 'react';
import {StatusBar, StyleSheet, LogBox, AppState, AppStateStatus, View, Text, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from './src/contexts/AuthContext';
import {ThemeProvider, useTheme} from './src/contexts/ThemeContext';
import {NotificationProvider} from './src/contexts/NotificationContext';

// Themed StatusBar Component
const ThemedStatusBar = () => {
  const { isDarkMode, theme } = useTheme();

  return (
    <StatusBar
      barStyle={isDarkMode ? "light-content" : "dark-content"}
      backgroundColor={theme.background}
      translucent={false}
    />
  );
};

// Global Error Boundary Component
class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error; errorInfo?: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🚨 GLOBAL ERROR BOUNDARY CAUGHT ERROR:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🚨 GLOBAL ERROR BOUNDARY DETAILS:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRestart = () => {
    console.log('🔄 Attempting app restart...');
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={globalErrorStyles.container}>
          <Text style={globalErrorStyles.title}>App Error</Text>
          <Text style={globalErrorStyles.message}>
            Something went wrong. Please restart the app.
          </Text>
          <Text style={globalErrorStyles.errorText}>
            Error: {this.state.error?.message || 'Unknown error'}
          </Text>
          <TouchableOpacity
            style={globalErrorStyles.restartButton}
            onPress={this.handleRestart}
          >
            <Text style={globalErrorStyles.restartButtonText}>Restart App</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const globalErrorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'monospace',
  },
  restartButton: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  restartButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Performance and debugging optimizations
LogBox.ignoreLogs([
  'Warning: ...', // Ignore specific warnings
  'Animated: `useNativeDriver`',
]);

// Global error handlers
const setupGlobalErrorHandlers = () => {
  console.log('🛡️ Setting up global error handlers...');

  // Handle unhandled promise rejections (React Native specific)
  if (typeof global !== 'undefined') {
    // Add basic error logging for debugging
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError('🚨 ERROR:', ...args);
      // You can add additional error reporting here
    };

    console.log('✅ Global error handlers configured');
  }
};

const App = () => {
  // Setup global error handlers
  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  // App state monitoring for performance
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        console.log('📱 App moved to background');
      } else if (nextAppState === 'active') {
        console.log('📱 App became active');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  console.log('🚀 App starting...');

  return (
    <GlobalErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <ThemeProvider>
            <AuthProvider>
              <NotificationProvider>
                <NavigationContainer
                  onReady={() => console.log('🧭 Navigation container ready')}
                  onStateChange={(state) => {
                    // Optional: Log navigation state changes in development
                    if (__DEV__) {
                      console.log('🧭 Navigation state changed');
                    }
                  }}
                >
                  <ThemedStatusBar />
                  <AppNavigator />
                </NavigationContainer>
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </GlobalErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;