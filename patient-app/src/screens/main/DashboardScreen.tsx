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
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  FadeInUp,
  SlideInRight,
  ZoomIn,
  useAnimatedScrollHandler,
  useSharedValue as useAnimatedSharedValue,
} from 'react-native-reanimated';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../../services/api.service';
import { AnimatedCard, GradientButton, LoadingSpinner, SkeletonCard } from '../../components';
import MoodTracker from '../../components/MoodTracker';
import { ThemeToggle } from '../../components/ThemeToggle';
import { getGreeting, getCurrentEthiopianTimeString } from '../../utils/time';
import { useTheme } from '../../contexts/ThemeContext';

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

// Modern Smart Dashboard Styles - Moved outside component to prevent re-renders
const modernStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },

  // Header Section
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  timeAndGreeting: {
    flex: 1,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  timeText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 34,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },

  // Wellness Overview
  wellnessOverview: {
    marginTop: 10,
  },
  wellnessCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  wellnessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  aiText: {
    color: '#00d4ff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  wellnessTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainScore: {
    fontSize: 72,
    fontWeight: '900',
    color: '#00d4ff',
    marginBottom: 8,
  },
  scoreDetails: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00d4ff',
    borderRadius: 3,
  },

  // AI Insights Section
  insightsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  insightsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  insightCard: {
    width: 280,
    marginRight: 16,
  },
  insightGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightBadge: {
    fontSize: 20,
  },
  insightTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  insightMessage: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  insightTrend: {
    marginBottom: 16,
  },
  trendValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  insightAction: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Metrics Section
  metricsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  metricIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 4,
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendTextSmall: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },

  // Actions Section
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  actionsGrid: {
    gap: 16,
  },
  primaryActionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#00d4ff',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  primaryActionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  primaryActionSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  secondaryActionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  secondaryActionGradient: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  secondaryActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Mood Section
  moodSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },

  // Recommendations Section
  recommendationsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  recommendationsList: {
    gap: 16,
  },
  recommendationCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  recommendationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recommendationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  recommendationText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
  },
  recommendationAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Emergency Section
  emergencySection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  emergencyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  emergencyGradient: {
    padding: 20,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyText: {
    flex: 1,
  },
  emergencyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  emergencySubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },

  // Bottom spacing
  bottomSpacing: {
    height: 40,
  },
});

