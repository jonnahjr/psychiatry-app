import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface MoodOption {
  id: string;
  label: string;
  icon: string;
  color: string[];
  emoji: string;
}

const moodOptions: MoodOption[] = [
  { id: 'excellent', label: 'Excellent', icon: 'sentiment-very-satisfied', color: ['#10b981', '#059669'], emoji: '😄' },
  { id: 'good', label: 'Good', icon: 'sentiment-satisfied', color: ['#3b82f6', '#2563eb'], emoji: '😊' },
  { id: 'okay', label: 'Okay', icon: 'sentiment-neutral', color: ['#f59e0b', '#d97706'], emoji: '😐' },
  { id: 'poor', label: 'Poor', icon: 'sentiment-dissatisfied', color: ['#f97316', '#ea580c'], emoji: '😔' },
  { id: 'bad', label: 'Bad', icon: 'sentiment-very-dissatisfied', color: ['#ef4444', '#dc2626'], emoji: '😢' },
];

interface MoodTrackerProps {
  onMoodSelected?: (mood: string) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodSelected }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    onMoodSelected?.(moodId);
  };

  const renderMoodItem = (mood: MoodOption) => {
    const isSelected = selectedMood === mood.id;

    return (
      <View key={mood.id} style={styles.moodItemContainer}>
        <TouchableOpacity
          style={styles.moodItem}
          onPress={() => handleMoodSelect(mood.id)}
          activeOpacity={0.9}
        >
          {isSelected ? (
            <LinearGradient
              colors={mood.color as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.moodGradient}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Icon name={mood.icon} size={24} color="#ffffff" />
              <Text style={styles.moodLabelSelected}>{mood.label}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.moodDefault}>
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Icon name={mood.icon} size={24} color={mood.color[0]} />
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.moodGrid}>
        {moodOptions.map(renderMoodItem)}
      </View>
      {selectedMood && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedText}>
            Thank you for sharing! Your mood has been recorded.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodItemContainer: {
    width: (width - 80) / 3,
    marginBottom: 15,
  },
  moodItem: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  moodDefault: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 15,
    minHeight: 100,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  moodLabelSelected: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  selectedText: {
    fontSize: 14,
    color: '#065f46',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default MoodTracker;

