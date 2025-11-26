import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../../services/api.service';
import { AnimatedCard, GradientButton, LoadingSpinner, SkeletonCard } from '../../components';
import MoodTracker from '../../components/MoodTracker';

// Temporary error styles for boundary
const errorStyles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Error Boundary Component
class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('❌ DashboardErrorBoundary caught an error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('❌ DashboardErrorBoundary error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.errorContainer}>
          <Text style={errorStyles.errorTitle}>Something went wrong</Text>
          <Text style={errorStyles.errorMessage}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            style={errorStyles.errorButton}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={errorStyles.errorButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

interface DashboardStats {
  upcomingAppointments: number;
  activePrescriptions: number;
  completedSessions: number;
  recentAppointments: any[];
  nextAppointment: any | null;
  lastSession: any | null;
}

// Move styles before components to avoid hoisting issues
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerOverlay: {
    paddingTop: 20,
  },
  headerCard: {
    padding: 20,
    marginBottom: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#e0e7ff',
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  role: {
    fontSize: 12,
    color: '#c7d2fe',
    fontWeight: '600',
    letterSpacing: 1,
    marginLeft: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  viewAllText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionCard: {
    width: '30%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 2,
  },
  statSubLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  appointmentCard: {
    flexDirection: 'row',
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  appointmentIcon: {
    marginRight: 16,
  },
  appointmentIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  footerActions: {
    marginTop: 20,
    marginBottom: 40,
    gap: 12,
  },
  emergencyButton: {
    marginBottom: 8,
  },
  logoutButton: {
    opacity: 0.8,
  },
  profileCard: {
    padding: 20,
    marginBottom: 0,
  },
  profileRow: {
    marginBottom: 15,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileItemText: {
    marginLeft: 12,
    flex: 1,
  },
  profileLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
  },
  patientIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  patientId: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  moodTrackerCard: {
    padding: 0,
    overflow: 'hidden',
  },
  prescriptionCard: {
    padding: 20,
  },
  prescriptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prescriptionText: {
    flex: 1,
    marginLeft: 15,
  },
  prescriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  prescriptionCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 15,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

const DashboardScreenContent = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    completedSessions: 0,
    recentAppointments: [],
    nextAppointment: null,
    lastSession: null,
  });

  console.log('📊 DashboardScreenContent render:', { user: user?.email, loading, isMounted });

  // Ensure screen stays mounted when focused
  useFocusEffect(
    useCallback(() => {
      console.log('📱 DashboardScreen focused');
      setIsMounted(true);
      
      // Load data when screen is focused
      if (user) {
        loadDashboardData();
      }

      return () => {
        console.log('📱 DashboardScreen unfocused');
        // Don't unmount, just mark as unfocused
        // setIsMounted(false);
      };
    }, [user])
  );

  // Initial load
  useEffect(() => {
    if (user && isMounted) {
      console.log('🔄 DashboardScreen: Initial load with user:', user.email);
      loadDashboardData();
    } else if (!user) {
      console.log('⚠️ DashboardScreen: No user, setting loading to false');
      setLoading(false);
    }
  }, [user, isMounted]);

  const loadDashboardData = async () => {
    if (!isMounted || !user) {
      console.log('⏭️ DashboardScreen: Skipping load - not mounted or no user');
      return;
    }

    try {
      console.log('📊 DashboardScreen: Loading dashboard data...');
      setLoading(true);
      
      // Fetch appointments with error handling
      let appointments: any[] = [];
      try {
        const appointmentsResponse = await apiService.getAppointments();
        appointments = appointmentsResponse.data?.data || appointmentsResponse.data || [];
        console.log('✅ DashboardScreen: Loaded appointments:', appointments.length);
      } catch (error: any) {
        // Network errors are expected if backend is not running
        if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || error.message?.includes('Network')) {
          console.log('⚠️ DashboardScreen: Backend server not available - using offline mode');
        } else {
          console.warn('⚠️ DashboardScreen: Could not fetch appointments:', error.message);
        }
        // Continue with empty array if API is unavailable
      }
      
      // Filter upcoming appointments
      const upcoming = appointments.filter((apt: any) => {
        try {
          const aptDate = new Date(apt.date || apt.appointmentDate);
          return aptDate >= new Date() && (apt.status === 'scheduled' || apt.status === 'confirmed');
        } catch {
          return false;
        }
      });

      // Get next appointment
      const nextAppointment = upcoming.length > 0 
        ? upcoming.sort((a: any, b: any) => {
            try {
              return new Date(a.date || a.appointmentDate).getTime() - new Date(b.date || b.appointmentDate).getTime();
            } catch {
              return 0;
            }
          })[0]
        : null;

      // Get last session
      const completed = appointments.filter((apt: any) => apt.status === 'completed');
      const lastSession = completed.length > 0
        ? completed.sort((a: any, b: any) => {
            try {
              return new Date(b.date || b.appointmentDate).getTime() - new Date(a.date || a.appointmentDate).getTime();
            } catch {
              return 0;
            }
          })[0]
        : null;

      // Fetch prescriptions with error handling
      let activePrescriptions: any[] = [];
      try {
        const prescriptionsResponse = await apiService.getPrescriptions();
        const prescriptions = prescriptionsResponse.data?.data || prescriptionsResponse.data || [];
        activePrescriptions = prescriptions.filter((pres: any) => 
          pres.status === 'active' || !pres.status
        );
        console.log('✅ DashboardScreen: Loaded prescriptions:', activePrescriptions.length);
      } catch (error: any) {
        // Network errors are expected if backend is not running
        if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || error.message?.includes('Network')) {
          console.log('⚠️ DashboardScreen: Backend server not available for prescriptions');
        } else {
          console.warn('⚠️ DashboardScreen: Could not fetch prescriptions:', error.message);
        }
        // Continue with empty array if API is unavailable
      }

      if (!isMounted) {
        console.log('⏭️ DashboardScreen: Component unmounted, skipping state update');
        return;
      }

      setStats({
        upcomingAppointments: upcoming.length,
        activePrescriptions: activePrescriptions.length,
        completedSessions: completed.length,
        recentAppointments: appointments.slice(0, 3),
        nextAppointment,
        lastSession,
      });
      
      console.log('✅ DashboardScreen: Data loaded successfully');
    } catch (error: any) {
      console.error('❌ DashboardScreen: Error loading dashboard data:', error);
      if (isMounted) {
        // Set default stats if everything fails
        setStats({
          upcomingAppointments: 0,
          activePrescriptions: 0,
          completedSessions: 0,
          recentAppointments: [],
          nextAppointment: null,
          lastSession: null,
        });
      }
    } finally {
      if (isMounted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  const onRefresh = useCallback(() => {
    console.log('🔄 DashboardScreen: Refreshing...');
    setRefreshing(true);
    loadDashboardData();
  }, [user, isMounted]);

  const handleVideoCall = () => {
    (navigation as any).navigate('VideoCall', { appointmentId: 'demo-appointment-1' });
  };

  const handleBookAppointment = () => {
    (navigation as any).navigate('Doctors');
  };

  const handleViewRecords = () => {
    (navigation as any).navigate('Appointments');
  };

  const handleChat = () => {
    (navigation as any).navigate('Chat');
  };

  const handleViewPrescriptions = () => {
    (navigation as any).navigate('Prescriptions');
  };

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Help',
      'In case of emergency, please call:\n\nEmergency: 911\nCrisis Hotline: 988\n\nWould you like to call emergency services?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call 911', onPress: () => {
          // In a real app, this would initiate a phone call
          Alert.alert('Emergency', 'Please dial 911 on your phone for immediate assistance.');
        }},
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  // Don't render if no user (shouldn't happen, but safety check)
  if (!user) {
    console.log('⚠️ DashboardScreen: No user, returning null');
    return null;
  }

  console.log('📱 DashboardScreen: User exists, checking loading state');

  if (loading && !refreshing) {
    console.log('📱 DashboardScreen: Showing loading spinner');
    return (
      <LoadingSpinner
        fullScreen
        text="Loading your dashboard..."
        color="#667eea"
      />
    );
  }

  console.log('📱 DashboardScreen: Rendering main dashboard content');

  console.log('🚀 DashboardScreen: Rendering futuristic therapeutic dashboard');

  // Futuristic Therapeutic-Tech UI Styles
  const futuristicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },

    // Header with Parallax Effect
    header: {
      height: 320,
      position: 'relative',
      overflow: 'hidden',
    },
    headerGradient: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'transparent',
    },
    headerOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerContent: {
      flex: 1,
      paddingTop: 60,
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    timeBadge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    timeText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },
    welcomeCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarGlow: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#ffffff',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#e5e7eb',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
    },
    welcomeText: {
      alignItems: 'center',
    },
    greeting: {
      fontSize: 22,
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    patientBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'center',
    },
    patientBadgeText: {
      fontSize: 12,
      color: '#ffffff',
      fontWeight: '600',
      marginLeft: 6,
    },

    // Main Content
    mainContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },

    // AI Wellness Score
    wellnessCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.8)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    },
    wellnessHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    aiIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#a855f7',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    wellnessTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1f2937',
    },
    wellnessScore: {
      fontSize: 48,
      fontWeight: '900',
      color: '#10b981',
      textAlign: 'center',
      marginVertical: 16,
    },
    wellnessLabel: {
      fontSize: 14,
      color: '#6b7280',
      textAlign: 'center',
      fontWeight: '500',
    },

    // Quick Actions Grid
    actionsSection: {
      marginBottom: 24,
    },
    actionsTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: 20,
      textAlign: 'center',
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    actionCard: {
      width: '31%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.8)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    actionGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 16,
      backgroundColor: 'transparent',
    },
    actionIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    actionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: 4,
    },
    actionSubtitle: {
      fontSize: 10,
      color: '#6b7280',
      textAlign: 'center',
      lineHeight: 14,
    },

    // Features Row
    featuresRow: {
      flexDirection: 'row',
      marginBottom: 24,
    },
    featureCard: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.8)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    featureIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    featureTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: 4,
    },
    featureValue: {
      fontSize: 16,
      fontWeight: '800',
      color: '#6366f1',
    },

    // Emergency Button
    emergencyButton: {
      backgroundColor: '#ef4444',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#ef4444',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    emergencyContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emergencyIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    emergencyText: {
      flex: 1,
    },
    emergencyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: 2,
    },
    emergencySubtitle: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
    },

    // Announcements
    announcementsCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.8)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    announcementHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    announcementIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#f59e0b',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    announcementTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1f2937',
    },
    announcementItem: {
      backgroundColor: '#f8fafc',
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
    },
    announcementText: {
      fontSize: 14,
      color: '#374151',
      fontWeight: '500',
    },
    announcementMeta: {
      fontSize: 12,
      color: '#6b7280',
      marginTop: 4,
    },
  });

  return (
    <ScrollView
      style={futuristicStyles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
      }
    >
      {/* Futuristic Header with Parallax */}
      <View style={futuristicStyles.header}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#f5576c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={futuristicStyles.headerGradient}
        />
        <View style={futuristicStyles.headerOverlay} />
        <View style={futuristicStyles.headerContent}>
          <View style={futuristicStyles.timeBadge}>
            <Text style={futuristicStyles.timeText}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>

          <View style={futuristicStyles.welcomeCard}>
            <View style={futuristicStyles.avatarSection}>
              <View style={futuristicStyles.avatarGlow}>
                <View style={futuristicStyles.avatar}>
                  <Image source={require('../../assets/D11.png')} style={futuristicStyles.avatarImage} />
                </View>
              </View>
            </View>

            <View style={futuristicStyles.welcomeText}>
              <Text style={futuristicStyles.greeting}>
                Hey {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : 'there'} 👋 Hope today treats you kindly.
              </Text>
              <View style={futuristicStyles.patientBadge}>
                <MaterialIcons name="verified-user" size={14} color="#ffffff" />
                <Text style={futuristicStyles.patientBadgeText}>Mental Health Patient</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={futuristicStyles.mainContent}>
        {/* AI Wellness Score */}
        <View style={futuristicStyles.wellnessCard}>
          <View style={futuristicStyles.wellnessHeader}>
            <View style={futuristicStyles.aiIcon}>
              <MaterialIcons name="psychology" size={24} color="#ffffff" />
            </View>
            <Text style={futuristicStyles.wellnessTitle}>AI Wellness Score</Text>
          </View>
          <Text style={futuristicStyles.wellnessScore}>87</Text>
          <Text style={futuristicStyles.wellnessLabel}>Excellent Progress</Text>
        </View>

        {/* Quick Actions Grid */}
        <View style={futuristicStyles.actionsSection}>
          <Text style={futuristicStyles.actionsTitle}>Quick Actions</Text>
          <View style={futuristicStyles.actionsGrid}>
            <TouchableOpacity style={futuristicStyles.actionCard} onPress={handleBookAppointment}>
              <View style={[futuristicStyles.actionIcon, { backgroundColor: '#dbeafe' }]}>
                <MaterialIcons name="event-available" size={28} color="#2563eb" />
              </View>
              <Text style={futuristicStyles.actionTitle}>Book Appointment</Text>
              <Text style={futuristicStyles.actionSubtitle}>Schedule new session</Text>
            </TouchableOpacity>

            <TouchableOpacity style={futuristicStyles.actionCard} onPress={handleChat}>
              <View style={[futuristicStyles.actionIcon, { backgroundColor: '#e0e7ff' }]}>
                <MaterialIcons name="chat" size={28} color="#6366f1" />
              </View>
              <Text style={futuristicStyles.actionTitle}>Chat with Doctor</Text>
              <Text style={futuristicStyles.actionSubtitle}>Secure messaging</Text>
            </TouchableOpacity>

            <TouchableOpacity style={futuristicStyles.actionCard} onPress={() => {}}>
              <View style={[futuristicStyles.actionIcon, { backgroundColor: '#dcfce7' }]}>
                <MaterialIcons name="medication" size={28} color="#16a34a" />
              </View>
              <Text style={futuristicStyles.actionTitle}>Medication Reminder</Text>
              <Text style={futuristicStyles.actionSubtitle}>Track your meds</Text>
            </TouchableOpacity>

            <TouchableOpacity style={futuristicStyles.actionCard} onPress={handleEmergency}>
              <View style={[futuristicStyles.actionIcon, { backgroundColor: '#fef2f2' }]}>
                <MaterialIcons name="local-hospital" size={28} color="#dc2626" />
              </View>
              <Text style={futuristicStyles.actionTitle}>Emergency Contact</Text>
              <Text style={futuristicStyles.actionSubtitle}>24/7 crisis support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={futuristicStyles.actionCard} onPress={() => {}}>
              <View style={[futuristicStyles.actionIcon, { backgroundColor: '#f3e8ff' }]}>
                <MaterialIcons name="science" size={28} color="#9333ea" />
              </View>
              <Text style={futuristicStyles.actionTitle}>Lab Results</Text>
              <Text style={futuristicStyles.actionSubtitle}>View test results</Text>
            </TouchableOpacity>

            <TouchableOpacity style={futuristicStyles.actionCard} onPress={() => {}}>
              <View style={[futuristicStyles.actionIcon, { backgroundColor: '#fdf4ff' }]}>
                <MaterialIcons name="book" size={28} color="#c026d3" />
              </View>
              <Text style={futuristicStyles.actionTitle}>Wellness Journal</Text>
              <Text style={futuristicStyles.actionSubtitle}>Daily reflections</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Row */}
        <View style={futuristicStyles.featuresRow}>
          <TouchableOpacity style={futuristicStyles.featureCard} onPress={() => {}}>
            <View style={[futuristicStyles.featureIcon, { backgroundColor: '#dbeafe' }]}>
              <MaterialIcons name="mic" size={20} color="#2563eb" />
            </View>
            <Text style={futuristicStyles.featureTitle}>Voice Journal</Text>
            <Text style={futuristicStyles.featureValue}>2 entries</Text>
          </TouchableOpacity>

          <TouchableOpacity style={futuristicStyles.featureCard} onPress={() => {}}>
            <View style={[futuristicStyles.featureIcon, { backgroundColor: '#dcfce7' }]}>
              <MaterialIcons name="bedtime" size={20} color="#16a34a" />
            </View>
            <Text style={futuristicStyles.featureTitle}>Sleep Score</Text>
            <Text style={futuristicStyles.featureValue}>8.2 hrs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={futuristicStyles.featureCard} onPress={() => {}}>
            <View style={[futuristicStyles.featureIcon, { backgroundColor: '#fef3c7' }]}>
              <MaterialIcons name="trending-up" size={20} color="#d97706" />
            </View>
            <Text style={futuristicStyles.featureTitle}>Progress</Text>
            <Text style={futuristicStyles.featureValue}>+15%</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Crisis Button */}
        <TouchableOpacity style={futuristicStyles.emergencyButton} onPress={handleEmergency}>
          <View style={futuristicStyles.emergencyContent}>
            <View style={futuristicStyles.emergencyIcon}>
              <MaterialIcons name="emergency" size={28} color="#ffffff" />
            </View>
            <View style={futuristicStyles.emergencyText}>
              <Text style={futuristicStyles.emergencyTitle}>Crisis Support</Text>
              <Text style={futuristicStyles.emergencySubtitle}>Immediate help available</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={24} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* Announcements & Tips */}
        <View style={futuristicStyles.announcementsCard}>
          <View style={futuristicStyles.announcementHeader}>
            <View style={futuristicStyles.announcementIcon}>
              <MaterialIcons name="lightbulb" size={20} color="#ffffff" />
            </View>
            <Text style={futuristicStyles.announcementTitle}>Announcements & Tips</Text>
          </View>

          <View style={futuristicStyles.announcementItem}>
            <Text style={futuristicStyles.announcementText}>
              🌱 Try deep breathing: Inhale for 4 counts, hold for 4, exhale for 4. Great for anxiety!
            </Text>
            <Text style={futuristicStyles.announcementMeta}>Mental Health Tip • 2 hours ago</Text>
          </View>

          <View style={futuristicStyles.announcementItem}>
            <Text style={futuristicStyles.announcementText}>
              📅 New group therapy session available this Thursday at 6 PM. Join our supportive community!
            </Text>
            <Text style={futuristicStyles.announcementMeta}>Clinic Update • 1 day ago</Text>
          </View>

          <View style={futuristicStyles.announcementItem}>
            <Text style={futuristicStyles.announcementText}>
              💊 Remember to take your evening medication. Your wellness tracker shows great consistency!
            </Text>
            <Text style={futuristicStyles.announcementMeta}>Medication Reminder • 3 hours ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const DashboardScreen = () => {
  return (
    <DashboardErrorBoundary>
      <DashboardScreenContent />
    </DashboardErrorBoundary>
  );
};


export default DashboardScreen;