const DashboardScreenContent = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const { theme } = useTheme();
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

  // Early return for no user - AFTER all hooks are declared to prevent hook count mismatch
  if (!user) {
    console.log('⚠️ DashboardScreen: No user, returning null');
    return null;
  }

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

  console.log('📱 DashboardScreen: User exists, checking loading state');

  console.log('📱 DashboardScreen: Rendering main dashboard content');

  console.log('🚀 DashboardScreen: Rendering futuristic therapeutic dashboard');

  // Futuristic Therapeutic-Tech UI Styles
  const futuristicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0f0f23',
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

  // Smart AI-powered insights
  const aiInsights = [
    {
      id: '1',
      type: 'improvement',
      title: 'Sleep Quality Improving',
      message: 'Your sleep score has increased by 12% this week. Keep up the good work!',
      icon: 'bedtime' as keyof typeof MaterialIcons.glyphMap,
      color: '#10b981',
      trend: '+12%'
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Medication Due',
      message: 'Time for your evening medication. Consistency is key to your recovery.',
      icon: 'medication' as keyof typeof MaterialIcons.glyphMap,
      color: '#f59e0b',
      action: 'Take Now'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Weekly Goal Met!',
      message: 'You completed 5 therapy sessions this week. Amazing progress!',
      icon: 'emoji-events' as keyof typeof MaterialIcons.glyphMap,
      color: '#8b5cf6',
      badge: '🏆'
    }
  ];

  const scrollY = useAnimatedSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Show loading spinner if still loading and not refreshing
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

  return (
    <View style={modernStyles.container}>
      {/* Dynamic Background */}
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={modernStyles.backgroundGradient}
      />

      <Animated.ScrollView
        style={modernStyles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00d4ff"
            colors={['#00d4ff']}
          />
        }
      >
        {/* Smart Header with AI Insights */}
        <View style={modernStyles.header}>
          <Animated.View entering={FadeInUp.delay(100)} style={modernStyles.headerTop}>
            <View style={modernStyles.timeAndGreeting}>
              <View style={modernStyles.timeBadge}>
                <Ionicons name="time-outline" size={16} color="#00d4ff" />
                <Text style={modernStyles.timeText}>{getCurrentEthiopianTimeString()}</Text>
              </View>
              <Text style={modernStyles.greeting}>
                {getGreeting()}, {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : 'there'}! 👋
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={modernStyles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color="#ffffff" />
                <View style={modernStyles.notificationDot} />
              </TouchableOpacity>
              <ThemeToggle size={24} />
            </View>
          </Animated.View>

          {/* AI-Powered Wellness Overview */}
          <Animated.View entering={SlideInRight.delay(300)} style={modernStyles.wellnessOverview}>
            <LinearGradient
              colors={['rgba(0, 212, 255, 0.1)', 'rgba(138, 43, 226, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={modernStyles.wellnessCard}
            >
              <View style={modernStyles.wellnessHeader}>
                <View style={modernStyles.aiIndicator}>
                  <Ionicons name="sparkles" size={20} color="#00d4ff" />
                  <Text style={modernStyles.aiText}>AI Analysis</Text>
                </View>
                <Text style={modernStyles.wellnessTitle}>Mental Wellness Score</Text>
              </View>

              <View style={modernStyles.scoreSection}>
                <Text style={modernStyles.mainScore}>87</Text>
                <View style={modernStyles.scoreDetails}>
                  <Text style={modernStyles.scoreLabel}>Excellent</Text>
                  <View style={modernStyles.trendIndicator}>
                    <Ionicons name="trending-up" size={14} color="#10b981" />
                    <Text style={modernStyles.trendText}>+5% this week</Text>
                  </View>
                </View>
              </View>

              <View style={modernStyles.progressBar}>
                <View style={[modernStyles.progressFill, { width: '87%' }]} />
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Smart AI Insights */}
        <Animated.View entering={FadeInUp.delay(500)} style={modernStyles.insightsSection}>
          <Text style={modernStyles.sectionTitle}>AI Insights & Recommendations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={modernStyles.insightsScroll}>
            {aiInsights.map((insight, index) => (
              <Animated.View
                key={insight.id}
                entering={ZoomIn.delay(600 + index * 100)}
                style={modernStyles.insightCard}
              >
                <LinearGradient
                  colors={[
                    `${insight.color}20`,
                    `${insight.color}10`
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={modernStyles.insightGradient}
                >
                  <View style={modernStyles.insightHeader}>
                    <View style={[modernStyles.insightIcon, { backgroundColor: insight.color }]}>
                      <MaterialIcons name={insight.icon} size={20} color="#ffffff" />
                    </View>
                    {insight.badge && <Text style={modernStyles.insightBadge}>{insight.badge}</Text>}
                  </View>

                  <Text style={modernStyles.insightTitle}>{insight.title}</Text>
                  <Text style={modernStyles.insightMessage}>{insight.message}</Text>

                  {insight.trend && (
                    <View style={modernStyles.insightTrend}>
                      <Text style={[modernStyles.trendValue, { color: insight.color }]}>
                        {insight.trend}
                      </Text>
                    </View>
                  )}

                  {insight.action && (
                    <TouchableOpacity style={[modernStyles.insightAction, { borderColor: insight.color }]}>
                      <Text style={[modernStyles.actionText, { color: insight.color }]}>
                        {insight.action}
                      </Text>
                    </TouchableOpacity>
                  )}
                </LinearGradient>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Interactive Data Visualization */}
        <Animated.View entering={FadeInUp.delay(700)} style={modernStyles.metricsSection}>
          <Text style={modernStyles.sectionTitle}>Your Progress Journey</Text>

          <View style={modernStyles.metricsGrid}>
            <TouchableOpacity style={modernStyles.metricCard}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={modernStyles.metricIcon}
              >
                <MaterialIcons name="event-available" size={24} color="#ffffff" />
              </LinearGradient>
              <Text style={modernStyles.metricValue}>{stats.upcomingAppointments}</Text>
              <Text style={modernStyles.metricLabel}>Upcoming Sessions</Text>
              <View style={modernStyles.metricTrend}>
                <Ionicons name="arrow-up" size={12} color="#10b981" />
                <Text style={modernStyles.trendTextSmall}>+2 this week</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={modernStyles.metricCard}>
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={modernStyles.metricIcon}
              >
                <MaterialIcons name="check-circle" size={24} color="#ffffff" />
              </LinearGradient>
              <Text style={modernStyles.metricValue}>{stats.completedSessions}</Text>
              <Text style={modernStyles.metricLabel}>Sessions Completed</Text>
              <View style={modernStyles.metricTrend}>
                <Ionicons name="arrow-up" size={12} color="#10b981" />
                <Text style={modernStyles.trendTextSmall}>+3 this month</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={modernStyles.metricCard}>
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={modernStyles.metricIcon}
              >
                <MaterialIcons name="local-pharmacy" size={24} color="#ffffff" />
              </LinearGradient>
              <Text style={modernStyles.metricValue}>{stats.activePrescriptions}</Text>
              <Text style={modernStyles.metricLabel}>Active Medications</Text>
              <View style={modernStyles.metricTrend}>
                <Ionicons name="checkmark" size={12} color="#6b7280" />
                <Text style={modernStyles.trendTextSmall}>All on track</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={modernStyles.metricCard}>
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={modernStyles.metricIcon}
              >
                <MaterialIcons name="trending-up" size={24} color="#ffffff" />
              </LinearGradient>
              <Text style={modernStyles.metricValue}>87%</Text>
              <Text style={modernStyles.metricLabel}>Consistency Score</Text>
              <View style={modernStyles.metricTrend}>
                <Ionicons name="trending-up" size={12} color="#10b981" />
                <Text style={modernStyles.trendTextSmall}>+8% this week</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Smart Quick Actions */}
        <Animated.View entering={FadeInUp.delay(900)} style={modernStyles.actionsSection}>
          <Text style={modernStyles.sectionTitle}>Quick Actions</Text>

          <View style={modernStyles.actionsGrid}>
            <TouchableOpacity style={modernStyles.primaryActionCard} onPress={handleBookAppointment}>
              <LinearGradient
                colors={['#00d4ff', '#0099cc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={modernStyles.primaryActionGradient}
              >
                <View style={modernStyles.actionIconContainer}>
                  <MaterialIcons name="event-available" size={32} color="#ffffff" />
                </View>
                <View style={modernStyles.actionContent}>
                  <Text style={modernStyles.primaryActionTitle}>Book Session</Text>
                  <Text style={modernStyles.primaryActionSubtitle}>Find available doctors</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={modernStyles.secondaryActionsRow}>
              <TouchableOpacity style={modernStyles.secondaryActionCard} onPress={handleChat}>
                <LinearGradient
                  colors={['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={modernStyles.secondaryActionGradient}
                >
                  <MaterialIcons name="chat" size={24} color="#8b5cf6" />
                  <Text style={modernStyles.secondaryActionText}>Chat</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={modernStyles.secondaryActionCard} onPress={handleVideoCall}>
                <LinearGradient
                  colors={['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={modernStyles.secondaryActionGradient}
                >
                  <MaterialIcons name="videocam" size={24} color="#10b981" />
                  <Text style={modernStyles.secondaryActionText}>Video Call</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={modernStyles.secondaryActionCard} onPress={handleEmergency}>
                <LinearGradient
                  colors={['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={modernStyles.secondaryActionGradient}
                >
                  <MaterialIcons name="emergency" size={24} color="#ef4444" />
                  <Text style={modernStyles.secondaryActionText}>Emergency</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Mood Tracker Integration */}
        <Animated.View entering={FadeInUp.delay(1100)} style={modernStyles.moodSection}>
          <Text style={modernStyles.sectionTitle}>Daily Mood Check-in</Text>
          <MoodTracker />
        </Animated.View>

        {/* Smart Recommendations */}
        <Animated.View entering={FadeInUp.delay(1300)} style={modernStyles.recommendationsSection}>
          <Text style={modernStyles.sectionTitle}>Personalized Recommendations</Text>

          <View style={modernStyles.recommendationsList}>
            <View style={modernStyles.recommendationCard}>
              <LinearGradient
                colors={['rgba(0, 212, 255, 0.1)', 'rgba(0, 212, 255, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={modernStyles.recommendationGradient}
              >
                <View style={modernStyles.recommendationIcon}>
                  <Ionicons name="leaf" size={24} color="#00d4ff" />
                </View>
                <View style={modernStyles.recommendationContent}>
                  <Text style={modernStyles.recommendationTitle}>Mindfulness Exercise</Text>
                  <Text style={modernStyles.recommendationText}>
                    Try the 5-minute breathing exercise to reduce anxiety levels
                  </Text>
                </View>
                <TouchableOpacity style={modernStyles.recommendationAction}>
                  <Text style={modernStyles.actionButtonText}>Start</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <View style={modernStyles.recommendationCard}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={modernStyles.recommendationGradient}
              >
                <View style={modernStyles.recommendationIcon}>
                  <Ionicons name="book" size={24} color="#8b5cf6" />
                </View>
                <View style={modernStyles.recommendationContent}>
                  <Text style={modernStyles.recommendationTitle}>Journal Entry</Text>
                  <Text style={modernStyles.recommendationText}>
                    Reflect on your progress and emotions in your wellness journal
                  </Text>
                </View>
                <TouchableOpacity style={modernStyles.recommendationAction}>
                  <Text style={modernStyles.actionButtonText}>Write</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </Animated.View>

        {/* Emergency Support */}
        <Animated.View entering={FadeInUp.delay(1500)} style={modernStyles.emergencySection}>
          <TouchableOpacity style={modernStyles.emergencyCard} onPress={handleEmergency}>
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={modernStyles.emergencyGradient}
            >
              <View style={modernStyles.emergencyContent}>
                <View style={modernStyles.emergencyIcon}>
                  <MaterialIcons name="emergency" size={32} color="#ffffff" />
                </View>
                <View style={modernStyles.emergencyText}>
                  <Text style={modernStyles.emergencyTitle}>Need Immediate Help?</Text>
                  <Text style={modernStyles.emergencySubtitle}>24/7 Crisis Support Available</Text>
                </View>
                <Ionicons name="call" size={24} color="#ffffff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={modernStyles.bottomSpacing} />
      </Animated.ScrollView>
    </View>
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
