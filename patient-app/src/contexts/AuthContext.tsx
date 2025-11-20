import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
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
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  patientId: string;
  dateOfBirth: string;
  phone: string;
  address: string;
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

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Set token in API service
        apiService.setAuthToken(token);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with:', { email, password: '***' }); // Debug log
      console.log('API Base URL being used:', (apiService as any).baseURL); // Debug log

      const response = await apiService.post('/auth/login', {email, password});
      console.log('Login response:', response.data); // Debug log

      const {token, data: userData} = response.data;

      // Store token and user data
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      // Set token in API service
      apiService.setAuthToken(token);

      setUser(userData);
      console.log('Login successful for user:', userData.name); // Debug log
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error?.response?.data);
      console.error('Error message:', error?.message);

      // Prefer server message when present, otherwise use error.message or serialize the error
      const serverMessage = error?.response?.data?.message;
      const fallback = error?.message || JSON.stringify(error);
      throw new Error(serverMessage || fallback || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await apiService.post('/auth/register', userData);

      const {token, data: newUserData} = response.data;

      // Store token and user data
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(newUserData));

      // Set token in API service
      apiService.setAuthToken(token);

      setUser(newUserData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
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
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};