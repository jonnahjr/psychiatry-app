import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeInUp,
  FadeIn,
  ZoomIn,
} from 'react-native-reanimated';
import { GlassCard } from '../../components/GlassCard';
import { MedicalButton } from '../../components/MedicalButton';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';
import { apiService } from '../../services/api.service';

const { width } = Dimensions.get('window');

interface DashboardStats {
  upcomingAppointments: number;
  activePrescriptions: number;
  completedSessions: number;
  recentAppointments: any[];
  nextAppointment: any | null;
  lastSession: any | null;
}

const DashboardScreenNew = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    completedSessions: 0,
    recentAppointments: [],
    nextAppointment: null,
    lastSession: null,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      setStats({
        upcomingAppointments: 2,
        activePrescriptions: 3,
        completedSessions: 12,
        recentAppointments: [
          {
            id: '1',
            doctorName: 'Dr. Sarah Johnson',
            date: '2024-01-15',
            time: '10:00 AM',
            status: 'scheduled',
            type: 'Therapy Session'
          },
          {
            id: '2',
            doctorName: 'Dr. Michael Chen',
            date: '2024-01-10',
            time: '2:30 PM',
            status: 'completed',
            type: 'Follow-up'
          }
        ],
        nextAppointment: {
          doctorName: 'Dr. Abebe Tadesse',
          date: '2024-01-15',
          time: '10:00 AM',
          type: 'Therapy Session'
        },
        lastSession: {
          doctorName: 'Dr. Mekdes Haile',
          date: '2024-01-10',
          type: 'Follow-up'
        }
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Assistance',
      'In case of crisis, please contact:\n\n• Emergency: 911\n• Crisis Hotline: 988\n• Local Crisis Center: 1-800-950-6264',
      [
        { text: 'Call 911', style: 'destructive', onPress: () => {/* Handle emergency call */} },
        { text: 'Call Crisis Line', onPress: () => {/* Handle crisis call */} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your health dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.secondary, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerOverlay}>
          <View style={styles.headerContent}>
            <View style={styles.userSection}>
              <Animated.View entering={ZoomIn}>
                <Image
                  source={require('../../assets/D11.png')}
                  style={styles.avatar}
                />
              </Animated.View>
              <View style={styles.userInfo}>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.userName}>{user?.name || 'Patient'}</Text>
                <View style={styles.patientIdBadge}>
                  <Text style={styles.patientIdText}>ID: {user?.patientId || 'P000001'}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.notificationIcon}>🔔</Text>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.content}>
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {[
                {
                  icon: '📅',
                  title: 'Book Session',
                  subtitle: 'Schedule appointment',
                  color: colors.primary,
                  action: () => navigation.navigate('Appointments' as never)
                },
                {
                  icon: '💬',
                  title: 'Chat',
                  subtitle: 'Message doctor',
                  color: colors.secondary,
                  action: () => navigation.navigate('Chat' as never)
                },
                {
                  icon: '📹',
                  title: 'Video Call',
                  subtitle: 'Start consultation',
                  color: colors.accent,
                  action: () => navigation.navigate('VideoCall' as never)
                },
                {
                  icon: '📊',
                  title: 'Mood Tracker',
                  subtitle: 'Track progress',
                  color: colors.success,
                  action: () => {
                    // MoodTracker is already on the dashboard, just show a message
                    Alert.alert('Mood Tracker', 'Check your mood tracker below on this dashboard!');
                  }
                }
              ].map((action, index) => (
                <Animated.View
                  key={action.title}
                  entering={FadeInUp.delay(index * 100)}
                  style={styles.actionCardWrapper}
                >
                  <TouchableOpacity
                    style={styles.actionCard}
                    onPress={action.action}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[action.color + '20', action.color + '10']}
                      style={styles.actionIcon}
                    >
                      <Text style={[styles.actionIconText, { color: action.color }]}>
                        {action.icon}
                      </Text>
                    </LinearGradient>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Health Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Summary</Text>
            <View style={styles.statsGrid}>
              <GlassCard style={styles.statCard}>
                <LinearGradient
                  colors={[colors.primary + '20', colors.primary + '05']}
                  style={styles.statIcon}
                >
                  <Text style={[styles.statIconText, { color: colors.primary }]}>📅</Text>
                </LinearGradient>
                <Text style={styles.statNumber}>{stats.upcomingAppointments}</Text>
                <Text style={styles.statLabel}>Upcoming</Text>
                <Text style={styles.statSubLabel}>Appointments</Text>
              </GlassCard>

              <GlassCard style={styles.statCard}>
                <LinearGradient
                  colors={[colors.success + '20', colors.success + '05']}
                  style={styles.statIcon}
                >
                  <Text style={[styles.statIconText, { color: colors.success }]}>💊</Text>
                </LinearGradient>
                <Text style={styles.statNumber}>{stats.activePrescriptions}</Text>
                <Text style={styles.statLabel}>Active</Text>
                <Text style={styles.statSubLabel}>Prescriptions</Text>
              </GlassCard>

              <GlassCard style={styles.statCard}>
                <LinearGradient
                  colors={[colors.warning + '20', colors.warning + '05']}
                  style={styles.statIcon}
                >
                  <Text style={[styles.statIconText, { color: colors.warning }]}>✅</Text>
                </LinearGradient>
                <Text style={styles.statNumber}>{stats.completedSessions}</Text>
                <Text style={styles.statLabel}>Completed</Text>
                <Text style={styles.statSubLabel}>Sessions</Text>
              </GlassCard>
            </View>
          </View>

          {/* Next Appointment */}
          {stats.nextAppointment && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Next Appointment</Text>
              <GlassCard style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentDoctor}>
                    {stats.nextAppointment.doctorName}
                  </Text>
                  <Text style={styles.appointmentType}>
                    {stats.nextAppointment.type}
                  </Text>
                </View>
                <View style={styles.appointmentDetails}>
                  <Text style={styles.appointmentDate}>
                    📅 {stats.nextAppointment.date}
                  </Text>
                  <Text style={styles.appointmentTime}>
                    🕐 {stats.nextAppointment.time}
                  </Text>
                </View>
                <MedicalButton
                  title="Join Call"
                  variant="primary"
                  size="medium"
                  icon="📹"
                  onPress={() => navigation.navigate('VideoCall' as never)}
                  style={styles.joinButton}
                />
              </GlassCard>
            </View>
          )}

          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {stats.recentAppointments.map((appointment, index) => (
              <Animated.View
                key={appointment.id}
                entering={FadeInUp.delay(index * 100)}
              >
                <GlassCard style={styles.activityCard}>
                  <View style={styles.activityIcon}>
                    <Text style={styles.activityIconText}>
                      {appointment.status === 'completed' ? '✅' : '📅'}
                    </Text>
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>
                      {appointment.doctorName}
                    </Text>
                    <Text style={styles.activitySubtitle}>
                      {appointment.type} • {appointment.date}
                    </Text>
                    <Text style={styles.activityTime}>
                      {appointment.time}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    {
                      backgroundColor: appointment.status === 'completed'
                        ? colors.success + '20'
                        : colors.primary + '20'
                    }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      {
                        color: appointment.status === 'completed'
                          ? colors.success
                          : colors.primary
                      }
                    ]}>
                      {appointment.status}
                    </Text>
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
          </View>

          {/* Emergency Button */}
          <View style={styles.emergencySection}>
            <MedicalButton
              title="Emergency Assistance"
              variant="emergency"
              size="large"
              icon="🚨"
              onPress={handleEmergency}
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body.size,
    color: colors.gray[600],
    fontWeight: '500',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  headerOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.lg,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: typography.caption.size,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: typography.h2.size,
    fontWeight: typography.h2.weight,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  patientIdBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  patientIdText: {
    fontSize: typography.small.size,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h3.size,
    fontWeight: typography.h3.weight,
    color: colors.gray[900],
  },
  viewAllText: {
    fontSize: typography.caption.size,
    color: colors.primary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCardWrapper: {
    width: (width - spacing.xl * 2 - spacing.lg) / 2,
    marginBottom: spacing.lg,
  },
  actionCard: {
    padding: spacing.lg,
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    backgroundColor: '#FFFFFF',
    ...shadows.md,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: typography.small.size,
    color: colors.gray[600],
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statIconText: {
    fontSize: 24,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.caption.size,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  statSubLabel: {
    fontSize: typography.small.size,
    color: colors.gray[600],
  },
  appointmentCard: {
    padding: spacing.xl,
  },
  appointmentHeader: {
    marginBottom: spacing.md,
  },
  appointmentDoctor: {
    fontSize: typography.h3.size,
    fontWeight: typography.h3.weight,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  appointmentType: {
    fontSize: typography.caption.size,
    color: colors.primary,
    fontWeight: '600',
  },
  appointmentDetails: {
    marginBottom: spacing.lg,
  },
  appointmentDate: {
    fontSize: typography.body.size,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  appointmentTime: {
    fontSize: typography.body.size,
    color: colors.gray[700],
  },
  joinButton: {
    marginTop: spacing.md,
  },
  activityCard: {
    flexDirection: 'row',
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  activitySubtitle: {
    fontSize: typography.caption.size,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  activityTime: {
    fontSize: typography.small.size,
    color: colors.gray[500],
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  statusText: {
    fontSize: typography.small.size,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emergencySection: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});

export default DashboardScreenNew;