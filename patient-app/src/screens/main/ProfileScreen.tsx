import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api.service';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/GlassCard';
import { MedicalButton } from '../../components/MedicalButton';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';
import { getGreeting } from '../../utils/time';

const ProfileScreen = () => {
  const { user, logout, healthMetrics } = useAuth();
  const navigation = useNavigation();
  const loadingMetrics = !healthMetrics; // Loading if no metrics available

  // Provide fallback values if metrics are not available
  const metrics = healthMetrics || {
    sessions: 0,
    wellnessScore: 75,
    journalEntries: 0,
    prescriptions: 0,
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

  const handleNavigateToSettings = () => {
    navigation.navigate('Settings' as never);
  };


  return (
    <ScrollView style={professionalProfileStyles.container} showsVerticalScrollIndicator={false}>
      {/* Professional Header */}
      <View style={professionalProfileStyles.header}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={professionalProfileStyles.headerGradient}
        >
          <View style={professionalProfileStyles.headerContent}>
            <View style={professionalProfileStyles.avatarSection}>
              <View style={professionalProfileStyles.avatarContainer}>
                <Image
                  source={require('../../assets/D11.png')}
                  style={professionalProfileStyles.avatar}
                />
                <View style={professionalProfileStyles.verifiedBadge}>
                  <MaterialIcons name="verified" size={16} color="#10b981" />
                </View>
              </View>
            </View>

            <View style={professionalProfileStyles.userInfo}>
              <Text style={professionalProfileStyles.greeting}>{getGreeting()}!</Text>
              <Text style={professionalProfileStyles.userName}>
                {user?.name || 'John Doe'}
              </Text>
              <Text style={professionalProfileStyles.userRole}>Patient</Text>
              <Text style={professionalProfileStyles.patientId}>
                ID: {user?.patientId || 'P000001'}
              </Text>
            </View>

            <TouchableOpacity style={professionalProfileStyles.settingsButton} onPress={handleNavigateToSettings}>
              <MaterialIcons name="settings" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Health Overview Cards */}
      <View style={professionalProfileStyles.healthOverview}>
        <Text style={professionalProfileStyles.sectionTitle}>Health Overview</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={professionalProfileStyles.metricsHorizontalScroll}
        >
          <View style={professionalProfileStyles.metricCardCompact}>
            <View style={[professionalProfileStyles.metricIconCompact, { backgroundColor: '#667eea20' }]}>
              <MaterialIcons name="event-available" size={24} color="#667eea" />
            </View>
            <View style={professionalProfileStyles.metricContent}>
              <Text style={professionalProfileStyles.metricValueCompact}>
                {loadingMetrics ? '...' : healthMetrics.sessions}
              </Text>
              <Text style={professionalProfileStyles.metricLabelCompact}>Sessions</Text>
            </View>
          </View>

          <View style={professionalProfileStyles.metricCardCompact}>
            <View style={[professionalProfileStyles.metricIconCompact, { backgroundColor: '#10b98120' }]}>
              <MaterialIcons name="psychology" size={24} color="#10b981" />
            </View>
            <View style={professionalProfileStyles.metricContent}>
              <Text style={professionalProfileStyles.metricValueCompact}>
                {loadingMetrics ? '...' : `${healthMetrics.wellnessScore}%`}
              </Text>
              <Text style={professionalProfileStyles.metricLabelCompact}>Wellness</Text>
            </View>
          </View>

          <View style={professionalProfileStyles.metricCardCompact}>
            <View style={[professionalProfileStyles.metricIconCompact, { backgroundColor: '#f59e0b20' }]}>
              <MaterialIcons name="book" size={24} color="#f59e0b" />
            </View>
            <View style={professionalProfileStyles.metricContent}>
              <Text style={professionalProfileStyles.metricValueCompact}>
                {loadingMetrics ? '...' : healthMetrics.journalEntries}
              </Text>
              <Text style={professionalProfileStyles.metricLabelCompact}>Journal</Text>
            </View>
          </View>

          <View style={professionalProfileStyles.metricCardCompact}>
            <View style={[professionalProfileStyles.metricIconCompact, { backgroundColor: '#ef444420' }]}>
              <MaterialIcons name="medication" size={24} color="#ef4444" />
            </View>
            <View style={professionalProfileStyles.metricContent}>
              <Text style={professionalProfileStyles.metricValueCompact}>
                {loadingMetrics ? '...' : healthMetrics.prescriptions}
              </Text>
              <Text style={professionalProfileStyles.metricLabelCompact}>Prescriptions</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Recent Activity */}
      <View style={professionalProfileStyles.section}>
        <Text style={professionalProfileStyles.sectionTitle}>Recent Activity</Text>

        <View style={professionalProfileStyles.activityList}>
          <View style={professionalProfileStyles.activityItem}>
            <View style={professionalProfileStyles.activityIcon}>
              <MaterialIcons name="event" size={20} color="#667eea" />
            </View>
            <View style={professionalProfileStyles.activityContent}>
              <Text style={professionalProfileStyles.activityTitle}>Session with Dr. Sarah Johnson</Text>
              <Text style={professionalProfileStyles.activitySubtitle}>Completed • Dec 15, 2024</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </View>

          <View style={professionalProfileStyles.activityItem}>
            <View style={professionalProfileStyles.activityIcon}>
              <MaterialIcons name="book" size={20} color="#10b981" />
            </View>
            <View style={professionalProfileStyles.activityContent}>
              <Text style={professionalProfileStyles.activityTitle}>Journal Entry Added</Text>
              <Text style={professionalProfileStyles.activitySubtitle}>Today • 2:30 PM</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </View>

          <View style={professionalProfileStyles.activityItem}>
            <View style={professionalProfileStyles.activityIcon}>
              <MaterialIcons name="medication" size={20} color="#f59e0b" />
            </View>
            <View style={professionalProfileStyles.activityContent}>
              <Text style={professionalProfileStyles.activityTitle}>Prescription Updated</Text>
              <Text style={professionalProfileStyles.activitySubtitle}>Dec 10, 2024</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={professionalProfileStyles.section}>
        <Text style={professionalProfileStyles.sectionTitle}>Quick Actions</Text>

        <View style={professionalProfileStyles.actionsGrid}>
          <TouchableOpacity 
            style={professionalProfileStyles.actionCard}
            onPress={() => navigation.navigate('Doctors' as never)}
          >
            <View style={professionalProfileStyles.actionIcon}>
              <MaterialIcons name="event" size={24} color="#667eea" />
            </View>
            <Text style={professionalProfileStyles.actionTitle}>Book Session</Text>
            <Text style={professionalProfileStyles.actionSubtitle}>Schedule appointment</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={professionalProfileStyles.actionCard}
            onPress={() => navigation.navigate('Chat' as never)}
          >
            <View style={professionalProfileStyles.actionIcon}>
              <MaterialIcons name="chat" size={24} color="#10b981" />
            </View>
            <Text style={professionalProfileStyles.actionTitle}>Message Doctor</Text>
            <Text style={professionalProfileStyles.actionSubtitle}>Send secure message</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={professionalProfileStyles.actionCard}
            onPress={() => {
              navigation.navigate('Prescriptions' as never);
              Alert.alert(
                'Refill Request',
                'Navigate to your prescriptions to request a refill.',
                [{ text: 'OK' }]
              );
            }}
          >
            <View style={professionalProfileStyles.actionIcon}>
              <MaterialIcons name="medication" size={24} color="#f59e0b" />
            </View>
            <Text style={professionalProfileStyles.actionTitle}>Refill Request</Text>
            <Text style={professionalProfileStyles.actionSubtitle}>Request prescription</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={professionalProfileStyles.actionCard}
            onPress={() => {
              Alert.alert(
                'Emergency Help',
                'In case of emergency, please call:\n\nEmergency: 911\nCrisis Hotline: 988\n\nWould you like to call emergency services?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Call 911', 
                    style: 'destructive',
                    onPress: () => {
                      Alert.alert('Emergency', 'Please dial 911 on your phone for immediate assistance.');
                    }
                  },
                ]
              );
            }}
          >
            <View style={professionalProfileStyles.actionIcon}>
              <MaterialIcons name="emergency" size={24} color="#ef4444" />
            </View>
            <Text style={professionalProfileStyles.actionTitle}>Emergency</Text>
            <Text style={professionalProfileStyles.actionSubtitle}>24/7 crisis support</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Logout Button */}
      <View style={professionalProfileStyles.logoutSection}>
        <TouchableOpacity
          style={professionalProfileStyles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color="#dc2626" />
          <Text style={professionalProfileStyles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={professionalProfileStyles.bottomSpacing} />
    </ScrollView>
  );
};

const professionalProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Header
  header: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSection: {
    marginRight: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#e0e7ff',
    fontWeight: '600',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#e0e7ff',
    fontWeight: '500',
    marginBottom: 2,
  },
  patientId: {
    fontSize: 14,
    color: '#c7d2fe',
    fontWeight: '600',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Health Overview
  healthOverview: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Compact horizontal metrics
  metricsHorizontalScroll: {
    paddingHorizontal: 4,
  },
  metricCardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricIconCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricValueCompact: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  metricLabelCompact: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },

  // Sections
  section: {
    padding: 20,
    paddingTop: 0,
  },

  // Activity
  activityList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },

  // Settings
  settingsList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },

  // Logout
  logoutSection: {
    padding: 20,
    paddingTop: 0,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
  },

  bottomSpacing: {
    height: 40,
  },
});

export default ProfileScreen;
