import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { GlassCard } from '../../components/GlassCard';
import { MedicalButton } from '../../components/MedicalButton';
import { colors, typography, spacing, borderRadius } from '../../utils/theme';

const { width } = Dimensions.get('window');

interface MoodEntry {
  date: string;
  mood: number; // 1-5 scale
  note?: string;
  day: string;
}

const MoodTrackerScreen = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [weeklyData, setWeeklyData] = useState<MoodEntry[]>([
    { date: '2024-01-15', mood: 4, day: 'Mon' },
    { date: '2024-01-16', mood: 3, day: 'Tue' },
    { date: '2024-01-17', mood: 5, day: 'Wed' },
    { date: '2024-01-18', mood: 2, day: 'Thu' },
    { date: '2024-01-19', mood: 4, day: 'Fri' },
    { date: '2024-01-20', mood: 3, day: 'Sat' },
    { date: '2024-01-21', mood: 4, day: 'Sun' },
  ]);

  const moodEmojis = ['😢', '😐', '🙂', '😊', '😄'];
  const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
  };

  const handleSaveMood = () => {
    if (selectedMood) {
      // In a real app, this would save to backend
      console.log('Mood saved:', selectedMood);
      setSelectedMood(null);
    }
  };

  const getMoodColor = (mood: number) => {
    const colors = [
      '#EF4444', // Very Low - Red
      '#F59E0B', // Low - Orange
      '#6B7280', // Neutral - Gray
      '#10B981', // Good - Green
      '#06B6D4', // Excellent - Cyan
    ];
    return colors[mood - 1] || colors[2];
  };

  const getMaxMood = () => Math.max(...weeklyData.map(d => d.mood));

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeIn} style={styles.header}>
          <Text style={styles.title}>Mood Tracker</Text>
          <Text style={styles.subtitle}>Track your emotional wellness journey</Text>
        </Animated.View>

        {/* Today's Mood Input */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <GlassCard style={styles.moodInputCard}>
            <Text style={styles.sectionTitle}>How are you feeling today?</Text>
            <View style={styles.moodSelector}>
              {moodEmojis.map((emoji, index) => {
                const moodValue = index + 1;
                const isSelected = selectedMood === moodValue;

                return (
                  <TouchableOpacity
                    key={moodValue}
                    style={[
                      styles.moodOption,
                      isSelected && { backgroundColor: getMoodColor(moodValue) + '20' }
                    ]}
                    onPress={() => handleMoodSelect(moodValue)}
                  >
                    <Text style={styles.moodEmoji}>{emoji}</Text>
                    <Text style={[
                      styles.moodLabel,
                      isSelected && { color: getMoodColor(moodValue) }
                    ]}>
                      {moodLabels[index]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedMood && (
              <Animated.View entering={FadeIn} style={styles.saveSection}>
                <MedicalButton
                  title="Save Today's Mood"
                  onPress={handleSaveMood}
                  variant="primary"
                  size="medium"
                />
              </Animated.View>
            )}
          </GlassCard>
        </Animated.View>

        {/* Weekly Chart */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
          <GlassCard style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Weekly Mood Trends</Text>
            <View style={styles.chartContainer}>
              {weeklyData.map((day, index) => {
                const maxMood = getMaxMood();
                const barHeight = (day.mood / maxMood) * 120;

                return (
                  <Animated.View
                    key={day.date}
                    entering={FadeInUp.delay(index * 100)}
                    style={styles.chartBar}
                  >
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                          backgroundColor: getMoodColor(day.mood)
                        }
                      ]}
                    />
                    <Text style={styles.dayLabel}>{day.day}</Text>
                    <Text style={styles.moodValue}>{day.mood}</Text>
                  </Animated.View>
                );
              })}
            </View>

            <View style={styles.legend}>
              {moodEmojis.map((emoji, index) => (
                <View key={index} style={styles.legendItem}>
                  <Text style={styles.legendEmoji}>{emoji}</Text>
                  <Text style={styles.legendText}>{moodLabels[index]}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Mood Insights */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.section}>
          <GlassCard style={styles.insightsCard}>
            <Text style={styles.sectionTitle}>Weekly Insights</Text>

            <View style={styles.insight}>
              <Text style={styles.insightIcon}>📈</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Improving Trend</Text>
                <Text style={styles.insightText}>
                  Your mood has been trending upward this week
                </Text>
              </View>
            </View>

            <View style={styles.insight}>
              <Text style={styles.insightIcon}>🎯</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Consistency</Text>
                <Text style={styles.insightText}>
                  You've logged your mood for 7 consecutive days
                </Text>
              </View>
            </View>

            <View style={styles.insight}>
              <Text style={styles.insightIcon}>💪</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Strength</Text>
                <Text style={styles.insightText}>
                  Your average mood score is above average
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(800)} style={styles.section}>
          <View style={styles.actionsGrid}>
            <MedicalButton
              title="View History"
              onPress={() => {/* Navigate to history */}}
              variant="secondary"
              size="medium"
              icon="📚"
            />
            <MedicalButton
              title="Share Progress"
              onPress={() => {/* Share functionality */}}
              variant="secondary"
              size="medium"
              icon="📤"
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h1.size,
    fontWeight: typography.h1.weight,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.caption.size,
    color: colors.gray[600],
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.h3.size,
    fontWeight: typography.h3.weight,
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  moodInputCard: {
    padding: spacing.xl,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  moodOption: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 70,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    fontSize: typography.small.size,
    color: colors.gray[600],
    textAlign: 'center',
    fontWeight: '500',
  },
  saveSection: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  chartCard: {
    padding: spacing.xl,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  bar: {
    width: 32,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    minHeight: 8,
  },
  dayLabel: {
    fontSize: typography.small.size,
    color: colors.gray[600],
    fontWeight: '500',
  },
  moodValue: {
    fontSize: typography.small.size,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendEmoji: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  legendText: {
    fontSize: typography.small.size,
    color: colors.gray[600],
  },
  insightsCard: {
    padding: spacing.xl,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  insightText: {
    fontSize: typography.caption.size,
    color: colors.gray[600],
    lineHeight: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});

export default MoodTrackerScreen;