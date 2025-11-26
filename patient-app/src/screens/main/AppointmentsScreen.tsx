import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { GlassCard } from '../../components/GlassCard';
import { MedicalButton } from '../../components/MedicalButton';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';
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
    const palette = appointmentGradients[index % appointmentGradients.length] || appointmentGradients[0];
    const isUpcoming = appointment.status === 'confirmed' || appointment.status === 'scheduled';

    return (
      <Animated.View key={appointment.id} entering={FadeInUp.delay(index * 80)} style={styles.cardWrapper}>
        <LinearGradient colors={palette as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.unifiedAppointmentCard}>
          <View style={styles.appointmentCardTopRow}>
            <View style={styles.appointmentAvatar}>
              <Text style={styles.appointmentAvatarInitials}>
                {appointment.doctorName.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.appointmentBadgeRow}>
              <View style={[styles.appointmentStatusBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={styles.appointmentStatusText}>
                  {getStatusIcon(appointment.status)} {appointment.status}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.appointmentDoctorName}>{appointment.doctorName}</Text>
          <Text style={styles.appointmentSpecialty}>{appointment.doctorSpecialty}</Text>
          <Text style={styles.appointmentType}>{appointment.type}</Text>

          <View style={styles.appointmentDetailsRow}>
            <View style={styles.appointmentDetailItem}>
              <Icon name="calendar-today" size={18} color="#fff" />
              <Text style={styles.appointmentDetailText}>{appointment.date}</Text>
            </View>
            <View style={styles.appointmentDetailItem}>
              <Icon name="schedule" size={18} color="#fff" />
              <Text style={styles.appointmentDetailText}>{appointment.time}</Text>
            </View>
          </View>

          {appointment.notes && (
            <View style={styles.appointmentNotesContainer}>
              <Text style={styles.appointmentNotesText}>{appointment.notes}</Text>
            </View>
          )}

          {isUpcoming && (
            <View style={styles.appointmentActions}>
              <TouchableOpacity 
                style={styles.appointmentOutlineButton} 
                onPress={() => handleReschedule(appointment)}
              >
                <Text style={styles.appointmentOutlineText}>Reschedule</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.appointmentPrimaryButton} 
                onPress={() => handleAppointmentPress(appointment)}
              >
                <Icon name="videocam" size={18} color="#111" />
                <Text style={styles.appointmentPrimaryText}>Join Call</Text>
              </TouchableOpacity>
            </View>
          )}

          {!isUpcoming && (
            <View style={styles.appointmentActions}>
              <TouchableOpacity 
                style={styles.appointmentCancelButton} 
                onPress={() => handleCancel(appointment)}
              >
                <Text style={styles.appointmentCancelText}>View Details</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#f97316', '#fb7185']} style={styles.heroCard}>
        <Text style={styles.heroGreeting}>{getGreeting()}!</Text>
        <Text style={styles.heroLabel}>Care timeline</Text>
        {upcomingAppointment ? (
          <>
            <Text style={styles.heroDoctor}>{upcomingAppointment.doctorName}</Text>
            <Text style={styles.heroMeta}>
              {upcomingAppointment.date} · {upcomingAppointment.time}
            </Text>
            <View style={styles.heroTags}>
              <View style={styles.heroTag}>
                <Icon name="videocam" size={16} color="#fff" />
                <Text style={styles.heroTagText}>Video session</Text>
              </View>
              <View style={styles.heroTag}>
                <Icon name="done" size={16} color="#fff" />
                <Text style={styles.heroTagText}>Confirmed</Text>
              </View>
            </View>
            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.heroOutlineButton} onPress={() => handleReschedule(upcomingAppointment)}>
                <Text style={styles.heroOutlineText}>Reschedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroPrimaryButton} onPress={() => handleAppointmentPress(upcomingAppointment)}>
                <Icon name="play-circle" size={18} color="#111" />
                <Text style={styles.heroPrimaryText}>Join call</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.heroDoctor}>No sessions planned</Text>
            <Text style={styles.heroMeta}>Book an appointment to stay on track</Text>
            <MedicalButton
              title="Book appointment"
              onPress={() => navigation.navigate('Doctors' as never)}
              variant="primary"
              size="medium"
              style={styles.bookButton}
            />
          </>
        )}
      </LinearGradient>

      <View style={styles.filterRow}>
        {(['upcoming', 'completed', 'cancelled'] as const).map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterChipText, activeFilter === filter && styles.filterChipTextActive]}>
              {filter === 'upcoming' ? 'Upcoming' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.timelineCard}>
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineTitle}>Weekly overview</Text>
          <Text style={styles.timelineSubtitle}>{appointments.length} total sessions</Text>
        </View>
        {appointments.slice(0, 4).map(item => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineDetails}>
              <Text style={styles.timelineDate}>{item.date}</Text>
              <Text style={styles.timelineDoctor}>{item.doctorName}</Text>
              <Text style={styles.timelineMeta}>{item.time} • {item.type}</Text>
            </View>
            <Text style={[styles.timelineStatus, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        ))}
      </View>

      {activeFilter === 'upcoming' && filteredAppointments.length > 0 && (
        <View style={styles.upcomingSection}>
          <View style={styles.upcomingHeader}>
            <View>
              <Text style={styles.upcomingTitle}>Upcoming Sessions</Text>
              <Text style={styles.upcomingSubtitle}>Your next appointments</Text>
            </View>
            <View style={styles.upcomingCountBadge}>
              <Text style={styles.upcomingCount}>{filteredAppointments.length}</Text>
            </View>
          </View>
          {filteredAppointments.map((appointment, index) => (
            <Animated.View key={appointment.id} entering={FadeInUp.delay(index * 100)}>
              {renderAppointmentCard(appointment, index)}
            </Animated.View>
          ))}
        </View>
      )}

      {activeFilter !== 'upcoming' && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeFilter === 'completed' ? 'Completed sessions' : 'Cancelled sessions'}
            </Text>
            <Text style={styles.sectionCount}>{filteredAppointments.length} total</Text>
          </View>

          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🗓️</Text>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptyText}>Schedule a session to keep progress moving.</Text>
            </View>
          ) : (
            filteredAppointments.map((appointment, index) => (
              <Animated.View key={appointment.id} entering={FadeInUp.delay(index * 100)}>
                {renderAppointmentCard(appointment, index)}
              </Animated.View>
            ))
          )}
        </>
      )}

      {activeFilter === 'upcoming' && filteredAppointments.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🗓️</Text>
          <Text style={styles.emptyTitle}>No upcoming sessions</Text>
          <Text style={styles.emptyText}>Book your first appointment to get started</Text>
          <MedicalButton
            title="Book Appointment"
            onPress={() => navigation.navigate('Doctors' as never)}
            variant="primary"
            size="medium"
            style={styles.emptyBookButton}
          />
        </View>
      )}

      <View style={styles.bottomActions}>
        <MedicalButton
          title="Book new appointment"
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
  heroCard: {
    margin: spacing.xl,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.lg,
  },
  heroGreeting: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionCount: {
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
  appointmentDetailText: {
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
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  emptyTitle: {
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
