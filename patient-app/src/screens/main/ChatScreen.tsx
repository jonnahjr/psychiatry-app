import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GlassCard } from '../../components/GlassCard';
import { MedicalButton } from '../../components/MedicalButton';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'doctor';
  timestamp: Date;
  type: 'text' | 'system';
}

interface ChatSession {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

const ChatScreen = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const [chatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialty: 'Clinical Psychologist',
      lastMessage: 'How have you been feeling this week?',
      lastMessageTime: '2:30 PM',
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialty: 'Psychiatrist',
      lastMessage: 'Your prescription refill is ready',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: '3',
      doctorName: 'Dr. Emily Rodriguez',
      doctorSpecialty: 'Therapist',
      lastMessage: 'See you at our next session!',
      lastMessageTime: '2 days ago',
      unreadCount: 1,
      isOnline: true,
    },
  ]);

  // Sample messages for active chat
  useEffect(() => {
    if (activeChat) {
      const sampleMessages: Message[] = [
        {
          id: '1',
          text: 'Hello! How are you feeling today?',
          sender: 'doctor',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text',
        },
        {
          id: '2',
          text: 'I\'ve been feeling a bit anxious lately, especially about work.',
          sender: 'user',
          timestamp: new Date(Date.now() - 3300000),
          type: 'text',
        },
        {
          id: '3',
          text: 'That\'s completely understandable. Work-related stress is very common. Let\'s talk about some coping strategies.',
          sender: 'doctor',
          timestamp: new Date(Date.now() - 3000000),
          type: 'text',
        },
        {
          id: '4',
          text: 'I\'d like that. What would you recommend?',
          sender: 'user',
          timestamp: new Date(Date.now() - 2700000),
          type: 'text',
        },
        {
          id: '5',
          text: 'Great question! Here are a few evidence-based techniques...',
          sender: 'doctor',
          timestamp: new Date(Date.now() - 2400000),
          type: 'text',
        },
      ];
      setMessages(sampleMessages);
    }
  }, [activeChat]);

  const sendMessage = () => {
    if (message.trim() && activeChat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Simulate doctor's response
      setTimeout(() => {
        const doctorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for sharing that. I\'m here to help you through this.',
          sender: 'doctor',
          timestamp: new Date(),
          type: 'text',
        };
        setMessages(prev => [...prev, doctorResponse]);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <Animated.View
      entering={SlideInRight}
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.doctorMessage
      ]}
    >
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.doctorBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userText : styles.doctorText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          item.sender === 'user' ? styles.userTime : styles.doctorTime
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </Animated.View>
  );

  const renderChatSession = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      style={[
        styles.chatSession,
        activeChat === item.id && styles.activeChatSession
      ]}
      onPress={() => setActiveChat(item.id)}
    >
      <View style={styles.doctorAvatar}>
        <Text style={styles.avatarText}>
          {item.doctorName.split(' ').map(n => n[0]).join('')}
        </Text>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.doctorName}>{item.doctorName}</Text>
          <Text style={styles.lastMessageTime}>{item.lastMessageTime}</Text>
        </View>
        <Text style={styles.doctorSpecialty}>{item.doctorSpecialty}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (!activeChat) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn} style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.subtitle}>Connect with your healthcare providers</Text>
        </Animated.View>

        <FlatList
          data={chatSessions}
          renderItem={renderChatSession}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptyText}>
                Start a conversation with your healthcare provider
              </Text>
            </View>
          }
        />
      </View>
    );
  }

  const activeSession = chatSessions.find(session => session.id === activeChat);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat Header */}
      <Animated.View entering={FadeIn} style={styles.chatHeaderContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setActiveChat(null)}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.chatHeaderInfo}>
          <Text style={styles.chatDoctorName}>{activeSession?.doctorName}</Text>
          <Text style={styles.chatDoctorSpecialty}>{activeSession?.doctorSpecialty}</Text>
        </View>

        <View style={styles.chatHeaderActions}>
          <TouchableOpacity style={styles.headerAction}>
            <Text style={styles.headerActionIcon}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Text style={styles.headerActionIcon}>📹</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Message Input */}
      <Animated.View entering={FadeInUp} style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.attachButton}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.messageInput}
            placeholder="Type your message..."
            placeholderTextColor={colors.gray[400]}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Text style={styles.sendIcon}>📤</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
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
  chatList: {
    padding: spacing.xl,
  },
  chatSession: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  activeChatSession: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
    position: 'relative',
  },
  avatarText: {
    fontSize: typography.h3.size,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.gray[900],
  },
  lastMessageTime: {
    fontSize: typography.small.size,
    color: colors.gray[500],
  },
  doctorSpecialty: {
    fontSize: typography.small.size,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  lastMessage: {
    fontSize: typography.caption.size,
    color: colors.gray[600],
  },
  unreadBadge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  unreadCount: {
    fontSize: typography.small.size,
    fontWeight: '700',
    color: '#FFFFFF',
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
  chatHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    ...shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  backIcon: {
    fontSize: 20,
    color: colors.gray[700],
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatDoctorName: {
    fontSize: typography.h3.size,
    fontWeight: typography.h3.weight,
    color: colors.gray[900],
  },
  chatDoctorSpecialty: {
    fontSize: typography.caption.size,
    color: colors.primary,
  },
  chatHeaderActions: {
    flexDirection: 'row',
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  headerActionIcon: {
    fontSize: 18,
  },
  messagesContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  messageContainer: {
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  doctorMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: colors.primary,
  },
  doctorBubble: {
    backgroundColor: '#FFFFFF',
    ...shadows.sm,
  },
  messageText: {
    fontSize: typography.body.size,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  doctorText: {
    color: colors.gray[900],
  },
  messageTime: {
    fontSize: typography.small.size,
    marginTop: spacing.xs,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  doctorTime: {
    color: colors.gray[500],
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    padding: spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  attachIcon: {
    fontSize: 18,
    color: colors.gray[600],
  },
  messageInput: {
    flex: 1,
    fontSize: typography.body.size,
    color: colors.gray[900],
    maxHeight: 100,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  sendIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default ChatScreen;