import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  experience?: number;
  rating?: number;
  reviewCount?: number;
  location?: string;
  languages?: string[];
  nextAvailable?: string;
  consultationFee?: number;
  isOnline?: boolean;
  status?: string;
  gradientPalette?: [string, string];
  index?: number;
  onViewProfile?: () => void;
  onBookNow?: () => void;
  onPress?: () => void;
  showStats?: boolean;
  showActions?: boolean;
  customMeta?: string;
  customBadge?: string;
}

const gradientPalettes: readonly [string, string][] = [
  ['#4e54c8', '#8f94fb'],
  ['#ff9966', '#ff5e62'],
  ['#36d1dc', '#5b86e5'],
  ['#f7971e', '#ffd200'],
  ['#b24592', '#f15f79'],
  ['#11998e', '#38ef7d'],
];

export const DoctorCard: React.FC<DoctorCardProps> = ({
  id,
  name,
  specialty,
  experience,
  rating,
  reviewCount,
  location,
  languages = [],
  nextAvailable,
  consultationFee,
  isOnline = false,
  status,
  gradientPalette,
  index = 0,
  onViewProfile,
  onBookNow,
  onPress,
  showStats = true,
  showActions = true,
  customMeta,
  customBadge,
}) => {
  const palette = gradientPalette || gradientPalettes[index % gradientPalettes.length] || gradientPalettes[0];

  const getLastSeen = () => {
    if (isOnline) return null;
    const hours = [1, 2, 3, 5, 8, 12, 24];
    const randomHour = hours[Math.floor(Math.random() * hours.length)];
    return `Last seen ${randomHour}h ago`;
  };

  const getBadgeText = () => {
    if (customBadge) return customBadge;
    if (status) return status;
    return isOnline ? 'Online now' : getLastSeen() || 'Offline';
  };

  const getMetaText = () => {
    if (customMeta) return customMeta;
    if (experience && location && isOnline) {
      return `${experience} yrs experience • ${location}`;
    }
    if (experience) return `${experience} yrs experience`;
    if (location) return location;
    return '';
  };

  return (
    <Animated.View
      key={id}
      entering={FadeInUp.delay((index * 60))}
      style={styles.doctorCardWrapper}
    >
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={palette as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.unifiedCard}
        >
          <View style={styles.cardTopRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>
                {name.split(' ').map(n => n[0]).join('')}
              </Text>
              {isOnline && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.badgeRow}>
              <View style={[styles.doctorBadge, isOnline && styles.onlineBadge]}>
                <Text style={styles.badgeText}>{getBadgeText()}</Text>
              </View>
              {rating && (
                <Text style={styles.ratingChip}>⭐ {rating}</Text>
              )}
            </View>
          </View>

          <Text style={styles.doctorName}>{name}</Text>
          <Text style={styles.doctorSpecialty}>{specialty}</Text>
          {getMetaText() && (
            <Text style={styles.doctorMeta}>{getMetaText()}</Text>
          )}

          {languages.length > 0 && (
            <View style={styles.languageRow}>
              {languages.slice(0, 3).map(lang => (
                <View key={lang} style={styles.languageChip}>
                  <Text style={styles.languageText}>{lang}</Text>
                </View>
              ))}
            </View>
          )}

          {showStats && (nextAvailable || consultationFee) && (
            <View style={styles.doctorStats}>
              {nextAvailable && (
                <View style={styles.statItem}>
                  <Icon name="event-available" size={18} color="#fff" />
                  <Text style={styles.statLabelWhite}>{nextAvailable}</Text>
                </View>
              )}
              {consultationFee && (
                <View style={styles.statItem}>
                  <Icon name="paid" size={18} color="#fff" />
                  <Text style={styles.statLabelWhite}>${consultationFee}/session</Text>
                </View>
              )}
            </View>
          )}

          {showActions && (
            <View style={styles.cardActions}>
              {onViewProfile && (
                <TouchableOpacity
                  style={styles.outlineButtonWhite}
                  onPress={onViewProfile}
                >
                  <Text style={styles.outlineButtonTextWhite}>View profile</Text>
                </TouchableOpacity>
              )}
              {onBookNow && (
                <TouchableOpacity
                  style={styles.bookButtonSolid}
                  onPress={onBookNow}
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  doctorCardWrapper: {
    marginBottom: spacing.lg,
  },
  cardTouchable: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
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
});