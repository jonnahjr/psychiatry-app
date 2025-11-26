import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GlassCard } from '../../components/GlassCard';
import { MedicalButton } from '../../components/MedicalButton';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';

const { width, height } = Dimensions.get('window');

interface CallParticipant {
  id: string;
  name: string;
  role: 'doctor' | 'patient';
  avatar?: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
}

const VideoCallScreen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const controlsOpacity = useSharedValue(1);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const [participants] = useState<CallParticipant[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'doctor',
      isMuted: false,
      isVideoOn: true,
      isHandRaised: false,
    },
    {
      id: '2',
      name: 'You',
      role: 'patient',
      isMuted: false,
      isVideoOn: true,
      isHandRaised: false,
    },
  ]);

  useEffect(() => {
    // Simulate connection
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

    // Call duration timer
    const durationTimer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Auto-hide controls
    const hideControlsTimer = setTimeout(() => {
      setShowControls(false);
      controlsOpacity.value = withTiming(0.3);
    }, 3000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(durationTimer);
      clearTimeout(hideControlsTimer);
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleScreenTap = () => {
    setShowControls(true);
    controlsOpacity.value = withSpring(1);

    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }

    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
      controlsOpacity.value = withTiming(0.3);
    }, 3000);
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this call?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => navigation.goBack()
        },
      ]
    );
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    Alert.alert(
      isRecording ? 'Recording Stopped' : 'Recording Started',
      isRecording
        ? 'Your session recording has been saved.'
        : 'This session is now being recorded for your medical records.'
    );
  };

  const animatedControlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  if (!isConnected) {
    return (
      <View style={styles.connectingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

        {/* Background Video Placeholder */}
        <View style={styles.connectingBackground}>
          <View style={styles.doctorPlaceholder}>
            <Text style={styles.doctorInitials}>SJ</Text>
          </View>
        </View>

        {/* Connecting Overlay */}
        <Animated.View entering={FadeIn} style={styles.connectingOverlay}>
          <GlassCard style={styles.connectingCard}>
            <View style={styles.connectingSpinner}>
              <Text style={styles.connectingText}>Connecting...</Text>
              <View style={styles.spinner} />
            </View>

            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>Dr. Sarah Johnson</Text>
              <Text style={styles.doctorSpecialty}>Clinical Psychologist</Text>
            </View>

            <View style={styles.callType}>
              <Text style={styles.callTypeText}>Video Consultation</Text>
              <Text style={styles.appointmentTime}>Today at 10:00 AM</Text>
            </View>
          </GlassCard>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Main Video Area */}
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={handleScreenTap}
        activeOpacity={1}
      >
        {/* Remote Video (Doctor) */}
        <View style={styles.remoteVideo}>
          <View style={styles.doctorVideoPlaceholder}>
            <Text style={styles.doctorVideoInitials}>SJ</Text>
            <View style={styles.doctorStatus}>
              <View style={styles.doctorOnlineIndicator} />
              <Text style={styles.doctorStatusText}>Dr. Sarah Johnson</Text>
            </View>
          </View>
        </View>

        {/* Local Video (Self) */}
        <Animated.View entering={SlideInDown} style={styles.localVideo}>
          <View style={styles.selfVideoPlaceholder}>
            <Text style={styles.selfVideoText}>You</Text>
            {isMuted && <View style={styles.mutedIndicator}><Text style={styles.mutedIcon}>🔇</Text></View>}
          </View>
        </Animated.View>

        {/* Call Duration */}
        <Animated.View entering={FadeIn.delay(500)} style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
        </Animated.View>

        {/* Recording Indicator */}
        {isRecording && (
          <Animated.View entering={SlideInDown} style={styles.recordingIndicator}>
            <Text style={styles.recordingDot}>●</Text>
            <Text style={styles.recordingText}>REC</Text>
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* Controls Overlay */}
      <Animated.View style={[styles.controlsOverlay, animatedControlsStyle]}>
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowParticipants(!showParticipants)}
          >
            <Text style={styles.controlIcon}>👥</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowChat(!showChat)}
          >
            <Text style={styles.controlIcon}>💬</Text>
            {showChat && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <View style={styles.mainControls}>
            {/* Mute Button */}
            <TouchableOpacity
              style={[styles.controlButton, styles.largeControl, isMuted && styles.activeControl]}
              onPress={() => setIsMuted(!isMuted)}
            >
              <Text style={[styles.controlIcon, styles.largeIcon]}>
                {isMuted ? '🔇' : '🎤'}
              </Text>
              <Text style={styles.controlLabel}>Mute</Text>
            </TouchableOpacity>

            {/* Video Button */}
            <TouchableOpacity
              style={[styles.controlButton, styles.largeControl, !isVideoOn && styles.activeControl]}
              onPress={() => setIsVideoOn(!isVideoOn)}
            >
              <Text style={[styles.controlIcon, styles.largeIcon]}>
                {isVideoOn ? '📹' : '📷'}
              </Text>
              <Text style={styles.controlLabel}>Video</Text>
            </TouchableOpacity>

            {/* Hand Raise Button */}
            <TouchableOpacity
              style={[styles.controlButton, styles.largeControl, isHandRaised && styles.activeControl]}
              onPress={() => setIsHandRaised(!isHandRaised)}
            >
              <Text style={[styles.controlIcon, styles.largeIcon]}>✋</Text>
              <Text style={styles.controlLabel}>Raise Hand</Text>
            </TouchableOpacity>
          </View>

          {/* Secondary Controls */}
          <View style={styles.secondaryControls}>
            <TouchableOpacity
              style={[styles.controlButton, isRecording && styles.recordingControl]}
              onPress={toggleRecording}
            >
              <Text style={styles.controlIcon}>⏺️</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlIcon}>📱</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* End Call Button */}
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
          >
            <Text style={styles.endCallIcon}>📞</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Chat Panel */}
      {showChat && (
        <Animated.View entering={SlideInDown} style={styles.chatPanel}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Chat</Text>
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chatMessages}>
            <Text style={styles.chatPlaceholder}>No messages yet</Text>
          </View>

          <View style={styles.chatInput}>
            <Text style={styles.chatInputPlaceholder}>Type a message...</Text>
          </View>
        </Animated.View>
      )}

      {/* Participants Panel */}
      {showParticipants && (
        <Animated.View entering={SlideInDown} style={styles.participantsPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Participants ({participants.length})</Text>
            <TouchableOpacity onPress={() => setShowParticipants(false)}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {participants.map((participant) => (
            <View key={participant.id} style={styles.participantItem}>
              <View style={styles.participantAvatar}>
                <Text style={styles.participantInitials}>
                  {participant.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.participantInfo}>
                <Text style={styles.participantName}>{participant.name}</Text>
                <Text style={styles.participantRole}>{participant.role}</Text>
              </View>
              <View style={styles.participantStatus}>
                {participant.isMuted && <Text style={styles.statusIcon}>🔇</Text>}
                {!participant.isVideoOn && <Text style={styles.statusIcon}>📷</Text>}
                {participant.isHandRaised && <Text style={styles.statusIcon}>✋</Text>}
              </View>
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  connectingContainer: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  connectingBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInitials: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  connectingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  connectingCard: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  connectingSpinner: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  connectingText: {
    fontSize: typography.h2.size,
    fontWeight: typography.h2.weight,
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  spinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: colors.primary,
    borderTopColor: 'transparent',
    borderRadius: 20,
  },
  doctorInfo: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  doctorName: {
    fontSize: typography.h2.size,
    fontWeight: typography.h2.weight,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  doctorSpecialty: {
    fontSize: typography.caption.size,
    color: colors.primary,
    fontWeight: '600',
  },
  callType: {
    alignItems: 'center',
  },
  callTypeText: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  appointmentTime: {
    fontSize: typography.caption.size,
    color: colors.gray[600],
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorVideoPlaceholder: {
    alignItems: 'center',
  },
  doctorVideoInitials: {
    fontSize: 72,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.lg,
  },
  doctorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  doctorOnlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  doctorStatusText: {
    fontSize: typography.caption.size,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  localVideo: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.xl,
    width: 120,
    height: 160,
    borderRadius: borderRadius.lg,
    backgroundColor: '#333',
    overflow: 'hidden',
  },
  selfVideoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selfVideoText: {
    fontSize: typography.body.size,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  mutedIndicator: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mutedIcon: {
    fontSize: 12,
  },
  durationBadge: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  durationText: {
    fontSize: typography.caption.size,
    color: '#FFFFFF',
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  recordingIndicator: {
    position: 'absolute',
    top: spacing.xl,
    left: width / 2 - 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  recordingDot: {
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: spacing.xs,
  },
  recordingText: {
    fontSize: typography.small.size,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bottomControls: {
    alignItems: 'center',
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  largeControl: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  activeControl: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  recordingControl: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  controlIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  largeIcon: {
    fontSize: 28,
  },
  controlLabel: {
    fontSize: typography.small.size,
    color: '#FFFFFF',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  chatPanel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: '#FFFFFF',
    ...shadows.xl,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  chatTitle: {
    fontSize: typography.h3.size,
    fontWeight: typography.h3.weight,
    color: colors.gray[900],
  },
  closeIcon: {
    fontSize: 24,
    color: colors.gray[500],
  },
  chatMessages: {
    flex: 1,
    padding: spacing.lg,
  },
  chatPlaceholder: {
    fontSize: typography.body.size,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  chatInput: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  chatInputPlaceholder: {
    fontSize: typography.body.size,
    color: colors.gray[400],
  },
  participantsPanel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: '#FFFFFF',
    ...shadows.xl,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  panelTitle: {
    fontSize: typography.h3.size,
    fontWeight: typography.h3.weight,
    color: colors.gray[900],
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  participantInitials: {
    fontSize: typography.caption.size,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.gray[900],
  },
  participantRole: {
    fontSize: typography.small.size,
    color: colors.primary,
    textTransform: 'capitalize',
  },
  participantStatus: {
    flexDirection: 'row',
  },
  statusIcon: {
    fontSize: 16,
    marginLeft: spacing.xs,
  },
});

export default VideoCallScreen;