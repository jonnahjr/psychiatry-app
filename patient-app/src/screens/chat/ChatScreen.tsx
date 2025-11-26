import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { AnimatedCard } from '../../components';

interface Message {
  id: string;
  text: string;
  sender: 'patient' | 'doctor';
  timestamp: Date;
}

const ChatScreen = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'doctor',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'patient',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate doctor response
    setTimeout(() => {
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. I will review this and get back to you shortly.',
        sender: 'doctor',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, doctorResponse]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.doctorInfo}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.avatar}
              >
                <Icon name="local-hospital" size={24} color="#667eea" />
              </LinearGradient>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.doctorText}>
              <Text style={styles.doctorName}>Dr. Smith</Text>
              <Text style={styles.doctorStatus}>Online</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="more-vert" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.sender === 'patient' ? styles.patientMessageWrapper : styles.doctorMessageWrapper,
            ]}
          >
            {message.sender === 'doctor' && (
              <View style={styles.avatarSmall}>
                <Icon name="local-hospital" size={16} color="#667eea" />
              </View>
            )}
            <AnimatedCard
              style={[
                styles.messageBubble,
                message.sender === 'patient' ? styles.patientBubble : styles.doctorBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.sender === 'patient' ? styles.patientText : styles.doctorMessageText,
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  message.sender === 'patient' ? styles.patientTimestamp : styles.doctorTimestamp,
                ]}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </AnimatedCard>
            {message.sender === 'patient' && (
              <View style={styles.avatarSmall}>
                <Icon name="person" size={16} color="#10b981" />
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendButtonGradient}
            >
              <Icon name="send" size={20} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={styles.inputHint}>
          Secure messaging • End-to-end encrypted
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  doctorText: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  doctorStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  patientMessageWrapper: {
    justifyContent: 'flex-end',
  },
  doctorMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  patientBubble: {
    backgroundColor: '#667eea',
    borderBottomRightRadius: 4,
  },
  doctorBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  patientText: {
    color: '#ffffff',
  },
  doctorMessageText: {
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  patientTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  doctorTimestamp: {
    color: '#9ca3af',
  },
  inputContainer: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937',
    maxHeight: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
    width: 40,
    height: 40,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputHint: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ChatScreen;
