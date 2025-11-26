import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();

  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    location: true,
    analytics: false,
    darkMode: false,
    sound: true,
    vibration: true,
  });

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

  const handleSettingToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavigate = (screen: string) => {
    // Map screen names to actual navigation or show helpful alerts
    const screenMap: { [key: string]: () => void } = {
      'EditProfile': () => {
        Alert.alert('Edit Profile', 'Profile editing feature coming soon! You can update your information from the Profile screen.');
      },
      'ChangePassword': () => {
        Alert.alert('Change Password', 'Password change feature coming soon! Please contact support for password changes.');
      },
      'Privacy': () => {
        Alert.alert('Privacy Settings', 'Privacy settings are managed through your device settings and app permissions.');
      },
      'DataSharing': () => {
        Alert.alert('Data Sharing', 'Your data is securely stored and only shared with your healthcare providers as needed for treatment.');
      },
      'BlockedUsers': () => {
        Alert.alert('Blocked Users', 'You currently have no blocked users. Contact support if you need to block someone.');
      },
      'MoodTracking': () => {
        Alert.alert('Mood Tracking', 'Mood tracking is available on your Dashboard. Check it out!');
      },
      'Help': () => {
        Alert.alert('Help Center', 'For help, please contact support at support@telepsy.com or call 1-800-TELEPSY.');
      },
      'Support': () => {
        Alert.alert('Contact Support', 'Email: support@telepsy.com\nPhone: 1-800-TELEPSY\nHours: 24/7');
      },
      'PrivacyPolicy': () => {
        Alert.alert('Privacy Policy', 'Our privacy policy is available at www.telepsy.com/privacy');
      },
      'Terms': () => {
        Alert.alert('Terms of Service', 'Our terms of service are available at www.telepsy.com/terms');
      },
    };

    const handler = screenMap[screen];
    if (handler) {
      handler();
    } else {
      Alert.alert('Information', `${screen} feature coming soon!`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.settingsList}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleNavigate('EditProfile')}
          >
            <View style={styles.settingIcon}>
              <MaterialIcons name="person" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Edit Profile</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleNavigate('ChangePassword')}
          >
            <View style={styles.settingIcon}>
              <MaterialIcons name="lock" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Change Password</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleNavigate('Privacy')}
          >
            <View style={styles.settingIcon}>
              <MaterialIcons name="security" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Privacy Settings</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.settingsList}>
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialIcons name="notifications" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              value={settings.notifications}
              onValueChange={() => handleSettingToggle('notifications')}
              trackColor={{ false: '#767577', true: '#667eea' }}
              thumbColor={settings.notifications ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialIcons name="schedule" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Appointment Reminders</Text>
            <Switch
              value={settings.notifications}
              onValueChange={() => handleSettingToggle('notifications')}
              trackColor={{ false: '#767577', true: '#667eea' }}
              thumbColor={settings.notifications ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialIcons name="medication" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Medication Alerts</Text>
            <Switch
              value={settings.notifications}
              onValueChange={() => handleSettingToggle('notifications')}
              trackColor={{ false: '#767577', true: '#667eea' }}
              thumbColor={settings.notifications ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialIcons name="volume-up" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Sound</Text>
            <Switch
              value={settings.sound}
              onValueChange={() => handleSettingToggle('sound')}
              trackColor={{ false: '#767577', true: '#667eea' }}
              thumbColor={settings.sound ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialIcons name="vibration" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Vibration</Text>
            <Switch
              value={settings.vibration}
              onValueChange={() => handleSettingToggle('vibration')}
              trackColor={{ false: '#767577', true: '#667eea' }}
              thumbColor={settings.vibration ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      {/* Privacy & Safety Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Safety</Text>

        <View style={styles.settingsList}>
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialIcons name="location-on" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Location Services</Text>
            <Switch
              value={settings.location}
              onValueChange={() => handleSettingToggle('location')}
              trackColor={{ false: '#767577', true: '#667eea' }}
              thumbColor={settings.location ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleNavigate('DataSharing')}
          >
            <View style={styles.settingIcon}>
              <MaterialIcons name="share" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Data Sharing</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleNavigate('BlockedUsers')}
          >
            <View style={styles.settingIcon}>
              <MaterialIcons name="block" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Blocked Users</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Activity & Wellness Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity & Wellness</Text>

        <View style={styles.settingsList}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleNavigate('MoodTracking')}
          >
            <View style={styles.settingIcon}>
              <MaterialIcons name="mood" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Mood Tracking</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Support & About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & About</Text>

        <View style={styles.settingsList}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleNavigate('Help')}
          >
            <View style={styles.settingIcon}>
              <MaterialIcons name="help" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Help Center</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleNavigate('Support')}
          >
            <View style={styles.settingIcon}>
              <MaterialIcons name="contact-support" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Contact Support</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleNavigate('PrivacyPolicy')}
          >
            <View style={styles.settingIcon}>
              <MaterialIcons name="policy" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleNavigate('Terms')}
          >
            <View style={styles.settingIcon}>
              <MaterialIcons name="description" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>Terms of Service</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialIcons name="info" size={20} color="#6b7280" />
            </View>
            <Text style={styles.settingLabel}>App Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#667eea',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },

  // Sections
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 10,
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
  versionText: {
    fontSize: 14,
    color: '#6b7280',
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

export default SettingsScreen;