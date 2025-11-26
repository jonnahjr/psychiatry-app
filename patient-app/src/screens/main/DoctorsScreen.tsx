import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { GlassCard } from '../../components/GlassCard';
import { MedicalButton } from '../../components/MedicalButton';
import { DoctorCard } from '../../components/DoctorCard';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewCount: number;
  location: string;
  availability: string[];
  languages: string[];
  education: string;
  bio: string;
  image?: string;
  isOnline: boolean;
  consultationFee: number;
  nextAvailable: string;
}

interface FilterState {
  specialty: string;
  location: string;
  availability: string;
  language: string;
  minRating: number;
  maxFee: number;
}

const DoctorsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeQuickFilter, setActiveQuickFilter] = useState<'all' | 'online' | 'topRated' | 'budget'>('all');

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Abebe Tadesse',
      specialty: 'Clinical Psychologist',
      experience: 12,
      rating: 4.9,
      reviewCount: 247,
      location: 'Addis Ababa, Ethiopia',
      availability: ['Mon', 'Wed', 'Fri'],
      languages: ['Amharic', 'English'],
      education: 'PhD Psychology, Addis Ababa University',
      bio: 'Specialized in anxiety disorders, depression, and cognitive behavioral therapy with over 10 years of experience.',
      isOnline: true,
      consultationFee: 150,
      nextAvailable: 'Today 2:00 PM',
    },
    {
      id: '2',
      name: 'Dr. Mekdes Haile',
      specialty: 'Psychiatrist',
      experience: 15,
      rating: 4.8,
      reviewCount: 189,
      location: 'Addis Ababa, Ethiopia',
      availability: ['Tue', 'Thu', 'Sat'],
      languages: ['Amharic', 'English', 'Oromo'],
      education: 'MD Psychiatry, Addis Ababa University',
      bio: 'Board-certified psychiatrist specializing in medication management and psychotherapy for mental health conditions.',
      isOnline: false,
      consultationFee: 200,
      nextAvailable: 'Tomorrow 10:00 AM',
    },
    {
      id: '3',
      name: 'Dr. Yohannes Bekele',
      specialty: 'Therapist',
      experience: 8,
      rating: 4.7,
      reviewCount: 156,
      location: 'Dire Dawa, Ethiopia',
      availability: ['Mon', 'Tue', 'Wed', 'Thu'],
      languages: ['Amharic', 'English', 'Tigrinya'],
      education: 'MS Counseling, Addis Ababa University',
      bio: 'Licensed therapist focusing on trauma-informed care, couples counseling, and mindfulness-based interventions.',
      isOnline: true,
      consultationFee: 120,
      nextAvailable: 'Today 4:30 PM',
    },
    {
      id: '4',
      name: 'Dr. Selam Assefa',
      specialty: 'Clinical Psychologist',
      experience: 10,
      rating: 4.9,
      reviewCount: 203,
      location: 'Hawassa, Ethiopia',
      availability: ['Mon', 'Wed', 'Fri', 'Sat'],
      languages: ['Amharic', 'English', 'Sidama'],
      education: 'PhD Clinical Psychology, Addis Ababa University',
      bio: 'Specialized in multicultural psychology, trauma recovery, and evidence-based treatments for mental health.',
      isOnline: true,
      consultationFee: 160,
      nextAvailable: 'Today 3:15 PM',
    },
    {
      id: '5',
      name: 'Dr. Hana Kebede',
      specialty: 'Family Therapist',
      experience: 9,
      rating: 4.8,
      reviewCount: 142,
      location: 'Bahir Dar, Ethiopia',
      availability: ['Tue', 'Thu', 'Sat'],
      languages: ['Amharic', 'English'],
      education: 'MS Family Therapy, Bahir Dar University',
      bio: 'Focused on family systems, youth counseling, and conflict resolution with culturally rooted approaches.',
      isOnline: true,
      consultationFee: 140,
      nextAvailable: 'Thu 11:00 AM',
    },
    {
      id: '6',
      name: 'Dr. Dawit Lemma',
      specialty: 'Addiction Specialist',
      experience: 14,
      rating: 4.9,
      reviewCount: 178,
      location: 'Gondar, Ethiopia',
      availability: ['Mon', 'Tue', 'Fri'],
      languages: ['Amharic', 'English', 'Oromo'],
      education: 'MD Psychiatry, University of Gondar',
      bio: 'Helps patients navigate substance-use recovery with integrated medical and behavioral programs.',
      isOnline: false,
      consultationFee: 180,
      nextAvailable: 'Fri 9:30 AM',
    },
  ];

  const gradientPalettes: readonly [string, string][] = [
    ['#4e54c8', '#8f94fb'],
    ['#ff9966', '#ff5e62'],
    ['#36d1dc', '#5b86e5'],
    ['#f7971e', '#ffd200'],
    ['#b24592', '#f15f79'],
    ['#11998e', '#38ef7d'],
  ];

  const specialties = ['All', 'Psychiatry', 'Therapy', 'Couples', 'Teens', 'Addiction', 'Veterans'];
  const quickFilters = [
    { id: 'all', label: 'All doctors', icon: 'groups' },
    { id: 'online', label: 'Online now', icon: 'wifi' },
    { id: 'topRated', label: 'Top rated', icon: 'star' },
    { id: 'budget', label: 'Under $150', icon: 'attach-money' },
  ] as const;

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === 'All' || doctor.specialty.toLowerCase().includes(activeCategory.toLowerCase());

      const matchesQuickFilter =
        activeQuickFilter === 'all' ||
        (activeQuickFilter === 'online' && doctor.isOnline) ||
        (activeQuickFilter === 'topRated' && doctor.rating >= 4.8) ||
        (activeQuickFilter === 'budget' && doctor.consultationFee <= 150);

      return matchesSearch && matchesCategory && matchesQuickFilter;
    });
  }, [doctors, searchQuery, activeCategory, activeQuickFilter]);

  const handleBookAppointment = (doctor: Doctor) => {
    Alert.alert(
      'Book Appointment',
      `Book a session with ${doctor.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book Now',
          onPress: () => {
            // Navigate to Appointments screen for booking
            (navigation as any).navigate('Appointments');
          }
        },
      ]
    );
  };

  const handleViewProfile = (doctor: Doctor) => {
    Alert.alert(
      'Doctor Profile',
      `${doctor.name}\n\n${doctor.specialty}\n${doctor.experience} years experience\n⭐ ${doctor.rating} (${doctor.reviewCount} reviews)\n\nEducation: ${doctor.education}\n\n${doctor.bio}\n\nLanguages: ${doctor.languages.join(', ')}\n\nConsultation Fee: $${doctor.consultationFee}/session\nNext Available: ${doctor.nextAvailable}`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Book Appointment',
          onPress: () => handleBookAppointment(doctor)
        }
      ]
    );
  };

  const renderDoctorCard = (doctor: Doctor, index: number) => (
    <DoctorCard
      key={doctor.id}
      id={doctor.id}
      name={doctor.name}
      specialty={doctor.specialty}
      experience={doctor.experience}
      rating={doctor.rating}
      reviewCount={doctor.reviewCount}
      location={doctor.location}
      languages={doctor.languages}
      nextAvailable={doctor.nextAvailable}
      consultationFee={doctor.consultationFee}
      isOnline={doctor.isOnline}
      index={index}
      onViewProfile={() => handleViewProfile(doctor)}
      onBookNow={() => handleBookAppointment(doctor)}
    />
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
    >
      <LinearGradient colors={['#4c6ef5', '#6c5ce7']} style={styles.heroCard}>
        <View>
          <Text style={styles.heroSubtitle}>Your care team</Text>
          <Text style={styles.heroTitle}>Handpicked specialists for you</Text>
          <Text style={styles.heroDescription}>
            Browse licensed psychiatrists, therapists, and counselors that match your needs.
          </Text>
        </View>
        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatChip}>
            <Text style={styles.heroStatLabel}>Available today</Text>
            <Text style={styles.heroStatValue}>12 doctors</Text>
          </View>
          <View style={styles.heroStatChip}>
            <Text style={styles.heroStatLabel}>Avg. rating</Text>
            <Text style={styles.heroStatValue}>4.8 / 5</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.searchCard}>
        <Icon name="search" size={20} color={colors.gray[500]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, specialty, symptom..."
          placeholderTextColor={colors.gray[400]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterPill}>
          <Icon name="tune" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickFiltersRow}>
        {quickFilters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.quickFilterChip,
              activeQuickFilter === filter.id && styles.quickFilterChipActive,
            ]}
            onPress={() => setActiveQuickFilter(filter.id)}
          >
            <Icon
              name={filter.icon}
              size={16}
              color={activeQuickFilter === filter.id ? '#fff' : colors.gray[600]}
            />
            <Text
              style={[
                styles.quickFilterText,
                activeQuickFilter === filter.id && styles.quickFilterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Focus areas</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {specialties.map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, activeCategory === category && styles.categoryChipActive]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <Text style={styles.resultsCount}>{filteredDoctors.length} specialists</Text>
        </View>
        {filteredDoctors.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🩺</Text>
            <Text style={styles.emptyTitle}>No matches right now</Text>
            <Text style={styles.emptyDescription}>
              Try a different specialty or reset your filters to see more clinicians.
            </Text>
          </View>
        ) : (
          filteredDoctors.map(renderDoctorCard)
        )}
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
    paddingBottom: spacing.xxl,
    ...shadows.md,
  },
  heroSubtitle: {
    color: '#cfd7ff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: spacing.sm,
  },
  heroDescription: {
    color: '#f5f7ff',
    fontSize: 14,
    lineHeight: 20,
  },
  heroStatsRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  heroStatChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  heroStatLabel: {
    color: '#cfd7ff',
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  heroStatValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchCard: {
    marginHorizontal: spacing.xl,
    marginTop: -spacing.xxl,
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.md,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: spacing.sm,
    color: colors.gray[900],
    fontSize: 15,
  },
  filterPill: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    padding: spacing.sm,
  },
  quickFiltersRow: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  quickFilterChipActive: {
    backgroundColor: colors.primary,
  },
  quickFilterText: {
    fontSize: 13,
    color: colors.gray[700],
    fontWeight: '500',
  },
  quickFilterTextActive: {
    color: '#fff',
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[900],
  },
  viewAllText: {
    color: colors.primary,
    fontWeight: '600',
  },
  categoriesRow: {
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.gray[900],
  },
  categoryText: {
    color: colors.gray[600],
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  resultsCount: {
    color: colors.gray[500],
    fontSize: 13,
  },
  doctorCardWrapper: {
    marginBottom: spacing.lg,
  },
  unifiedCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.lg,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeRow: {
    alignItems: 'flex-end',
  },
  doctorBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  onlineBadge: {
    backgroundColor: 'rgba(34,197,94,0.2)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  ratingChip: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: spacing.sm,
  },
  doctorSpecialty: {
    color: '#fff',
    fontWeight: '600',
    marginTop: spacing.xs,
    fontSize: 14,
  },
  doctorMeta: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
    fontSize: 13,
  },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  languageChip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  languageText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  doctorStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statLabel: {
    fontSize: 13,
    color: colors.gray[600],
  },
  statLabelWhite: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: colors.gray[700],
    fontWeight: '600',
  },
  outlineButtonWhite: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  outlineButtonTextWhite: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  bookButtonSolid: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  bookButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  bookBtn: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
});

export default DoctorsScreen;
