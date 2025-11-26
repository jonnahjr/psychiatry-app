import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows } from '../utils/theme';

interface TabItem {
  name: string;
  icon: string;
  screen: string;
  badge?: number;
}

const tabs: TabItem[] = [
  { name: 'Home', icon: '🏠', screen: 'Dashboard' },
  { name: 'Appointments', icon: '📅', screen: 'Appointments' },
  { name: 'Chat', icon: '💬', screen: 'Chat' },
  { name: 'Profile', icon: '👤', screen: 'Profile' },
];

export const BottomTabNavigator = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleTabPress = (tab: TabItem) => {
    // @ts-ignore
    navigation.navigate(tab.screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = route.name === tab.screen;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.8}
            >
              <View style={[styles.tabIcon, isActive && styles.activeTabIcon]}>
                <Text style={[styles.tabIconText, isActive && styles.activeTabIconText]}>
                  {tab.icon}
                </Text>
                {tab.badge && tab.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.name}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Safe area padding for devices with home indicator */}
      <View style={styles.safeArea} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...shadows.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    position: 'relative',
  },
  tabIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    position: 'relative',
  },
  activeTabIcon: {
    backgroundColor: colors.primary + '15',
  },
  tabIconText: {
    fontSize: 20,
    color: colors.gray[500],
  },
  activeTabIconText: {
    color: colors.primary,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  tabLabel: {
    fontSize: 11,
    color: colors.gray[500],
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -spacing.sm,
    width: 32,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  safeArea: {
    height: 34, // iPhone home indicator height
  },
});