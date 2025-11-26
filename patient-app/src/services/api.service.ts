import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import expo constants dynamically to avoid type issues in some environments
// @ts-ignore
const Constants = require('expo-constants');
import { Platform } from 'react-native';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  getBaseURL(): string {
    return this.baseURL;
  }

  async setBaseURL(url: string) {
    this.baseURL = url;
    this.api.defaults.baseURL = url;
    await AsyncStorage.setItem('api_base_url', url);
    console.log('API Base URL updated to:', url);
  }

  constructor() {
    // Resolve API base URL with sensible defaults for different environments.
    // Priority: AsyncStorage -> EXPO_PUBLIC_API_URL env -> Expo debugger host -> Android emulator -> localhost
    this.baseURL = this.resolveBaseURL();

    // Create axios instance
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 15000, // 15 second timeout (increased for slower connections)
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Better error handling for network issues
      validateStatus: function (status) {
        return status < 500; // Don't throw for 4xx errors, only 5xx
      },
    });

    this.setupInterceptors();
    // Initialize base URL asynchronously (will update if AsyncStorage has a value)
    this.initializeBaseURL();
  }

  private resolveBaseURL(): string {
    // Priority 1: Check environment variable
    const envUrl = process.env.EXPO_PUBLIC_API_URL;
    if (envUrl) {
      console.log('🌍 API Base URL (from env):', envUrl);
      return envUrl;
    }

    // Priority 2: Try to detect the best URL based on environment
    const devPort = process.env.EXPO_PUBLIC_API_PORT || '5000';
    let resolved = 'http://localhost:5000/api';

    try {
      // Try to get Expo debugger host (works for both Expo Go and dev builds)
      const debuggerHost =
        (Constants.manifest && (Constants.manifest as any).debuggerHost) ||
        (Constants.expoConfig?.hostUri as any) ||
        (Constants.expoGoConfig?.debuggerHost as any);
      
      if (debuggerHost && typeof debuggerHost === 'string') {
        const host = debuggerHost.split(':')[0];
        resolved = `http://${host}:${devPort}/api`;
        console.log('🔗 Using Expo debugger host:', host);
      } else if (Platform.OS === 'android') {
        // Android emulator uses 10.0.2.2 to reach host machine
        // For physical devices, this won't work - user needs to set IP manually
        resolved = `http://10.0.2.2:${devPort}/api`;
        console.log('🤖 Detected Android - using emulator address (10.0.2.2)');
        console.warn('⚠️  If using a physical Android device, you need to:');
        console.warn('   1. Find your computer\'s IP address (ipconfig on Windows, ifconfig on Mac/Linux)');
        console.warn('   2. Set EXPO_PUBLIC_API_URL=http://YOUR_IP:5000/api');
        console.warn('   3. Or use AsyncStorage to set the API URL in the app');
      } else if (Platform.OS === 'ios') {
        // iOS simulator can use localhost, but physical device needs IP
        resolved = `http://localhost:${devPort}/api`;
        console.log('🍎 Detected iOS - using localhost');
        console.warn('⚠️  If using a physical iOS device, you need to use your computer\'s IP address');
      }
    } catch (e) {
      console.warn('⚠️  Error detecting host, using fallback:', e);
    }

    console.log('✅ API Base URL resolved to:', resolved);
    return resolved;
  }

  private async initializeBaseURL() {
    try {
      // Check AsyncStorage for manually configured URL (highest priority)
      const storedUrl = await AsyncStorage.getItem('api_base_url');
      if (storedUrl) {
        this.baseURL = storedUrl;
        this.api.defaults.baseURL = this.baseURL;
        console.log('📱 API Base URL (from storage):', this.baseURL);
      }
    } catch (error) {
      console.warn('⚠️  Error reading stored API URL:', error);
    }
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
        // Only clear token on 401 for auth endpoints, not for all endpoints
        // This prevents premature logout when other API calls fail
        if (error.response?.status === 401) {
          const requestUrl = error.config?.url || '';
          // Only clear token if it's an auth-related endpoint (not data fetching)
          // This prevents clearing token when fetching appointments, prescriptions, etc.
          if (requestUrl.includes('/auth/me') || requestUrl.includes('/auth/verify')) {
            // Token is invalid, clear it
            console.warn('⚠️ Token invalid on auth endpoint, clearing storage');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
          } else {
            // For other endpoints, just log the 401 but don't clear token
            // Let the calling code handle the error appropriately
            console.warn('⚠️ 401 error on:', requestUrl, '- Token may be invalid, but not clearing automatically');
          }
        }
        // Log network errors for debugging but don't crash the app
        if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
          console.error('❌ Network error - backend may not be running');
          console.error('📍 Attempted URL:', this.baseURL);
          console.error('💡 Troubleshooting steps:');
          console.error('   1. Make sure the backend server is running (cd backend && npm run dev)');
          console.error('   2. Check that the server is listening on port 5000');
          console.error('   3. If using a physical device, ensure your computer and device are on the same network');
          console.error('   4. For physical devices, use your computer\'s IP address instead of localhost');
          console.error('   5. Check firewall settings that might be blocking connections');
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

  // Optional manual connectivity check (not used by login flow)
  async testConnection() {
    try {
      console.log('🔍 Testing API connection to:', this.baseURL);
      const response = await this.api.get('/health', { timeout: 5000 });
      console.log('✅ API connection successful:', response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('❌ API connection failed:', error.message);
      console.error('📍 Failed URL:', this.baseURL);
      
      // Try alternative URLs if the current one fails
      if (this.baseURL.includes('10.0.2.2')) {
        console.log('💡 Trying alternative: localhost...');
        try {
          const altResponse = await axios.get('http://localhost:5000/api/health', { timeout: 5000 });
          console.log('✅ Alternative URL (localhost) works!');
          console.log('⚠️  Consider using localhost instead of 10.0.2.2');
          return { success: true, data: altResponse.data, alternative: true };
        } catch (altError) {
          console.error('❌ Alternative URL also failed');
        }
      }
      
      return { success: false, error: error.message };
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