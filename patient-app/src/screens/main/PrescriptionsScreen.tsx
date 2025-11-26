import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInRight,
} from 'react-native-reanimated';
import { GlassCard } from '../../components/GlassCard';
import { MedicalButton } from '../../components/MedicalButton';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  prescribedDate: string;
  status: 'active' | 'completed' | 'discontinued';
  instructions: string;
  refillsRemaining: number;
  pharmacy: string;
  sideEffects?: string[];
  interactions?: string[];
}

const PrescriptionsScreen = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const [prescriptions] = useState<Prescription[]>([
    {
      id: '1',
      medication: 'Sertraline',
      dosage: '50mg',
      frequency: 'Once daily',
      duration: '3 months',
      prescribedBy: 'Dr. Sarah Johnson',
      prescribedDate: '2024-01-15',
      status: 'active',
      instructions: 'Take one tablet by mouth every morning with food. Do not abruptly stop taking this medication.',
      refillsRemaining: 2,
      pharmacy: 'CVS Pharmacy - Mission St',
      sideEffects: ['Nausea', 'Dizziness', 'Insomnia'],
      interactions: ['MAOIs', 'Warfarin'],
    },
    {
      id: '2',
      medication: 'Lorazepam',
      dosage: '0.5mg',
      frequency: 'As needed, max 3x daily',
      duration: 'PRN (as needed)',
      prescribedBy: 'Dr. Michael Chen',
      prescribedDate: '2024-01-10',
      status: 'active',
      instructions: 'Take as needed for anxiety. Do not exceed 3 tablets per day. Avoid alcohol.',
      refillsRemaining: 1,
      pharmacy: 'Walgreens - Castro St',
      sideEffects: ['Drowsiness', 'Dizziness', 'Confusion'],
      interactions: ['Alcohol', 'Opioids'],
    },
    {
      id: '3',
      medication: 'Fluoxetine',
      dosage: '20mg',
      frequency: 'Once daily',
      duration: '6 months',
      prescribedBy: 'Dr. Emily Rodriguez',
      prescribedDate: '2023-12-01',
      status: 'completed',
      instructions: 'Completed treatment course. Follow up if symptoms return.',
      refillsRemaining: 0,
      pharmacy: 'CVS Pharmacy - Mission St',
    },
  ]);

  const filteredPrescriptions = prescriptions.filter(prescription => {
    if (activeTab === 'active') {
      return prescription.status === 'active';
    }
    return prescription.status === 'completed' || prescription.status === 'discontinued';
  });

  const handleRefillRequest = (prescription: Prescription) => {
    Alert.alert(
      'Request Refill',
      `Request a refill for ${prescription.medication}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: () => Alert.alert('Success', 'Refill request sent to your pharmacy')
        },
      ]
    );
  };

  const handleViewDetails = (prescription: Prescription) => {
    Alert.alert(
      'Prescription Details',
      `${prescription.medication} ${prescription.dosage}\n\nPrescribed by: ${prescription.prescribedBy}\nDate: ${prescription.prescribedDate}\n\nInstructions: ${prescription.instructions}`,
      [{ text: 'OK' }]
    );
  };

  const handleContactPharmacy = (prescription: Prescription) => {
    Alert.alert(
      'Contact Pharmacy',
      `Call ${prescription.pharmacy}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Alert.alert('Calling...', `Dialing ${prescription.pharmacy}`)
        },
      ]
    );
  };

  const renderPrescription = ({ item, index }: { item: Prescription; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      style={styles.prescriptionWrapper}
    >
      <TouchableOpacity
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.8}
      >
        <GlassCard style={styles.prescriptionCard}>
          <View style={styles.prescriptionHeader}>
            <View style={styles.medicationInfo}>
              <Text style={styles.medicationName}>{item.medication}</Text>
              <Text style={styles.dosageText}>{item.dosage} • {item.frequency}</Text>
            </View>

            <View style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'active' ? colors.success + '20' : colors.gray[100] }
            ]}>
              <Text style={[
                styles.statusText,
                { color: item.status === 'active' ? colors.success : colors.gray[600] }
              ]}>
                {item.status}
              </Text>
            </View>
          </View>

          <View style={styles.prescriptionDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>👨‍⚕️</Text>
              <Text style={styles.detailText}>{item.prescribedBy}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.detailText}>Prescribed: {item.prescribedDate}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🏥</Text>
              <Text style={styles.detailText}>{item.pharmacy}</Text>
            </View>

            {item.refillsRemaining > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🔄</Text>
                <Text style={styles.detailText}>{item.refillsRemaining} refills remaining</Text>
              </View>
            )}
          </View>

          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsLabel}>Instructions:</Text>
            <Text style={styles.instructionsText} numberOfLines={2}>
              {item.instructions}
            </Text>
          </View>

          {item.sideEffects && item.sideEffects.length > 0 && (
            <View style={styles.warningsSection}>
              <Text style={styles.warningsLabel}>⚠️ Possible side effects:</Text>
              <Text style={styles.warningsText}>
                {item.sideEffects.join(', ')}
              </Text>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => handleContactPharmacy(item)}
            >
              <Text style={styles.secondaryButtonText}>Contact Pharmacy</Text>
            </TouchableOpacity>

            {item.status === 'active' && item.refillsRemaining > 0 && (
              <MedicalButton
                title="Request Refill"
                onPress={() => handleRefillRequest(item)}
                variant="primary"
                size="small"
                style={styles.refillButton}
              />
            )}
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn} style={styles.header}>
        <Text style={styles.title}>My Prescriptions</Text>
        <Text style={styles.subtitle}>Manage your medications safely</Text>
      </Animated.View>

      {/* Tab Selector */}
      <Animated.View entering={SlideInRight.delay(200)} style={styles.tabContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'active' && styles.activeTabText
            ]}>
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText
            ]}>
              History
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Prescriptions List */}
      <FlatList
        data={filteredPrescriptions}
        renderItem={renderPrescription}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.prescriptionsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>
              {activeTab === 'active' ? '💊' : '📚'}
            </Text>
            <Text style={styles.emptyTitle}>
              {activeTab === 'active' ? 'No active prescriptions' : 'No prescription history'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'active'
                ? 'Your active medications will appear here'
                : 'Your prescription history will appear here'
              }
            </Text>
          </View>
        }
        ListHeaderComponent={
          activeTab === 'active' && filteredPrescriptions.length > 0 ? (
            <Animated.View entering={FadeInUp} style={styles.safetyNotice}>
              <GlassCard style={styles.safetyCard}>
                <View style={styles.safetyHeader}>
                  <Text style={styles.safetyIcon}>🛡️</Text>
                  <Text style={styles.safetyTitle}>Medication Safety</Text>
                </View>
                <Text style={styles.safetyText}>
                  Always take medications as prescribed. Contact your doctor before making changes.
                  Report any side effects immediately.
                </Text>
              </GlassCard>
            </Animated.View>
          ) : null
        }
      />

      {/* Quick Actions */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.quickActions}>
        <MedicalButton
          title="Find Pharmacy"
          onPress={() => {
            Alert.alert(
              'Find Pharmacy',
              'Search for nearby pharmacies:\n\n1. Use your device\'s map app\n2. Search "pharmacy near me"\n3. Call ahead to verify prescription availability\n\nWould you like to open your map app?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Open Maps', 
                  onPress: () => {
                    // In a real app, this would open the device's map app
                    Alert.alert('Maps', 'Please use your device\'s map app to find nearby pharmacies.');
                  }
                }
              ]
            );
          }}
          variant="secondary"
          size="medium"
          fullWidth
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    padding: spacing.xl,
    paddingBottom: spacing.lg,
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
  },
  tabContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: borderRadius.xl,
    padding: spacing.xs,
    ...shadows.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  tabText: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.gray[600],
  },
  activeTabText: {
    color: colors.primary,
  },
  prescriptionsList: {
    padding: spacing.xl,
    paddingTop: 0,
  },
  prescriptionWrapper: {
    marginBottom: spacing.lg,
  },
  prescriptionCard: {
    padding: spacing.xl,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: typography.h2.size,
    fontWeight: typography.h2.weight,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  dosageText: {
    fontSize: typography.caption.size,
    color: colors.primary,
    fontWeight: '600',
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
  prescriptionDetails: {
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: spacing.md,
    width: 24,
    textAlign: 'center',
  },
  detailText: {
    fontSize: typography.caption.size,
    color: colors.gray[700],
    flex: 1,
  },
  instructionsSection: {
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  instructionsLabel: {
    fontSize: typography.small.size,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  instructionsText: {
    fontSize: typography.caption.size,
    color: colors.gray[600],
    lineHeight: 18,
  },
  warningsSection: {
    backgroundColor: colors.warning + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  warningsLabel: {
    fontSize: typography.small.size,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  warningsText: {
    fontSize: typography.caption.size,
    color: colors.gray[700],
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: typography.small.size,
    color: colors.primary,
    fontWeight: '600',
  },
  refillButton: {
    flex: 1,
  },
  safetyNotice: {
    marginBottom: spacing.xl,
  },
  safetyCard: {
    padding: spacing.lg,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  safetyIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  safetyTitle: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.gray[900],
  },
  safetyText: {
    fontSize: typography.caption.size,
    color: colors.gray[600],
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.h2.size,
    fontWeight: typography.h2.weight,
    color: colors.gray[900],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.body.size,
    color: colors.gray[600],
    textAlign: 'center',
  },
  quickActions: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.xl,
    right: spacing.xl,
  },
});

export default PrescriptionsScreen;