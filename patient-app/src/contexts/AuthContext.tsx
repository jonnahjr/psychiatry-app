import React, {createContext, useContext, useState, useEffect, useCallback, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiService} from '../services/api.service';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  patientId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  healthMetrics: HealthMetrics | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshHealthMetrics: () => Promise<HealthMetrics | undefined>;
}

interface HealthMetrics {
  sessions: number;
  wellnessScore: number;
  journalEntries: number;
  prescriptions: number;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  patientId: string;
  dateOfBirth: string;
  age?: string;
  phone: string;
  address: string;
  location?: string;
  gender: string;
  medicalBackground?: string;
  idPassport?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);

  useEffect(() => {
    checkAuthState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthState = useCallback(async () => {
    try {
      console.log('🔍 Checking authentication state');

      // Parallel storage reads for better performance
      const [token, userDataString] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('user')
      ]);

      if (token && userDataString) {
        console.log('📦 Found stored authentication data');

        let parsedUser: any;
        try {
          parsedUser = JSON.parse(userDataString);
        } catch (parseError) {
          console.error('❌ Failed to parse stored user data:', parseError);
          throw new Error('Invalid stored user data');
        }

        // Validate and normalize user data
        const normalizedUser: User = {
          _id: parsedUser._id || parsedUser.id || '',
          name: parsedUser.name || parsedUser.email?.split('@')[0] || 'User',
          email: parsedUser.email || '',
          role: parsedUser.role || 'patient',
          patientId: parsedUser.patientId || parsedUser.patient_id,
        };

        // Basic validation
        if (!normalizedUser._id || !normalizedUser.email) {
          throw new Error('Invalid user data structure');
        }

        // Set token in API service
        apiService.setAuthToken(token);

        // Set user state immediately for fast UI update
        setUser(normalizedUser);
        console.log('✅ User authenticated:', normalizedUser.name);

        // Skip background token validation for now to avoid logging the user out
        // when the backend auth endpoints return 401 or are temporarily unavailable.

      } else {
        console.log('📭 No stored authentication found');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Auth state check failed:', error);

      // Clear potentially corrupted data
      try {
        await Promise.all([
          AsyncStorage.removeItem('token'),
          AsyncStorage.removeItem('user'),
        ]);
        apiService.setAuthToken('');
        setUser(null);
      } catch (clearError) {
        console.error('Error clearing corrupted auth data:', clearError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    // Input validation
    if (!identifier?.trim() || !password?.trim()) {
      throw new Error('Please provide both email/phone and password');
    }

    setIsLoading(true);
    console.log('🔐 Starting login process for:', identifier);

    try {
      // Check network connectivity first (basic check)
      const startTime = Date.now();

      console.log('📡 Making API call to login endpoint');
      const response = await apiService.post('/auth/login', {
        identifier: identifier.trim(),
        password: password.trim()
      });

      const apiCallTime = Date.now() - startTime;
      console.log(`⚡ API call completed in ${apiCallTime}ms`);

      // Handle both response formats: {success, token, data} and {token, data}
      const responseData = response.data;
      const token = responseData.token;
      let userData = responseData.data || responseData;

      if (!token) {
        throw new Error('Authentication failed: No access token received');
      }

      if (!userData) {
        throw new Error('Authentication failed: No user data received');
      }

      // Validate and normalize user data
      const normalizedUser: User = {
        _id: userData.id || userData._id || '',
        name: userData.name || userData.email?.split('@')[0] || 'User',
        email: userData.email || '',
        role: userData.role || 'patient',
        patientId: userData.patient_id || userData.patientId,
      };

      // Validate required fields
      if (!normalizedUser._id || !normalizedUser.email) {
        throw new Error('Invalid user data received from server');
      }

      console.log('💾 Storing authentication data');

      // Parallel storage operations for better performance
      const storagePromises = [
        AsyncStorage.setItem('token', token),
        AsyncStorage.setItem('user', JSON.stringify(normalizedUser)),
      ];

      await Promise.all(storagePromises);

      // Set token in API service
      apiService.setAuthToken(token);

      // Set user state - this triggers navigation
      setUser(normalizedUser);

      const totalTime = Date.now() - startTime;
      console.log(`✅ Login successful in ${totalTime}ms for user:`, normalizedUser.name);
      console.log('✅ User role:', normalizedUser.role);
      console.log('🚀 Navigation should update automatically');

    } catch (error: any) {
      console.error('❌ Login failed:', error);

      // Enhanced error handling
      let errorMessage = 'Login failed. Please try again.';

      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        const baseURL = (apiService as any).baseURL || 'http://192.168.80.126:5000/api';
        errorMessage = `Cannot connect to server.\n\nPlease check:\n• Server is running\n• Network connection\n• Server URL: ${baseURL}`;
      } else if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 400:
            errorMessage = 'Invalid login credentials. Please check your email/phone and password.';
            break;
          case 401:
            errorMessage = 'Invalid username or password.';
            break;
          case 403:
            errorMessage = 'Account is disabled. Please contact support.';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            const validationMsg = Array.isArray(data?.errors) && data.errors.length > 0
              ? data.errors[0]?.msg
              : data?.message;
            errorMessage = validationMsg || `Server error: ${status}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Clear any partial data on failure
      try {
        await Promise.all([
          AsyncStorage.removeItem('token'),
          AsyncStorage.removeItem('user'),
        ]);
        apiService.setAuthToken('');
        setUser(null);
      } catch (clearError) {
        console.error('Error clearing storage:', clearError);
      }

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await apiService.post('/auth/register', userData);

      // Handle both response formats: {success, token, data} and {token, data}
      const responseData = response.data;
      const token = responseData.token;
      let newUserData = responseData.data || responseData;

      if (!token) {
        throw new Error('No token received from server');
      }

      if (!newUserData) {
        throw new Error('No user data received from server');
      }

      // Ensure user data has required fields and correct structure
      const normalizedUser: User = {
        _id: newUserData.id || newUserData._id || '',
        name: newUserData.name || '',
        email: newUserData.email || '',
        role: newUserData.role || 'patient', // Default to patient if role is missing
        patientId: newUserData.patient_id || newUserData.patientId,
      };

      // Store token and user data FIRST before setting state
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(normalizedUser));

      // Set token in API service
      apiService.setAuthToken(token);

      // Fetch health metrics immediately after login
      console.log('📊 Fetching health metrics after login...');
      const metrics = await refreshHealthMetrics();

      // Set user state LAST - this triggers navigation to authenticated screens
      setUser(normalizedUser);
      console.log('✅ Registration successful for user:', normalizedUser.name || normalizedUser.email);
      console.log('✅ User role:', normalizedUser.role);
      console.log('✅ Health metrics loaded:', metrics);
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
      // Clear any partial data on registration failure
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        apiService.setAuthToken('');
        setUser(null);
      } catch (clearError) {
        console.error('Error clearing storage on registration failure:', clearError);
      }

      // Provide more helpful error messages
      let errorMessage = 'Registration failed';
      
      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        const baseURL = (apiService as any).baseURL || 'http://localhost:5000/api';
        errorMessage = `Cannot connect to backend server.\n\nTroubleshooting:\n• Make sure backend is running: cd backend && npm run dev\n• Check URL: ${baseURL}\n• For physical devices, use your computer's IP address\n• Ensure both devices are on the same network`;
      } else if (error.response) {
        const data = error.response.data;
        const validationMsg =
          Array.isArray(data?.errors) && data.errors.length > 0
            ? data.errors[0]?.msg
            : undefined;
        errorMessage =
          validationMsg ||
          data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Clear stored data
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

      // Clear token from API service
      apiService.setAuthToken('');

      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHealthMetrics = async () => {
    if (!user) return;

    try {
      // Fetch appointments/sessions count
      const appointmentsResponse = await apiService.getAppointments();
      const appointments = appointmentsResponse.data?.data || appointmentsResponse.data || [];
      const sessionsCount = appointments.filter((apt: any) =>
        apt.status === 'completed' || apt.status === 'scheduled'
      ).length;

      // Fetch prescriptions count
      const prescriptionsResponse = await apiService.getPrescriptions();
      const prescriptions = prescriptionsResponse.data?.data || prescriptionsResponse.data || [];
      const prescriptionsCount = prescriptions.filter((pres: any) =>
        pres.status === 'active' || !pres.status
      ).length;

      // Calculate wellness score (based on activity)
      const wellnessScore = Math.min(100, Math.max(0,
        (sessionsCount * 10) + (prescriptionsCount * 5) + 60
      ));

      // Journal entries count (mock for now - would come from journal API)
      const journalEntriesCount = Math.floor(Math.random() * 50) + 10; // Mock data

      const metrics: HealthMetrics = {
        sessions: sessionsCount,
        wellnessScore: wellnessScore,
        journalEntries: journalEntriesCount,
        prescriptions: prescriptionsCount,
      };

      setHealthMetrics(metrics);
      return metrics;
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      // Set default values if API fails
      const defaultMetrics: HealthMetrics = {
        sessions: 0,
        wellnessScore: 75,
        journalEntries: 0,
        prescriptions: 0,
      };
      setHealthMetrics(defaultMetrics);
      return defaultMetrics;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      const response = await apiService.put('/auth/me', data);

      const updatedUser = response.data.data;

      // Update stored user data
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      setUser(updatedUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    healthMetrics,
    login,
    register,
    logout,
    updateProfile,
    refreshHealthMetrics,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};