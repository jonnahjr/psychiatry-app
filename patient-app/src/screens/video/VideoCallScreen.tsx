import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
// `react-native-webrtc` is a native module and may not be available
// in managed Expo or some environments. We dynamically import it
// at runtime and guard all usages so the app doesn't crash when
// the native module is missing.
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { apiService } from '../../services/api.service';

const { width, height } = Dimensions.get('window');

const VideoCallScreen = () => {
  const { user } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<any>(null);
  const localStreamRef = useRef<any>(null);
  const [webrtc, setWebRTC] = useState<any>(null);
  const [RTCViewComp, setRTCViewComp] = useState<any>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [localStream, setLocalStream] = useState<any>(null);
  const [appointmentId, setAppointmentId] = useState<string>('');
  const isExpoGo = false; // For now, assume we're not in Expo Go

  const socketURL = useMemo(() => {
    try {
      const base = apiService.getBaseURL();
      if (!base) {
        return 'http://localhost:5000';
      }
      return base.replace(/\/api\/?$/, '');
    } catch {
      return 'http://localhost:5000';
    }
  }, []);

  // WebRTC configuration
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    const params = route.params as { appointmentId?: string } | undefined;
    if (params?.appointmentId) {
      setAppointmentId(params.appointmentId);
    } else {
      setAppointmentId('demo-appointment-1');
    }
  }, [route.params]);

  const loadWebRTCModule = useCallback(async () => {
    if (isExpoGo) {
      console.warn('react-native-webrtc is not available inside Expo Go.');
      setWebRTC(null);
      setRTCViewComp(null);
      return;
    }

    try {
      const mod = await import('react-native-webrtc');
      setWebRTC(mod);
      setRTCViewComp(mod.RTCView || (mod as any).default?.RTCView || null);
    } catch (err) {
      console.warn('react-native-webrtc not available:', err);
      setWebRTC(null);
      setRTCViewComp(null);
    }
  }, [isExpoGo]);

  useEffect(() => {
    if (!appointmentId) {
      return;
    }

    loadWebRTCModule();
    requestPermissions();
    initializeSocket(appointmentId);

    return () => {
      cleanup(false);
    };
  }, [appointmentId, loadWebRTCModule]);

  const requestPermissions = async () => {
    try {
      if (Platform.OS !== 'android') {
        return;
      }

      if (isExpoGo) {
        console.warn('Skipping native permission request in Expo Go environment.');
        return;
      }

      const permissions = await import('react-native-permissions');
      const results = await permissions.requestMultiple([
        permissions.PERMISSIONS.ANDROID.CAMERA,
        permissions.PERMISSIONS.ANDROID.RECORD_AUDIO,
      ]);

      if (
        results[permissions.PERMISSIONS.ANDROID.CAMERA] !== 'granted' ||
        results[permissions.PERMISSIONS.ANDROID.RECORD_AUDIO] !== 'granted'
      ) {
        Alert.alert('Permissions Required', 'Camera and microphone permissions are required for video calls.');
        return;
      }
    } catch (error) {
      console.warn('Error requesting permissions or permissions module unavailable:', error);
    }
  };

  const initializeSocket = (id: string) => {
    if (!id) {
      console.error('No appointment ID provided for socket connection');
      return;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(socketURL, {
      transports: ['websocket'],
      timeout: 20000,
      forceNew: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to signaling server');
      setIsConnected(true);
      socketRef.current?.emit('join-appointment', id);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from signaling server');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // WebRTC signaling handlers
    socketRef.current.on('video-offer', handleOffer);
    socketRef.current.on('video-answer', handleAnswer);
    socketRef.current.on('ice-candidate', handleIceCandidate);
    socketRef.current.on('call-ended', handleCallEnd);
  };

  const getUserMedia = async () => {
    try {
      if (!webrtc || !webrtc.mediaDevices) {
        throw new Error('WebRTC not available in this environment');
      }

      const stream = await webrtc.mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 640,
            minHeight: 480,
            minFrameRate: 30,
          },
          facingMode: 'user',
        },
      });
      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Error getting user media:', error);
      Alert.alert('Error', 'Failed to access camera and microphone');
      throw error;
    }
  };

  const createPeerConnection = () => {
    if (!webrtc || !webrtc.RTCPeerConnection) {
      console.warn('RTCPeerConnection not available');
      return;
    }

    peerConnectionRef.current = new webrtc.RTCPeerConnection(configuration);

    // Add local stream tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track: any) => {
        peerConnectionRef.current?.addTrack(track, localStreamRef.current);
      });
    }

    // Handle remote stream
    peerConnectionRef.current.ontrack = (event: any) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event: any) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          appointmentId,
          candidate: event.candidate,
        });
      }
    };

    // Handle connection state changes
    peerConnectionRef.current.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnectionRef.current?.connectionState);
    };
  };

  const startCall = async () => {
    try {
      if (!appointmentId) {
        Alert.alert('Error', 'No appointment ID provided');
        return;
      }

      if (!socketRef.current?.connected) {
        Alert.alert('Error', 'Not connected to server. Please check your connection.');
        return;
      }

      if (!webrtc) {
        Alert.alert('Video Unavailable', 'Video calls are not available in this environment.');
        return;
      }

      const stream = await getUserMedia();
      createPeerConnection();

      if (!peerConnectionRef.current) {
        throw new Error('Peer connection could not be created');
      }

      // Create offer
      const offer = await peerConnectionRef.current.createOffer({});
      await peerConnectionRef.current.setLocalDescription(offer);

      // Send offer through signaling
      socketRef.current?.emit('video-offer', {
        appointmentId,
        offer,
      });

      setIsCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);
      Alert.alert('Error', 'Failed to start video call');
    }
  };

  const handleOffer = async (data: any) => {
    try {
      if (!socketRef.current?.connected) {
        console.error('Socket not connected, cannot handle offer');
        return;
      }

      if (!peerConnectionRef.current) {
        const stream = await getUserMedia();
        createPeerConnection();
      }

      if (!webrtc || !webrtc.RTCSessionDescription) {
        throw new Error('RTCSessionDescription not available');
      }

      await peerConnectionRef.current!.setRemoteDescription(
        new webrtc.RTCSessionDescription(data.offer)
      );

      const answer = await peerConnectionRef.current!.createAnswer();
      await peerConnectionRef.current!.setLocalDescription(answer);

      socketRef.current?.emit('video-answer', {
        appointmentId,
        answer,
      });

      setIsCallActive(true);
    } catch (error) {
      console.error('Error handling offer:', error);
      Alert.alert('Error', 'Failed to join video call');
    }
  };

  const handleAnswer = async (data: any) => {
    try {
      if (!peerConnectionRef.current) {
        console.error('No peer connection available for answer');
        return;
      }

      if (!webrtc || !webrtc.RTCSessionDescription) {
        throw new Error('RTCSessionDescription not available');
      }

      await peerConnectionRef.current!.setRemoteDescription(
        new webrtc.RTCSessionDescription(data.answer)
      );
    } catch (error) {
      console.error('Error handling answer:', error);
      Alert.alert('Error', 'Failed to establish video connection');
    }
  };

  const handleIceCandidate = async (data: any) => {
    try {
      if (!peerConnectionRef.current) {
        console.error('No peer connection available for ICE candidate');
        return;
      }

      if (data.candidate) {
        if (!webrtc || !webrtc.RTCIceCandidate) {
          console.warn('RTCIceCandidate not available');
          return;
        }

        await peerConnectionRef.current!.addIceCandidate(
          new webrtc.RTCIceCandidate(data.candidate)
        );
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
      // ICE candidate errors are often non-critical, so we don't show alerts
    }
  };

  const endCall = () => {
    socketRef.current?.emit('end-call', { appointmentId });
    cleanup();
    navigation.goBack();
  };

  const handleCallEnd = () => {
    Alert.alert('Call Ended', 'The other participant has ended the call');
    cleanup();
    navigation.goBack();
  };

  const cleanup = (resetAppointment = true) => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track: any) => {
          if (track.stop) {
            track.stop();
          }
        });
        setLocalStream(null);
        localStreamRef.current = null;
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      setRemoteStream(null);
      setIsCallActive(false);
      setIsConnected(false);
      if (resetAppointment) {
        setAppointmentId('');
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* If WebRTC is not available show a small message */}
      {!webrtc && (
        <View style={{ padding: 20 }}>
          <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 10 }}>
            Video calls are not available in this environment.
          </Text>
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            Use a native build or a development client with native modules enabled to test video calls.
          </Text>
        </View>
      )}

      {/* Remote Video */}
      {RTCViewComp && remoteStream && (
        <RTCViewComp
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="cover"
        />
      )}

      {/* Local Video */}
      {RTCViewComp && localStream && (
        <RTCViewComp
          streamURL={localStream.toURL()}
          style={styles.localVideo}
          objectFit="cover"
        />
      )}

      {/* Call Controls */}
      <View style={styles.controls}>
        {!isCallActive ? (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={startCall}
            disabled={!isConnected}
          >
            <Text style={styles.buttonText}>
              {isConnected ? 'Start Call' : 'Connecting...'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.endButton]}
            onPress={endCall}
          >
            <Text style={styles.buttonText}>End Call</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status */}
      <View style={styles.status}>
        <Text style={styles.statusText}>
          {isConnected ? 'Connected to server' : 'Connecting...'}
        </Text>
        {isCallActive && (
          <Text style={styles.statusText}>Call in progress</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideo: {
    flex: 1,
    width: width,
    height: height,
  },
  localVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 150,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  endButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default VideoCallScreen;