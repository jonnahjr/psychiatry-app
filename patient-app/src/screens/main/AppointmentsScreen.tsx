import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInUp, SlideInRight } from 'react-native-reanimated';
import { GlassCard } from '../../components/GlassCard';
import { MedicalButton } from '../../components/MedicalButton';
import { DoctorCard } from '../../components/DoctorCard';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';
import { useAuth } from '../../contexts/AuthContext';
import { getGreeting } from '../../utils/time';

interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  type: string;
  notes?: string;
  location?: string;
}

const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const appointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dr. Abebe Tadesse',
      doctorSpecialty: 'Clinical Psychologist',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'confirmed',
      type: 'Therapy Session',
      notes: 'Initial consultation for anxiety management',
    },
    {
      id: '2',
      doctorName: 'Dr. Mekdes Haile',
      doctorSpecialty: 'Psychiatrist',
      date: '2024-01-15',
      time: '2:30 PM',
      status: 'completed',
      type: 'Follow-up',
      notes: 'Medication adjustment discussion',
    },
    {
      id: '3',
      doctorName: 'Dr. Yohannes Bekele',
      doctorSpecialty: 'Therapist',
      date: '2024-01-10',
      time: '11:00 AM',
      status: 'completed',
      type: 'Group Therapy',
      notes: 'Weekly support group session',
    },
  ];

  const upcomingAppointment = useMemo(
    () => appointments.find(apt => apt.status === 'confirmed' || apt.status === 'scheduled'),
    [appointments],
  );

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      if (activeFilter === 'upcoming') {
        return appointment.status === 'confirmed' || appointment.status === 'scheduled';
      }
      return appointment.status === activeFilter;
    });
  }, [appointments, activeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'scheduled':
        return colors.primary;
      case 'completed':
        return colors.gray[500];
      case 'cancelled':
        return colors.error;
      default:
        return colors.gray[400];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'scheduled':
        return '📅';
      case 'completed':
        return '✓';
      case 'cancelled':
        return '✗';
      default:
        return '○';
    }
  };

  const handleAppointmentPress = (appointment: Appointment) => {
    if (appointment.status === 'confirmed') {
      Alert.alert(
        'Join Call',
        `Join your ${appointment.type} with ${appointment.doctorName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Join Video Call',
            onPress: () => navigation.navigate('VideoCall' as never)
          },
        ]
      );
    }
  };

  const handleReschedule = async (appointment: Appointment) => {
    Alert.alert(
      'Reschedule Appointment',
      `Would you like to reschedule your ${appointment.type} with ${appointment.doctorName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reschedule',
          onPress: async () => {
            try {
              // Navigate to doctors screen to select new time
              Alert.alert(
                'Reschedule Appointment',
                'Please select a new date and time from available slots.',
                [
                  { text: 'OK', onPress: () => navigation.navigate('Doctors' as never) }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Unable to reschedule. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleCancel = async (appointment: Appointment) => {
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel your ${appointment.type} with ${appointment.doctorName} on ${appointment.date}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, this would call an API to cancel
              // await apiService.cancelAppointment(appointment.id);
              Alert.alert(
                'Appointment Cancelled',
                'Your appointment has been cancelled successfully. You can book a new appointment anytime.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'Unable to cancel appointment. Please try again.');
            }
          }
        },
      ]
    );
  };

  const appointmentGradients = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#30cfd0', '#330867'],
  ];

  const renderAppointmentCard = (appointment: Appointment, index: number) => {
    const isUpcoming = appointment.status === 'confirmed' || appointment.status === 'scheduled';

    return (
      <DoctorCard
        key={appointment.id}
        id={appointment.id}
        name={appointment.doctorName}
        specialty={appointment.doctorSpecialty}
        customMeta={`${appointment.date} • ${appointment.time}`}
        customBadge={`${getStatusIcon(appointment.status)} ${appointment.status}`}
        nextAvailable={appointment.type}
        showStats={false}
        showActions={false}
        index={index}
        onPress={() => handleAppointmentPress(appointment)}
      />
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Premium Header with Personalized Greeting */}
      <View style={styles.premiumHeader}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#ec4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.greetingSection}>
              <Text style={styles.greetingText}>
                {getGreeting()}, {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : 'there'}
              </Text>
              <Text style={styles.headerSubtitle}>Your appointment dashboard</Text>
            </View>

            <View style={styles.statsOverview}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{filteredAppointments.filter(a => a.status === 'confirmed' || a.status === 'scheduled').length}</Text>
                <Text style={styles.statLabel}>Upcoming</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{filteredAppointments.filter(a => a.status === 'completed').length}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{appointments.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions Bar */}
      <View style={styles.quickActionsBar}>
        <TouchableOpacity
          style={[styles.quickActionButton, styles.primaryAction]}
          onPress={() => navigation.navigate('Doctors' as never)}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}
          >
            <Icon name="add" size={20} color="#fff" />
            <Text style={styles.actionText}>Book New</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickActionButton, styles.secondaryAction]}
          onPress={() => setActiveFilter('upcoming')}
        >
          <Icon name="schedule" size={20} color={colors.primary} />
          <Text style={styles.secondaryActionText}>Upcoming</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickActionButton, styles.secondaryAction]}
          onPress={() => setActiveFilter('completed')}
        >
          <Icon name="check-circle" size={20} color={colors.success} />
          <Text style={styles.secondaryActionText}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Next Appointment Hero Card */}
      {upcomingAppointment && (
        <Animated.View entering={SlideInRight.delay(200)} style={styles.nextAppointmentCard}>
          <LinearGradient
            colors={['#1e293b', '#334155']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.appointmentHeroGradient}
          >
            <View style={styles.appointmentHeroContent}>
              <View style={styles.appointmentHeroHeader}>
                <View style={styles.appointmentTypeBadge}>
                  <Icon name="videocam" size={16} color="#10b981" />
                  <Text style={styles.appointmentTypeText}>Video Session</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#10b981' }]}>
                  <Text style={styles.statusBadgeText}>Confirmed</Text>
                </View>
              </View>

              <Text style={styles.appointmentHeroTitle}>{upcomingAppointment.doctorName}</Text>
              <Text style={styles.appointmentHeroSubtitle}>{upcomingAppointment.doctorSpecialty}</Text>

              <View style={styles.appointmentHeroDetails}>
                <View style={styles.appointmentDetail}>
                  <Icon name="calendar-today" size={18} color="#94a3b8" />
                  <Text style={styles.appointmentDetailText}>{upcomingAppointment.date}</Text>
                </View>
                <View style={styles.appointmentDetail}>
                  <Icon name="schedule" size={18} color="#94a3b8" />
                  <Text style={styles.appointmentDetailText}>{upcomingAppointment.time}</Text>
                </View>
              </View>

              <View style={styles.appointmentHeroActions}>
                <TouchableOpacity
                  style={styles.appointmentRescheduleBtn}
                  onPress={() => handleReschedule(upcomingAppointment)}
                >
                  <Icon name="edit-calendar" size={18} color="#64748b" />
                  <Text style={styles.appointmentRescheduleText}>Reschedule</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.appointmentJoinBtn}
                  onPress={() => handleAppointmentPress(upcomingAppointment)}
                >
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.joinBtnGradient}
                  >
                    <Icon name="videocam" size={18} color="#fff" />
                    <Text style={styles.appointmentJoinText}>Join Call</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Appointments List */}
      <View style={styles.appointmentsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeFilter === 'upcoming' ? 'Upcoming Appointments' :
             activeFilter === 'completed' ? 'Session History' : 'Cancelled Sessions'}
          </Text>
          <Text style={styles.sectionCount}>
            {filteredAppointments.length} {filteredAppointments.length === 1 ? 'session' : 'sessions'}
          </Text>
        </View>

        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>
                {activeFilter === 'upcoming' ? '📅' : activeFilter === 'completed' ? '✅' : '❌'}
              </Text>
            </View>
            <Text style={styles.emptyTitle}>
              {activeFilter === 'upcoming' ? 'No upcoming sessions' :
               activeFilter === 'completed' ? 'No completed sessions yet' : 'No cancelled sessions'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'upcoming' ? 'Book your first appointment to get started on your wellness journey' :
               activeFilter === 'completed' ? 'Your completed sessions will appear here' : 'Cancelled sessions will be shown here'}
            </Text>
            {activeFilter === 'upcoming' && (
              <MedicalButton
                title="Book Appointment"
                onPress={() => navigation.navigate('Doctors' as never)}
                variant="primary"
                size="medium"
                style={styles.emptyActionButton}
              />
            )}
          </View>
        ) : (
          <View style={styles.appointmentsList}>
            {filteredAppointments.map((appointment, index) => (
              <Animated.View key={appointment.id} entering={FadeInUp.delay(index * 100)}>
                <DoctorCard
                  id={appointment.id}
                  name={appointment.doctorName}
                  specialty={appointment.doctorSpecialty}
                  customMeta={`${appointment.date} • ${appointment.time}`}
                  customBadge={`${getStatusIcon(appointment.status)} ${appointment.status}`}
                  nextAvailable={appointment.type}
                  showStats={false}
                  showActions={false}
                  index={index}
                  onPress={() => handleAppointmentPress(appointment)}
                />
              </Animated.View>
            ))}
          </View>
        )}
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <MedicalButton
          title="Schedule New Session"
          onPress={() => navigation.navigate('Doctors' as never)}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  contentContainer: {
    paddingBottom: spacing.xxl * 2,
  },

  // Premium Header Styles
  premiumHeader: {
    marginBottom: spacing.xl,
  },
  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderRadius: borderRadius.xl,
    margin: spacing.xl,
    ...shadows.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  greetingSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  statsOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: spacing.md,
  },

  // Quick Actions Bar
  quickActionsBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  primaryAction: {
    flex: 2,
  },
  secondaryAction: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  actionGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryActionText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },

  // Next Appointment Hero Card
  nextAppointmentCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  appointmentHeroGradient: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.xl,
  },
  appointmentHeroContent: {
    alignItems: 'center',
  },
  appointmentHeroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.lg,
  },
  appointmentTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  appointmentTypeText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  appointmentHeroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  appointmentHeroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  appointmentHeroDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.xl,
  },
  appointmentDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  appointmentDetailText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  appointmentHeroActions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  appointmentRescheduleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  appointmentRescheduleText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 14,
  },
  appointmentJoinBtn: {
    flex: 2,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  joinBtnGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  appointmentJoinText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },

  // Appointments Section
  appointmentsSection: {
    paddingHorizontal: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.gray[900],
  },
  sectionCount: {
    fontSize: 14,
    color: colors.gray[500],
    fontWeight: '600',
  },
  appointmentsList: {
    gap: spacing.lg,
  },

  // Enhanced Empty States
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  emptyActionButton: {
    marginTop: spacing.lg,
  },

  // Bottom CTA
  bottomCTA: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  heroCard: {
    margin: spacing.xl,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.lg,
  },
  heroLabel: {
    color: '#ffe4e6',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  heroDoctor: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  heroMeta: {
    color: '#ffe4e6',
    marginTop: spacing.xs,
  },
  heroTags: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  heroTagText: {
    color: '#fff',
    fontSize: 12,
  },
  heroActions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  heroOutlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  heroOutlineText: {
    color: '#fff',
    fontWeight: '600',
  },
  heroPrimaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  heroPrimaryText: {
    color: '#111',
    fontWeight: '700',
  },
  bookButton: {
    marginTop: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
  },
  filterChip: {
    flex: 1,
    backgroundColor: colors.gray[100],
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: colors.gray[900],
  },
  filterChipText: {
    color: colors.gray[600],
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  timelineCard: {
    margin: spacing.xl,
    marginTop: spacing.lg,
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  timelineHeader: {
    marginBottom: spacing.md,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  timelineSubtitle: {
    color: colors.gray[500],
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
  },
  timelineDetails: {
    flex: 1,
  },
  timelineDate: {
    fontWeight: '600',
    color: colors.gray[900],
  },
  timelineDoctor: {
    color: colors.gray[700],
  },
  timelineMeta: {
    color: colors.gray[500],
    fontSize: 12,
  },
  timelineStatus: {
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  upcomingSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  upcomingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[900],
  },
  upcomingSubtitle: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  upcomingCountBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingCount: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  oldSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  oldSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  oldSectionCount: {
    color: colors.gray[500],
  },
  emptyBookButton: {
    marginTop: spacing.lg,
  },
  cardWrapper: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  unifiedAppointmentCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.lg,
    minHeight: 240, // Match doctor card height
  },
  appointmentCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appointmentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentAvatarInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  appointmentBadgeRow: {
    alignItems: 'flex-end',
  },
  appointmentStatusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  appointmentStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  appointmentDoctorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: spacing.sm,
  },
  appointmentSpecialty: {
    color: '#fff',
    fontWeight: '600',
    marginTop: spacing.xs,
    fontSize: 14,
  },
  appointmentType: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
    fontSize: 13,
  },
  appointmentDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  appointmentDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  oldAppointmentDetailText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  appointmentNotesContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  appointmentNotesText: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
  },
  appointmentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  appointmentOutlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  appointmentOutlineText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  appointmentPrimaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  appointmentPrimaryText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  appointmentCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  appointmentCancelText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  oldEmptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  oldEmptyIcon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  oldEmptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  emptyText: {
    color: colors.gray[500],
    textAlign: 'center',
  },
  bottomActions: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
});

export default AppointmentsScreen;
