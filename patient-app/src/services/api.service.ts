import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import expo constants dynamically to avoid type issues in some environments
// @ts-ignore
const Constants = require('expo-constants');
import { Platform } from 'react-native';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Resolve API base URL with sensible defaults for different environments.
    // Priority: EXPO_PUBLIC_API_URL env -> Expo debugger host (LAN) -> Android emulator -> localhost
    const envUrl = process.env.EXPO_PUBLIC_API_URL;
    if (envUrl) {
      this.baseURL = envUrl;
    } else {
      let resolved = 'http://localhost:5000/api';

      try {
        // If running inside Expo, derive host from debuggerHost (e.g. "192.168.1.10:19000")
        const debuggerHost = (Constants.manifest && (Constants.manifest as any).debuggerHost) || (Constants.expoConfig?.hostUri as any);
        if (debuggerHost && typeof debuggerHost === 'string') {
          const host = debuggerHost.split(':')[0];
          resolved = `http://${host}:5000/api`;
        } else if (Platform.OS === 'android') {
          // Android emulator (classic) uses 10.0.2.2 to reach host machine
          resolved = 'http://10.0.2.2:5000/api';
        }
      } catch (e) {
        // keep fallback
      }

      this.baseURL = resolved;
      console.log('API Base URL:', this.baseURL); // Debug log
    }

    // For mobile app development, force the host machine's IP address
    // Mobile devices cannot reach localhost on the host machine
    if (__DEV__) {
      // Use the host machine's IP address that mobile devices can reach
      this.baseURL = 'http://192.168.80.119:54112/api';
      console.log('Forced host IP for mobile development:', this.baseURL);
    }

    // Add a test connection method (async)
    setTimeout(() => {
      this.testConnection();
    }, 1000);

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 15000, // Increased timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private async setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  async testConnection() {
    try {
      console.log('Testing API connection to:', this.baseURL);
      const response = await this.api.get('/health');
      console.log('API connection successful:', response.data);
      return true;
    } catch (error: any) {
      console.error('API connection failed:', error.message);
      console.error('Please ensure the backend server is running on', this.baseURL);
      return false;
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.api.post('/auth/login', credentials);
  }

  async register(userData: any) {
    return this.api.post('/auth/register', userData);
  }

  async logout() {
    return this.api.post('/auth/logout');
  }

  async getCurrentUser() {
    return this.api.get('/auth/me');
  }

  // Doctor endpoints
  async getDoctors() {
    return this.api.get('/doctors');
  }

  async getDoctorById(id: string) {
    return this.api.get(`/doctors/${id}`);
  }

  // Appointment endpoints
  async getAppointments() {
    return this.api.get('/appointments');
  }

  async bookAppointment(appointmentData: any) {
    return this.api.post('/appointments', appointmentData);
  }

  async updateAppointment(id: string, data: any) {
    return this.api.put(`/appointments/${id}`, data);
  }

  async cancelAppointment(id: string) {
    return this.api.delete(`/appointments/${id}`);
  }

  // Prescription endpoints
  async getPrescriptions() {
    return this.api.get('/prescriptions');
  }

  async getPrescriptionById(id: string) {
    return this.api.get(`/prescriptions/${id}`);
  }

  // Payment endpoints
  async processPayment(paymentData: any) {
    return this.api.post('/payments', paymentData);
  }

  async getPaymentHistory() {
    return this.api.get('/payments');
  }

  // Generic HTTP methods
  async get(url: string, config?: any) {
    return this.api.get(url, config);
  }

  async post(url: string, data?: any, config?: any) {
    return this.api.post(url, data, config);
  }

  async put(url: string, data?: any, config?: any) {
    return this.api.put(url, data, config);
  }

  async delete(url: string, config?: any) {
    return this.api.delete(url, config);
  }
}

export const apiService = new ApiService();